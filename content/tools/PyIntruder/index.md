
---
## 1. Idea arquitectónica

El proyecto se divide en dos mitades con una **dirección de dependencia estricta**:

```
gui/ ─ depende de ─▶ core/ ─ depende de ─▶ constants.py
```

- `core/`: es lógica pura de Python: parsea peticiones, genera las variantes del ataque, envía HTTP y orquesta la concurrencia. **No importa Tkinter.** Puede usarse desde un script o probarse sin interfaz.
- `gui/`: es solo presentación e interacción (Tkinter). Llama al núcleo, pero el núcleo nunca llama a la GUI.
- `constants.py`: no depende de nadie: contiene el marcador `§`, límites y la paleta de colores.

Esta separación es lo que permite, por ejemplo, verificar los cuatro tipos de ataque sin abrir una ventana, o reutilizar el motor en una herramienta de línea de comandos.

---

## 2. Flujo de datos de extremo a extremo

Qué ocurre desde que marcas una posición hasta que ves un resultado:

![[02_flujo_datos.png]]

1. Escribes la petición y marcas posiciones con `§` en el **editor**.
2. Al pulsar *Iniciar*, la app construye un **`RequestTemplate`** que separa la petición en partes fijas y posiciones.
3. **`generate_assignments`** produce, según el tipo de ataque, la secuencia de asignaciones de payloads a posiciones.
4. Por cada asignación, **`RequestTemplate.build`** reconstruye la petición concreta.
5. **`send_request`** la envía y devuelve un diccionario con estado, longitud, tiempo y la respuesta cruda.
6. El **motor** invoca un *callback* por cada resultado; ese callback deposita el dato en una **cola**, y la GUI la vacía periódicamente para pintar la tabla y los visores (ver §7, el puente de hilos).

---
## 3. `constants.py`

Define lo que ambas mitades necesitan sin crear dependencias cruzadas:

- `MARKER = "\u00a7"` → el carácter `§` que delimita posiciones.
- `MAX_VIEW_BODY` → tope de caracteres del cuerpo de respuesta que se guardan (evita que respuestas enormes consuman memoria).
- `MONO` → fuente monoespaciada de editores/visores.
- `COLORS` → diccionario con toda la paleta (método, cabeceras, clases de estado 2xx–5xx, resaltado de coincidencias, etc.). Centralizar los colores aquí permite cambiar el tema en un solo sitio.

---
## 4. El núcleo (`core/`)

![[04_hilos.png]]

### 4.1 `template.py` — `RequestTemplate`

Traduce una petición con marcadores en una estructura reutilizable. La clave está en `_parse`:

```python
parts = raw.split(MARKER)          # literal, base, literal, base, ..., literal
```

Al partir por `§`, los fragmentos **se alternan**: índice par = texto literal, índice impar = valor base de una posición. Por eso:

- `segments` guarda los **N+1** trozos literales.
- `base_values` guarda los **N** textos base (uno por posición).
- Si el número de `§` es impar, lanza `ValueError` (marcadores desparejados).

`build(assignment)` recompone la petición **intercalando** literales y valores:

```python
out = [self.segments[0]]
for idx, base in enumerate(self.base_values):
    value = assignment[idx]
    out.append(base if value is None else value)   # None = conservar base
    out.append(self.segments[idx + 1])
```

El detalle importante: un `None` en la posición significa "deja el valor base tal cual". Eso es exactamente lo que necesita **Sniper**, que ataca una posición y deja las demás intactas.
### 4.2 `attacks.py`

Dos funciones puras, sin estado:

**`generate_assignments(attack_type, num_positions, payload_sets)`** es un *generator* que produce tuplas `(assignment, label)`:
- `assignment`: lista de longitud `num_positions` (payload por posición, o `None`).
- `label`: texto para la columna *Payload* de la tabla.

La lógica de cada tipo:

| Tipo | Implementación | Efecto |
|---|---|---|
| **Sniper** | doble bucle: por cada posición, por cada payload; resto en `None` | ataca una posición por turno |
| **Battering ram** | `[p] * num_positions` | mismo payload en todas |
| **Pitchfork** | `zip(*payload_sets)` | iteración paralela; se detiene en el conjunto más corto |
| **Cluster bomb** | `itertools.product(*payload_sets)` | producto cartesiano (todas las combinaciones) |

Usar `zip` y `itertools.product` es lo que hace que Pitchfork y Cluster bomb sean tan concisos: la semántica "más corto" y "todas las combinaciones" ya viene dada por esas funciones estándar.

**`count_requests(...)`** replica cada caso pero solo **calcula el total** sin generar nada, para poder mostrar "Total: N" en el menú lateral antes de lanzar. Es un *generator* frente a un contador: la misma fórmula, pero uno produce y el otro cuenta.

### 4.3 `http_client.py` (parseo y envío)

**`parse_raw_request(raw)`** normaliza saltos `\r\n`→`\n`, separa cabecera y cuerpo por la primera línea en blanco (`\n\n`), toma la primera línea como línea de petición (método/ruta) y convierte el resto en un diccionario de cabeceras partiendo por el primer `:`.

**`send_request(...)`** hace el trabajo de red y devuelve **siempre un diccionario con la misma forma**:

```python
{"status": int|None, "length": int, "elapsed": float, "response": str, "error": str|None}
```

Puntos de diseño:

- Elige `HTTPSConnection` o `HTTPConnection` según el flag TLS. En HTTPS desactiva la verificación de certificado (`CERT_NONE`) para funcionar con los certificados autofirmados típicos de laboratorio.
- **Quita la cabecera `Host`** antes de enviar, porque `http.client` la gestiona por su cuenta; enviarla dos veces daría problemas.
- Reconstruye la **respuesta cruda completa** (`línea de estado` + cabeceras + `\n\n` + cuerpo) para que el visor pueda mostrarla y colorearla. El cuerpo se **trunca** a `MAX_VIEW_BODY`.
- Envuelve todo en `try/except`: los `timeout` y cualquier error de red se devuelven como `error` en el diccionario en lugar de propagar excepciones. Así el motor nunca se rompe por una petición fallida; simplemente esa fila muestra el error.

### 4.4 `engine.py` - `AttackEngine` (modelo productor/consumidor)

El motor es donde vive la concurrencia. Componentes:

- `self._stop = threading.Event()` → señal cooperativa de cancelación.
- `self._jobs = queue.Queue()` → cola de trabajos pendientes.
- `self._compiled_grep` → la expresión grep precompilada una sola vez.

El ciclo de vida:

```
start() ─► hilo _run()
             ├─ (productor) encola TODOS los (idx, assignment, label)
             ├─ lanza N hilos _worker()  (N = concurrencia)
             ├─ join() a todos
             └─ done_cb(stopped)
```

Cada **`_worker`** es un consumidor: saca un trabajo de la cola, llama a `template.build`, luego a `send_request`, arma el diccionario de resultado (añadiendo `request` y `response` para el visor y la cuenta de `grep`) y lo entrega por `result_cb`. Después duerme `delay` ms si se configuró.

Detalles que importan:
- **Cancelación cooperativa**: tanto el productor como los workers comprueban `self._stop.is_set()`; `stop()` solo activa la bandera y los hilos terminan por su cuenta. No se matan hilos a la fuerza.
- **Hilos `daemon=True`**: si cierras la ventana, no bloquean la salida del programa.
- **El grep se ejecuta aquí**, sobre la respuesta cruda completa, y devuelve un conteo como texto (`""` si no hay patrón). El resultado alimenta el resaltado de filas en la tabla.

---
## 5. La interfaz (`gui/`)

![[05_template.png]]

### 5.1 Patrón: `app.py` como controlador

`PyIntruderApp` (subclase de `tk.Tk`) es el **orquestador**. No mete la lógica de cada panel en sí mismo; en su lugar:

1. Crea los tres paneles (`RequestPanel`, `Sidebar`, `ResultsPanel`).
2. Los **conecta por una API mínima** en vez de que se conozcan entre ellos:

```python
self.sidebar = Sidebar(paned, self.request_panel.num_positions)   # provider
self.request_panel.on_positions_changed = self.sidebar.refresh_payload_sets
```

El menú lateral necesita saber cuántas posiciones hay (para ofrecer un conjunto de payloads por posición en Pitchfork/Cluster bomb). En lugar de acoplarlo al editor, recibe una **función proveedora** (`num_positions`) y el editor le avisa vía **callback** (`on_positions_changed`) cuando algo cambia. Los paneles no se importan entre sí; solo la app los une.

### 5.2 `highlighting.py` - coloreado por desplazamientos de caracteres

Funciones independientes que operan sobre cualquier widget `Text`, por eso el editor y los dos visores comparten el mismo coloreado.

- `configure_http_tags(w)` define los "tags" (estilos) una vez por widget.
- `highlight_request(w)` / `highlight_response(w)` recorren el texto por líneas llevando un **desplazamiento absoluto de caracteres** (`offset`), calculan el rango `[a, b)` de cada elemento (método, nombre de cabecera, valor, marcador, código de estado…) y aplican el tag con índices tipo `"1.0+{a}c"`.

La aritmética de offsets es el punto delicado: por cada línea se suma `len(line) + 1` (el `+1` es el `\n`). Los marcadores `§` se resaltan aparte buscando sus posiciones y emparejándolas de dos en dos. En la respuesta, el código de estado se colorea según su **clase** (`2`→verde, `3`→azul, `4`→naranja, `5`→rojo) mirando su primer dígito.

- `set_viewer(w, text, kind)` es el helper para los visores de **solo lectura**: habilita el widget, inserta el texto, lo colorea y lo vuelve a deshabilitar. Sin ese "enable/disable" no se podría escribir en un `Text` marcado como `disabled`.

### 5.3 `request_panel.py` - editor y objetivo

Encapsula el editor de la petición y los campos host/puerto/HTTPS. Expone una **API pública** que el resto del programa usa sin tocar los widgets por dentro: `get_raw()`, `num_positions()`, `get_host()`, `get_port()`, `get_tls()`.

Internamente, cada tecla dispara `_on_change`, que recolorea y recalcula el número de posiciones; si hay un `on_positions_changed` registrado, lo llama (así el menú lateral se entera). `_add_marker` envuelve la selección con `§…§`; `_autofill_target` rellena host/puerto leyendo la cabecera `Host`.

### 5.4 `sidebar.py` - el almacén de payloads y la ruptura del ciclo

El menú lateral guarda las listas de payloads en un diccionario **por índice de conjunto**: `self._payload_store = {1: "...", 2: "..."}`. Esto permite recordar la lista de cada posición al cambiar de conjunto en el desplegable (necesario para Pitchfork/Cluster bomb).

Aquí estaba el punto que hubo que diseñar con cuidado para **evitar recursión infinita**. Las responsabilidades se separan así:

- `_stash_current()` → **solo escribe** el texto actual en el almacén. Sin efectos secundarios.
- `_sets_from_store()` → **solo lee** del almacén y devuelve las listas. Sin efectos secundarios.
- `_update_count()` → llama a `_sets_from_store()` (lectura pura) para actualizar "Total: N".
- `get_payload_sets()` → `_stash_current()` + `_sets_from_store()`.

La clave: ni la lectura ni el conteo vuelven a llamar al guardado. En una versión anterior, guardar disparaba el conteo, el conteo recogía los conjuntos y recoger volvía a guardar → bucle sin fin. Separar "leer" de "escribir" rompe el ciclo.

### 5.5 `results_panel.py` - tabla y visores

- La tabla es un `ttk.Treeview`. Cada fila se inserta con **`iid = str(idx)`**, y en paralelo se guarda el diccionario completo en `self._result_map[iid] = r`. Así, al seleccionar una fila, se recupera el resultado por su `iid` y se vuelcan `request` y `response` en los visores con `set_viewer`.
- Las filas con coincidencia grep reciben el tag `"hit"` y se pintan de fondo distinto.
- `_sort_by(col)` ordena en memoria: para columnas numéricas convierte a `float` (los valores no numéricos caen al fondo), reordena los ítems y alterna ascendente/descendente guardando el estado por columna.
- `clear()` deja todo listo para un ataque nuevo: vacía la tabla, el mapa y los visores.

---

## 6. El puente de hilos (lo más importante de la GUI)

Tkinter **no es seguro para hilos**: solo el hilo principal puede tocar widgets. Pero el motor produce resultados desde varios hilos de trabajo. La solución es un patrón productor/consumidor con una cola:

```
hilos _worker ─ result_cb ─►  self._ui_queue ◄─ vacía cada 80 ms ─ _drain_ui_queue()
  (varios)    (put, seguro)       (Queue)        after(80, ...)     (hilo principal)
```

- Los callbacks del motor **no tocan widgets**; solo hacen `self._ui_queue.put((...))`, que es seguro entre hilos.
- `_drain_ui_queue` se reprograma sola con `self.after(80, ...)` y, en el **hilo principal**, saca lo que haya en la cola y actualiza la tabla, el progreso y los botones.

Este es el motivo por el que `AttackEngine` recibe `result_cb`/`done_cb` en lugar de escribir en la interfaz directamente: mantiene el núcleo ignorante de la GUI **y** respeta la regla de un solo hilo de Tkinter.

---
## 7. Puntos de entrada

- `pyintruder/__main__.py` → permite `python -m pyintruder` (llama a `gui.main`).
- `run.py` (raíz) → lanzador equivalente para `python run.py`.
- `pyproject.toml` → declara el *script* `pyintruder` para instalación con `pip install -e .`.

Los tres acaban en la misma función `main()`, que crea `PyIntruderApp()` y entra en `mainloop()`.

---

Para entender como usar esta herramienta puedes visitar mi github.
