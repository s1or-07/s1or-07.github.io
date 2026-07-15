_____________________
## Explicacion

Script sencillo para evitar la tediosa tarea de levantar un ambiente cada vez que se ocupe una herramienta.

Basicamente revisa la ruta donde se aloja dicha herramienta, verifica si existe un ambiente, de existir lo levanta y ejecuta la herramienta, de lo contrario lo crea y levanta la herramienta.

```shell
# Custom environment
# ------------------
# sqlmcenv

sqlmcenv(){
	if [ -d "/opt/sqlmc" ]; then
		pushd /opt/sqlmc > /dev/null 2>&1
		# Activar el entorno virtual
		source sqlmcenv/bin/activate
		popd > /dev/null 2>&1
	else
		echo "Directorio /opt/sqlmc no encontrado"
}
```

> [!TIP] Requerimiento
> Para quee funcione correctamente, el ejecutable debe ir ya previamente descargado y decompilado en el directorio correspondiente(`/opt/`).

