
## Datos Importantes a conocer

### OWASP TOP 10 - 2016

El **OWASP Mobile Top 10 de 2016** es una lista elaborada por la Open Web Application Security Project que identifica las diez principales amenazas de seguridad en aplicaciones móviles. A continuación, se detallan cada uno de estos riesgos:
#### ❌ Uso inadecuado de la Plataforma (M1)

**Este riesgo se presenta cuando los desarrolladores no siguen las directrices y prácticas recomendadas de la plataforma móvil, como el uso incorrecto de permisos, API's o configuraciones de seguridad. Esto puede llevar a vulnerabilidades explotables por atacantes.​**

Para que esta vulnerabilidad pueda ser explotada, la organización debe exponer un servicio web o una llamada API que sea consumida por la aplicación móvil. El servicio expuesto o la llamada API se implementa utilizando técnicas de codificación inseguras que producen una vulnerabilidad OWASP Top Ten en el servidor. A través de la interfaz móvil, un adversario es capaz de introducir entradas maliciosas o secuencias inesperadas de eventos en el punto final vulnerable. Por lo tanto, el adversario realiza la vulnerabilidad OWASP Top Ten original en el servidor.
Impactos técnicos

#### 📂 Almacenamiento Inseguro de Datos (M2)

**Ocurre cuando una aplicación guarda información sensible, como credenciales o datos personales, en ubicaciones no seguras del dispositivo, permitiendo que terceros accedan a esta información sin autorización.​**

Las vulnerabilidades de almacenamiento de datos inseguros se producen cuando los equipos de desarrollo asumen que los usuarios o los programas maliciosos no tendrán acceso al sistema de archivos de un dispositivo móvil y, por lo tanto, a la información confidencial almacenada en el dispositivo. Los sistemas de archivos son fácilmente accesibles. Las organizaciones deben esperar que un usuario malintencionado o un malware inspeccionen los almacenes de datos sensibles. Debe evitarse el uso de bibliotecas de cifrado deficientes. El rooting o jailbreaking de un dispositivo móvil elude cualquier protección de cifrado. Cuando los datos no están protegidos adecuadamente, sólo se necesitan herramientas especializadas para ver los datos de las aplicaciones.

#### ☎️ Comunicación Insegura (M3)

**Se refiere a la transmisión de datos sin cifrado o con cifrado débil entre la aplicación y servidores externos, lo que facilita la interceptación y manipulación de la información por parte de atacantes.​**

Las aplicaciones móviles no suelen proteger el tráfico de red. Pueden utilizar SSL/TLS durante la autenticación, pero no en otros casos. Esta incoherencia conlleva el riesgo de exponer los datos y los identificadores de sesión a la interceptación. El uso de la seguridad de transporte no significa que la aplicación la haya implementado correctamente. Para detectar fallos básicos, observe el tráfico de red del teléfono. Los fallos más sutiles requieren inspeccionar el diseño de la aplicación y su configuración.
#### 🔒 Autenticación Insegura (M4)

**Implica la implementación deficiente de mecanismos de autenticación, como contraseñas débiles o falta de verificación adecuada, lo que permite a usuarios no autorizados acceder a la aplicación o a sus datos.​**

Los esquemas de autenticación deficientes o inexistentes permiten a un adversario ejecutar funciones de forma anónima en la aplicación móvil o en el servidor backend utilizado por la aplicación móvil. La autenticación deficiente para aplicaciones móviles es bastante frecuente debido al factor de forma de entrada de un dispositivo móvil. El factor de forma fomenta en gran medida las contraseñas cortas que a menudo se basan exclusivamente en PIN de 4 dígitos. Los requisitos de autenticación para aplicaciones móviles pueden ser muy diferentes de los esquemas de autenticación web tradicionales debido a los requisitos de disponibilidad.

En las aplicaciones web tradicionales, se espera que los usuarios estén en línea y se autentiquen en tiempo real con un servidor backend. A lo largo de su sesión, existe una expectativa razonable de que tendrán acceso continuo a Internet.

En las aplicaciones móviles, no se espera que los usuarios estén conectados en todo momento durante su sesión. Las conexiones móviles a Internet son mucho menos fiables o predecibles que las conexiones web tradicionales. Por lo tanto, las aplicaciones móviles pueden tener requisitos de tiempo de actividad que requieran autenticación sin conexión. Este requisito de conexión puede tener profundas ramificaciones en los aspectos que los desarrolladores deben tener en cuenta a la hora de implementar la autenticación móvil.

Para detectar esquemas de autenticación deficientes, los probadores pueden realizar ataques binarios contra la aplicación móvil mientras está en modo «sin conexión». Mediante el ataque, el evaluador forzará a la aplicación a eludir la autenticación sin conexión y, a continuación, ejecutará funciones que deberían requerir autenticación sin conexión (para obtener más información sobre ataques binarios, consulte M10). Además, los probadores deben intentar ejecutar cualquier funcionalidad del servidor backend de forma anónima eliminando cualquier testigo de sesión de cualquier solicitud POST/GET para la funcionalidad de la aplicación móvil.

#### 🔢 Criptografía Insuficiente (M5)

**Se refiere al uso de algoritmos de cifrado obsoletos o mal implementados, lo que compromete la protección de la información sensible almacenada o transmitida por la aplicación.​**

Para explotar esta debilidad, un adversario debe conseguir devolver el código cifrado o los datos sensibles a su forma original sin cifrar debido a algoritmos de cifrado débiles o a fallos en el proceso de cifrado.
#### 🔏 Autorización Insegura (M6)

**Ocurre cuando la aplicación no verifica correctamente los permisos de los usuarios, permitiendo que individuos sin autorización accedan a funciones o datos restringidos.​**

Para comprobar la existencia de esquemas de autorización deficientes, los evaluadores pueden realizar ataques binarios contra la aplicación móvil e intentar ejecutar funcionalidades privilegiadas que solo deberían poder ejecutarse con un usuario con privilegios superiores mientras la aplicación móvil se encuentra en modo «sin conexión» (para obtener más información sobre ataques binarios, consulte M9 y M10). Además, los probadores deben intentar ejecutar cualquier funcionalidad privilegiada utilizando un token de sesión de bajo privilegio dentro de las correspondientes solicitudes POST/GET para la funcionalidad sensible al servidor backend. Los esquemas de autorización deficientes o ausentes permiten a un adversario ejecutar funcionalidades a las que no debería tener derecho utilizando un usuario autenticado pero de bajo privilegio de la aplicación móvil. Los requisitos de autorización son más vulnerables cuando las decisiones de autorización se toman dentro del dispositivo móvil en lugar de a través de un servidor remoto. Esto puede ser un requisito debido a los requisitos móviles de usabilidad sin conexión.

#### 🙅‍♀️ Calidad Deficiente del Código Cliente (M7)

**Se refiere a errores de programación o malas prácticas en el código de la aplicación que pueden ser explotados por atacantes para comprometer la seguridad del sistema.​**

Los problemas de calidad del código son bastante frecuentes en la mayoría de los códigos para móviles. La buena noticia es que la mayoría de los problemas de calidad del código son bastante benignos y se deben a malas prácticas de programación. Normalmente es difícil detectar este tipo de problemas mediante la revisión manual del código. En su lugar, los atacantes utilizan herramientas de terceros que realizan análisis estáticos o fuzzing. Este tipo de herramientas suelen identificar fugas de memoria, desbordamientos de búfer y otros problemas menos graves que dan lugar a malas prácticas de programación. Los piratas informáticos con conocimientos y experiencia de muy bajo nivel son capaces de explotar eficazmente este tipo de problemas. El objetivo principal suele ser ejecutar código ajeno en el espacio de direcciones del código móvil.

#### ☠️ Manipulación de Código (M8)

**Implica la alteración no autorizada del código de la aplicación, permitiendo la inserción de funcionalidades maliciosas o la elusión de controles de seguridad establecidos.​**

Las formas modificadas de las aplicaciones son sorprendentemente más comunes de lo que se piensa. Existe toda una industria de seguridad dedicada a detectar y eliminar versiones no autorizadas de aplicaciones móviles en las tiendas de aplicaciones. Dependiendo del enfoque adoptado para resolver el problema de la detección de la modificación del código, las organizaciones pueden tener formas limitadas o muy exitosas de detectar versiones no autorizadas de código en la naturaleza. Esta categoría abarca el parcheo binario, la modificación de recursos locales, el enganche de métodos, el swizzling de métodos y la modificación de memoria dinámica.

Una vez que la aplicación llega al dispositivo móvil, el código y los recursos de datos residen allí. Un atacante puede modificar directamente el código, cambiar dinámicamente el contenido de la memoria, cambiar o sustituir las API del sistema que utiliza la aplicación, o modificar los datos y recursos de la aplicación. Esto puede proporcionar al atacante un método directo de subvertir el uso previsto del software para beneficio personal o monetario.

#### 🔥 Ingeniería Inversa (M9)

**Consiste en analizar y desensamblar la aplicación para descubrir su funcionamiento interno, lo que puede facilitar la explotación de vulnerabilidades o la copia no autorizada de la propiedad intelectual.​**

En general, todo el código móvil es susceptible de ingeniería inversa. Algunas aplicaciones son más susceptibles que otras. El código escrito en lenguajes/marcos que permiten la introspección dinámica en tiempo de ejecución (Java, .NET, Objective C, Swift) está especialmente expuesto a la ingeniería inversa. Detectar la susceptibilidad a la ingeniería inversa es bastante sencillo. En primer lugar, descifre la versión de la aplicación en la tienda de aplicaciones (si se aplica cifrado binario). A continuación, utilice las herramientas descritas en la sección «Vectores de ataque» de este documento contra el binario. El código será susceptible si es bastante fácil de entender la ruta de flujo de control de la aplicación, la tabla de cadenas y cualquier pseudocódigo/código fuente generado por estas herramientas.
#### ❄️ Funcionalidades Extrañas (M10)

**Se refiere a la inclusión de funciones ocultas o no documentadas en la aplicación que pueden ser utilizadas por atacantes para fines maliciosos, comprometiendo la seguridad y privacidad del usuario.**

Es muy probable que cualquier aplicación móvil contenga funcionalidades externas que no se exponen directamente al usuario a través de la interfaz. La mayor parte de este código adicional es de naturaleza benigna y no proporcionará a un atacante ninguna información adicional sobre las capacidades del backend. Sin embargo, algunas funcionalidades extrañas pueden ser muy útiles para un atacante. La funcionalidad que expone información relacionada con los entornos de prueba, demostración, puesta en escena o UAT del back-end no debe incluirse en una compilación de producción. Además, los puntos finales de la API administrativa o los puntos finales no oficiales no deben incluirse en las compilaciones finales de producción. Detectar funcionalidad extraña puede ser complicado. Las herramientas automatizadas de análisis estático y dinámico pueden recoger la fruta que cuelga más baja (sentencias de registro). Sin embargo, algunas puertas traseras son difíciles de detectar de forma automatizada. Por ello, siempre es mejor prevenir estas cosas mediante una revisión manual del código.

### Introducción al Android

#### 📱 ¿Qué es un Android?

Android es un sistema operativo móvil basado en el núcleo Linux y otros componentes de software de código abierto. Está diseñado principalmente para dispositivos con pantalla táctil, como teléfonos inteligentes y tabletas. Desarrollado por un consorcio de desarrolladores conocido como Open Handset Alliance, con Google como principal colaborador.

Una de las características distintivas de Android es su naturaleza de código abierto, lo que permite a los fabricantes y desarrolladores personalizar y adaptar el sistema operativo a una amplia variedad de dispositivos y necesidades. Esta flexibilidad ha llevado a su adopción en una diversidad de dispositivos más allá de teléfonos y tabletas, incluyendo relojes inteligentes (Wear OS), televisores (Android TV), sistemas para automóviles (Android Auto) y más.

#### ⚡ Android API

Las API's (Interfaces de Programación de Aplicaciones) de Android son conjuntos de herramientas y definiciones que permiten a los desarrolladores crear aplicaciones interactuando con las funciones y servicios del sistema operativo Android. Estas API's proporcionan acceso a componentes esenciales del sistema, como la interfaz de usuario, almacenamiento, conectividad de red y hardware del dispositivo.​

Cada versión de Android introduce nuevas API's y características. Por ejemplo, Android 11 incorporó una API que permite a las aplicaciones informar al sistema sobre su tasa de cuadros deseada, mejorando la experiencia en dispositivos con múltiples frecuencias de actualización. Android 13 añadió API's para gestionar la conectividad y la seguridad, mientras que Android 14 continuó ampliando las capacidades disponibles para los desarrolladores.

Para garantizar la compatibilidad y seguridad, Google establece niveles de API (API levels) que corresponden a cada versión de Android. Las aplicaciones deben especificar el nivel de API que utilizan, lo que asegura que funcionen correctamente en dispositivos con versiones específicas del sistema operativo. Por ejemplo, a partir del 31 de agosto de 2024, las aplicaciones nuevas y las actualizaciones en Google Play deben dirigirse al nivel de API 34 o superior.

![[Pasted image 20250320031041.png]]

Además de las API's nativas de Android, existen servicios como Google Play Services, que ofrecen API's adicionales para funcionalidades como autenticación, servicios de ubicación y acceso a Google Drive. Estas API's permiten integrar características avanzadas en las aplicaciones, mejorando la experiencia del usuario y facilitando la interacción con otros servicios de Google.

### Arquitectura Android

#### Estructura del sistema operativo Android

Su arquitectura modular permite la escalabilidad y compatibilidad con una amplia gama de hardware.

![[1_g8x1Uic5671J7DgNtDUz6w.png]]

##### 🔵 Applications (Aplicaciones)

Esta es la capa superior donde residen todas las aplicaciones que el usuario interactúa, como el correo electrónico, mensajes, calendario, mapas, navegador y contactos. Todas estas aplicaciones están escritas en el lenguaje de programación Java.

📲 Aplicaciones del sistema (Configuraciones, Contactos, Cámara, etc.).  
📲 Aplicaciones de terceros (WhatsApp, Instagram, etc.).  
📲 Widgets y servicios en segundo plano.

Las apps en Android están escritas principalmente en **Java y Kotlin**, y se ejecutan en la máquina virtual **ART**. Se distribuyen en paquetes **.apk** (Android Package) y cada una se ejecuta en un entorno aislado (sandbox) para mejorar la seguridad.

Esta es la capa más **visible** para el usuario. Incluye tanto las aplicaciones del sistema como las que el usuario descarga desde la Google Play Store o instala manualmente.

##### 🟢 Marco de Trabajo de Aplicaciones (Android Framework)

Proporciona a los desarrolladores acceso completo a las mismas APIs utilizadas por las aplicaciones principales. Este marco está diseñado para simplificar la reutilización de componentes; cualquier aplicación puede publicar sus capacidades y otras aplicaciones pueden hacer uso de esas capacidades, sujeto a las reglas de seguridad del framework.

🔑 **Gestor de actividades:** Controla el ciclo de vida de las apps.  
🔑 **Gestor de recursos:** Maneja elementos como imágenes, cadenas de texto y layouts. 
🔑 **Gestor de notificaciones:** Permite mostrar alertas y mensajes al usuario.  
🔑 **Gestor de permisos:** Controla el acceso a funcionalidades sensibles como cámara, ubicación y almacenamiento.  
🔑 **Servicios de localización:** Permite acceder al GPS y a redes para obtener la ubicación del dispositivo.

Este framework abstrae la complejidad del sistema operativo y permite que los desarrolladores creen aplicaciones de manera sencilla y eficiente.

##### 🟠 Bibliotecas Nativas y Entorno de Ejecución de Android (Native Libraries & Android Runtime)

**Incluye un conjunto de bibliotecas escritas en C/C++ utilizadas por varios componentes del sistema. Estas bibliotecas proporcionan funcionalidades como la gestión de gráficos, bases de datos y reproducción de medios. Además, Android Runtime (ART) es el entorno de ejecución que, desde la versión 5.0, reemplazó a la máquina virtual Dalvik, mejorando el rendimiento y la eficiencia de las aplicaciones.**

Son bibliotecas escritas en C/C++ que proporcionan funcionalidades esenciales para Android. Algunas de las más importantes son:

📌 **OpenGL ES**: Maneja gráficos en 2D y 3D para renderizado avanzado.  
📌 **WebKit**: Motor de renderizado web utilizado por el navegador.  
📌 **Media Framework**: Permite la reproducción de audio y video.  
📌 **SQLite**: Base de datos ligera utilizada para almacenamiento de datos en aplicaciones.  
📌 **SSL/TLS**: Seguridad en las comunicaciones y cifrado de datos.  
📌 **libc**: Implementación de la biblioteca estándar de C optimizada para Android.

___

Esta capa es responsable de ejecutar las aplicaciones Android. Hasta Android 4.4, se usaba **Dalvik VM**, pero desde Android 5.0 en adelante, se reemplazó por **ART (Android Runtime)**, que ofrece:

⚡ **Compilación AOT (Ahead-of-Time):** Las apps se compilan en código nativo al instalarse, mejorando el rendimiento.  
⚡ **Optimización de memoria:** Reduce el consumo de RAM y mejora la ejecución de aplicaciones.  
⚡ **Recolección de basura (Garbage Collection):** Libera memoria automáticamente cuando no es necesaria.

ART ejecuta las aplicaciones a través de **Core Libraries**, que incluyen las clases base de Java/Kotlin necesarias para la ejecución de las apps.

ART permite ejecutar aplicaciones escritas en Java o Kotlin, traduciendo el código a instrucciones que pueden ejecutarse en el hardware del dispositivo.

##### 🟣 Capa de Abstracción de Hardware (HAL)

La HAL define interfaces estándar que exponen las capacidades del hardware del dispositivo al nivel superior del sistema operativo. Al proporcionar interfaces estándar para los controladores de hardware, la HAL permite que Android sea independiente de las implementaciones específicas de hardware, facilitando la compatibilidad con una amplia variedad de dispositivos. 

La **Capa de Abstracción de Hardware** permite la comunicación entre el hardware y el software de una manera estandarizada. En lugar de que las aplicaciones interactúen directamente con el hardware, lo hacen a través de HAL, lo que permite:

🔹 Separar la lógica de software del hardware específico.  
🔹 Facilitar la compatibilidad con distintos fabricantes.  
🔹 Mejorar la modularidad del sistema.

HAL se compone de múltiples módulos que representan distintos componentes del hardware, como **audio, cámara, Bluetooth, sensores, Wi-Fi, etc.**

##### 🔴 Núcleo Linux (Linux Kernel)

En la base de la arquitectura se encuentra el núcleo Linux, que actúa como una capa de abstracción entre el hardware y el resto del software. Se encarga de la gestión de recursos fundamentales como la seguridad, la gestión de memoria, la gestión de procesos y la pila de red. Además, facilita la comunicación entre el hardware y los componentes de nivel superior del sistema operativo.

Sus principales funciones incluyen:

✅ **Gestión de procesos:** Controla la ejecución de aplicaciones y servicios.
✅ **Gestión de memoria:** Administra el uso eficiente de la RAM.
✅ **Gestión de drivers:** Controla el acceso al hardware, como la pantalla, cámara, sensores y conectividad.
✅ **Seguridad y permisos:** Implementa medidas de seguridad como SELinux y namespaces.
✅ **Gestión de energía:** Optimiza el consumo energético del dispositivo.

#### Estructura fundamental de las aplicaciones Android

##### ¿Qué es una APK?

Un **APK (Android Package)** es un archivo comprimido que contiene todos los elementos necesarios para instalar y ejecutar una aplicación en Android. Funciona de manera similar a los archivos **.zip** o **.jar** en otros sistemas. Al descomprimir un APK, encontramos una estructura específica de archivos y directorios.​

##### Tipos de Aplicaciones

###### Aplicaciones Nativas

Las **aplicaciones nativas** están diseñadas y desarrolladas específicamente para un sistema operativo particular, como Android o iOS.

**Características:**

✔️ Se desarrollan en **Kotlin o Java** para Android, y en **Swift o Objective-C** para iOS.  
✔️ Ofrecen el **mejor rendimiento** y acceso completo a las funcionalidades del dispositivo (GPS, cámara, sensores, etc.).  
✔️ Interfaz y experiencia de usuario más fluida, optimizada para cada plataforma.

**Ventajas:**

✅ Máximo rendimiento y velocidad.  
✅ Mejor integración con el hardware del dispositivo.  
✅ Mejor experiencia de usuario y personalización.

**Desventajas:**

❌ Desarrollo más costoso y lento, ya que se requiere una versión específica para cada sistema operativo.  
❌ Mayor mantenimiento si la app se desarrolla para varias plataformas.

###### **Aplicaciones Web**

Las **aplicaciones web** son sitios web diseñados para funcionar en dispositivos móviles. Se accede a ellas a través de un navegador y están desarrolladas utilizando tecnologías web como HTML, CSS y JavaScript.

**Características:**

✔️ Se acceden a través del navegador (Chrome, Safari, Firefox, etc.).  
✔️ No requieren descarga ni instalación desde una tienda de aplicaciones.  
✔️ Pueden ser responsivas, adaptándose a diferentes pantallas (móvil, tablet, PC).

**Ventajas:**

✅ Funcionan en cualquier dispositivo con un navegador.  
✅ Más rápidas de desarrollar y mantener.  
✅ No necesitan actualizaciones manuales; los cambios se reflejan automáticamente.

**Desventajas:**

❌ Dependen de la conexión a Internet para funcionar.  
❌ No pueden acceder a todas las funciones del dispositivo (como notificaciones push, GPS o cámara).  
❌ Su rendimiento es inferior al de una aplicación nativa.

###### Aplicaciones Hibridas

Son una combinación de las dos anteriores: están desarrolladas con tecnologías web pero se empaquetan en una aplicación nativa, lo que permite ejecutarlas en cualquier sistema operativo.

**Características:**

✔️ Se desarrollan con frameworks como **React Native, Flutter, Ionic o Apache Cordova**.  
✔️ Pueden instalarse desde las tiendas de aplicaciones (Google Play y App Store).  
✔️ Pueden acceder a algunas funciones del dispositivo a través de plugins.

**Ventajas:**

✅ Un solo código para múltiples plataformas, reduciendo costos y tiempo de desarrollo.  
✅ Se pueden distribuir en tiendas de aplicaciones.  
✅ Mayor acceso a funciones del hardware en comparación con las aplicaciones web.

**Desventajas:**

❌ No son tan rápidas ni eficientes como las nativas.  
❌ Dependen de plugins y frameworks para acceder a ciertas funciones del sistema.  
❌ La experiencia de usuario puede no ser tan fluida como en una app nativa.

##### Componentes principales de la aplicación

🔵**Actividades (Activities)**

Una **actividad** representa una única pantalla con una interfaz de usuario con la que el usuario puede interactuar. Por ejemplo, una aplicación de correo electrónico puede tener una actividad para mostrar la lista de correos, otra para redactar un nuevo correo y otra para leer un correo seleccionado. Cada actividad es independiente y puede iniciar otras actividades dentro de la misma aplicación o en otras aplicaciones. Es fundamental declarar todas las actividades en el archivo `AndroidManifest.xml` para que el sistema las reconozca y gestione correctamente. 

🟢 **Servicios (Services)**

Un **servicio** es un componente que se ejecuta en segundo plano para realizar operaciones largas o que no requieren interacción directa con el usuario. Por ejemplo, un servicio puede reproducir música mientras el usuario utiliza otras aplicaciones, o descargar archivos en segundo plano. Los servicios pueden ser de dos tipos:​

- **Servicios en primer plano**: Realizan tareas que son visibles y notorias para el usuario, como la reproducción de música.​
    
- **Servicios en segundo plano**: Ejecutan tareas que no requieren la atención directa del usuario, como la sincronización de datos.​
    

Al igual que las actividades, los servicios deben declararse en el archivo `AndroidManifest.xml`. Además, pueden ser iniciados o vinculados a actividades u otros servicios según sea necesario. 

🟣 **Receptores de emisiones (Broadcast Receivers)**

Los **proveedores de contenido** permiten que las aplicaciones compartan datos entre sí de manera estructurada y segura. Por ejemplo, una aplicación puede acceder a la lista de contactos del dispositivo a través del proveedor de contenido del sistema. Estos proveedores gestionan un conjunto de datos compartidos y pueden almacenar información en bases de datos SQLite, archivos o en la nube. Las aplicaciones pueden utilizar proveedores de contenido para leer y escribir datos, siempre que tengan los permisos adecuados.

🔴 **Proveedores de contenido (Content Providers)**

Los **receptores de emisiones** son componentes que permiten que las aplicaciones escuchen y respondan a eventos o emisiones del sistema o de otras aplicaciones. Por ejemplo, una aplicación puede utilizar un receptor de emisiones para detectar cuando el dispositivo ha sido conectado a una red Wi-Fi o cuando la batería está baja. Estos receptores no tienen una interfaz de usuario y se registran para recibir emisiones específicas, ya sea en el archivo `AndroidManifest.xml` o dinámicamente en el código de la aplicación.

##### Estructura de un archivo APK

![[4.png]]

###### AndroidManifest.xml

Este archivo esencial declara los componentes de la aplicación y define sus interacciones. Incluye información como los permisos requeridos, las actividades, servicios, receptores y proveedores de contenido presentes en la aplicación.

Acá un ejemplo breve de un archivo `androidmanifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ejemplo.miapp"
    android:versionCode="1"
    android:versionName="1.0">
    
    <!-- Permisos -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    
    <!-- Requisitos de hardware/software -->
    <uses-feature android:name="android.hardware.camera"/>
    
    <application
        android:allowBackup="true"
        android:label="MiApp"
        android:icon="@mipmap/ic_launcher">
        
        <!-- Actividad principal -->
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <!-- Servicio en segundo plano -->
        <service android:name=".MiServicio"/>

        <!-- Receptor de difusión (BroadcastReceiver) -->
        <receiver android:name=".MiReceptor">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED"/>
            </intent-filter>
        </receiver>

        <!-- Proveedor de contenido -->
        <provider
            android:name=".MiProveedorContenido"
            android:authorities="com.ejemplo.miapp.provider"
            android:exported="false"/>
    </application>
</manifest>
```

 🔍 **Explicación de cada sección:**

**📜 Manifest Tag**:
  
- Define el nombre del paquete (`package`).
- Especifica la versión de la app (`android:versionCode` y `android:versionName`).

 **🔒 Permissions (`uses-permission`)**:
 
- `android.permission.INTERNET`: Permite acceso a la red.
- `android.permission.ACCESS_FINE_LOCATION`: Permite obtener la ubicación precisa del usuario.

**📌 Uses-Feature (`uses-feature`)**:

- Declara que la app usa la cámara del dispositivo.

 **🏛️ Application**:
 
- Contiene toda la configuración principal de la app.
- Define el ícono y el nombre de la aplicación.

 **📲 Activity (`activity`)**:
 
- `MainActivity` es la pantalla principal de la app.
- `intent-filter` define que esta actividad se inicia al abrir la app.

**⚙️ Intent-Filter (`intent-filter`)**:

- Se usa en actividades, servicios y receptores de difusión.
- En `MainActivity`, define que la app puede iniciarse desde el lanzador.

 **🔄 Service (`service`)**:

- `MiServicio` es un servicio en segundo plano.

 **📡 Receiver (`receiver`)**:
 
 - `MiReceptor` escucha eventos del sistema, como el reinicio del dispositivo (`BOOT_COMPLETED`).
 
 **📁 Provider (`provider`)**:

- `MiProveedorContenido` gestiona el acceso estructurado a los datos.

###### Signatures

Las firmas digitales son utilizadas para autenticar la identidad del desarrollador y garantizar la integridad de la aplicación. Cada APK debe estar firmado con una clave privada antes de su distribución. Esta firma permite al sistema verificar que la aplicación no ha sido alterada y que proviene de una fuente confiable. La información de la firma se almacena en el directorio `META-INF` del APK, que incluye:​

- **MANIFEST.MF**: Contiene información sobre los archivos incluidos en el APK y sus respectivas sumas de verificación.​
- **CERT.SF**: Lista los archivos del APK junto con sus sumas de verificación y detalles de la firma.​
- **CERT.RSA**

###### Assets

Los activos son archivos que la aplicación utiliza pero que no están estructurados como recursos Android. Se almacenan en el directorio `assets/` dentro del APK y pueden incluir archivos de texto, bases de datos, fuentes, entre otros. A diferencia de los recursos, los activos no son procesados por el sistema Android y se accede a ellos mediante la clase `AssetManager`. Esto permite que los desarrolladores manejen archivos sin procesar de manera flexible.
###### Compiled resources

Los recursos compilados son elementos como diseños de interfaz de usuario, cadenas de texto y otros recursos definidos en XML que son procesados y compilados durante el proceso de construcción de la aplicación. Estos recursos se almacenan en el archivo `resources.arsc` dentro del APK y se acceden mediante identificadores generados en la clase `R`. Esta compilación permite una gestión eficiente y una carga rápida de los recursos en tiempo de ejecución. ​

###### Native Libraries

Las bibliotecas nativas son archivos compilados en código máquina específico de la arquitectura del procesador (por ejemplo, ARM o x86). Se almacenan en el directorio `lib/` del APK, organizado en subdirectorios que corresponden a diferentes arquitecturas de hardware. Estas bibliotecas se desarrollan utilizando el **Android NDK (Native Development Kit)** y se integran en la aplicación para realizar operaciones de bajo nivel o de alto rendimiento. Se accede a ellas mediante la Interfaz de Programación de Aplicaciones Java Native Interface (JNI).

###### Dalvik bytecode

El bytecode de Dalvik es el formato en el que se compilan las aplicaciones Android antes de su ejecución. Durante el proceso de construcción, el código fuente Java se compila en archivos `.class`, que luego se convierten en archivos `.dex` (Dalvik Executable). Estos archivos `.dex` contienen el código optimizado para la máquina virtual Dalvik o el Android Runtime (ART), permitiendo una ejecución eficiente en dispositivos Android.

###### Resource

Los recursos son elementos no ejecutables que la aplicación utiliza, como imágenes, cadenas de texto, diseños de interfaz y otros archivos XML. Se almacenan en el directorio `res/` del proyecto y se organizan en subdirectorios según su tipo (por ejemplo, `drawable/` para imágenes, `layout/` para diseños). Durante la construcción, estos recursos se procesan y se incluyen en el APK, permitiendo que la aplicación acceda a ellos de manera eficiente en tiempo de ejecución.

Estos componentes se combinan durante el proceso de construcción para formar el APK (Android Package), que es el archivo instalable en los dispositivos Android. La correcta organización y manejo de estos elementos son fundamentales para el rendimiento, la escalabilidad y la mantenibilidad de las aplicaciones Android.

##### Sistema de Archivos

###### **📌 Directorio `/data/app/`**

Esta carpeta contiene las aplicaciones que están instaladas en el dispositivo de manera regular (por ejemplo, aquellas que se descargan desde Google Play). Cada aplicación instalada tiene su propia carpeta dentro de este directorio, y dentro de ella se encuentran los archivos APK y los recursos relacionados con la aplicación. La carpeta se encuentra en un sistema de archivos con permisos restringidos, por lo que solo el sistema o el usuario root pueden acceder a ella.

💡 **¿Qué almacena?**

- Contiene los archivos **APK de las aplicaciones instaladas por el usuario**.
- Cada aplicación instalada tiene su propio directorio dentro de esta carpeta.
- **Solo el sistema y el usuario root tienen acceso** a este directorio.

###### **📌 Directorio `/system/app/`**

En esta carpeta se almacenan las aplicaciones del sistema, es decir, aquellas que vienen preinstaladas en el dispositivo o que forman parte del sistema operativo Android. Son aplicaciones esenciales para el funcionamiento del dispositivo y suelen ser críticas, como los servicios del sistema o las aplicaciones preinstaladas de fabricantes de dispositivos. Generalmente, esta carpeta está montada de solo lectura para evitar que el usuario modifique o elimine estas aplicaciones sin rootear el dispositivo.

💡 **¿Qué almacena?**

- Contiene las **aplicaciones preinstaladas** en el sistema operativo.
- Estas apps vienen instaladas de fábrica y **no pueden ser eliminadas fácilmente** sin permisos root.
- Se almacenan en formato **APK** dentro de este directorio.

###### **📌 Directorio `/data/app-private/`**

Esta carpeta es utilizada en algunos dispositivos Android para almacenar aplicaciones privadas o de usuario, pero con restricciones adicionales. Por ejemplo, puede estar relacionada con aplicaciones que han sido instaladas pero que no están disponibles públicamente (como en entornos de pruebas o para aplicaciones específicas de desarrollo). El acceso a esta carpeta también está restringido, y no está destinada a aplicaciones estándar de usuario.

💡 **¿Qué almacenaba?**

- En versiones antiguas de Android, este directorio guardaba **aplicaciones protegidas o privadas**.
- Se usaba para apps que no debían ser accesibles para otros usuarios o aplicaciones.

###### **📌 Directorio `/data/data/<package-name>/`**

Dentro de esta carpeta se almacenan los datos privados de cada aplicación instalada. Por ejemplo, bases de datos, archivos de configuración, preferencias de usuario, y otros archivos que la aplicación necesita para funcionar. Cada aplicación tiene su propia subcarpeta dentro de `/data/data/` nombrada con el nombre del paquete de la aplicación (por ejemplo, `com.example.myapp`). Este directorio es crítico para el funcionamiento de las aplicaciones, y solo la propia aplicación y el sistema operativo (en ciertos casos con privilegios de root) pueden acceder a estos archivos.

💡 **¿Qué almacena?**

- **Datos privados de la aplicación** (configuraciones, bases de datos, caché, preferencias compartidas, etc.).
- Cada aplicación tiene su propia carpeta dentro de `/data/data/`.
- **Solo la propia app y el sistema pueden acceder a estos datos** (a menos que se tengan permisos root).

##### Sistema de permisos

El sistema de permisos en Android regula el acceso de las aplicaciones a datos y funciones sensibles del dispositivo, protegiendo la privacidad y seguridad del usuario. Los permisos se categorizan según su nivel de riesgo y el momento en que se solicitan

**🟢 Permisos Normales**

Los **permisos normales** permiten que las aplicaciones accedan a datos o realicen acciones que, aunque están fuera de su espacio aislado, presentan un riesgo mínimo para la privacidad del usuario y el funcionamiento del sistema. Estos permisos son asignados automáticamente al instalar la aplicación, sin requerir la aprobación explícita del usuario.

- **📶 INTERNET**: Permite que la aplicación acceda a la red de Internet.​
- **📶 ACCESS_NETWORK_STATE**: Permite que la aplicación acceda al estado de las conexiones de red.​

Estos permisos se declaran en el archivo `AndroidManifest.xml` de la aplicación y son gestionados por el sistema durante la instalación.

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

**⚠️ Permisos Peligrosos (Dangerous)**

Los **permisos peligrosos** otorgan a las aplicaciones acceso a datos sensibles o les permiten realizar acciones que pueden afectar significativamente al usuario o al sistema. Debido a su naturaleza, Android solicita al usuario que otorgue o deniegue explícitamente estos permisos en tiempo de ejecución, además de su declaración en el manifiesto de la aplicación.

❗ **Se solicitan en tiempo de ejecución** y requieren aprobación explícita del usuario.

- **📷 CAMERA**: Permite que la aplicación acceda a la cámara del dispositivo.​
- **READ_CONTACTS**: Permite que la aplicación lea los contactos almacenados en el dispositivo.​
- **📂 ACCESS_FINE_LOCATION**: Permite que la aplicación acceda a la ubicación precisa del dispositivo.​

La gestión de estos permisos implica verificar su estado y solicitar la aprobación del usuario en momentos adecuados durante la interacción con la aplicación. ​

```xml
<uses-permission android:name="android.permission.CAMERA"/>
```

**🔏 Permisos de Firma (Signature)**

Los **permisos de firma** son utilizados para permitir que aplicaciones firmadas con la misma clave accedan a funcionalidades o datos específicos, garantizando que solo aplicaciones de confianza puedan acceder a ciertos recursos. Estos permisos se utilizan comúnmente para componentes del sistema o aplicaciones del sistema que requieren niveles adicionales de seguridad. Por ejemplo:​

- **🛠️ BIND_ACCESSIBILITY_SERVICE**: Permite que una aplicación acceda a servicios de accesibilidad, generalmente utilizado por aplicaciones del sistema.​
- **🛠️ BIND_VPN_SERVICE**: Permite que una aplicación establezca servicios de VPN, típicamente utilizado por aplicaciones de sistema que gestionan conexiones de red.​

Para que una aplicación utilice estos permisos, debe estar firmada con la misma clave que la aplicación que define el permiso, asegurando así que solo aplicaciones autorizadas puedan acceder a estas funcionalidades. ​

```xml
<permission android:name="com.miempresa.PERMISO_EXCLUSIVO"
    android:protectionLevel="signature"/>
```

**🏗️ Permisos del Sistema (System permissions)**

Los **permisos del sistema** son un conjunto especial de permisos que permiten a las aplicaciones realizar acciones críticas o acceder a funcionalidades del sistema operativo que no están disponibles para aplicaciones normales. Estos permisos son generalmente otorgados a aplicaciones del sistema o aplicaciones preinstaladas que requieren acceso privilegiado para operar correctamente. Por ejemplo:​

- **📅 SET_TIME_ZONE**: Permite que la aplicación establezca la zona horaria del sistema.​
- **📶 MODIFY_PHONE_STATE**: Permite que la aplicación modifique el estado del teléfono, como habilitar o deshabilitar radios de comunicación.​

La gestión de estos permisos es estricta y generalmente se reserva para aplicaciones del sistema o aplicaciones que requieren este nivel de acceso para su funcionamiento. ​

```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
```

📌 **Para solicitarlos en tiempo de ejecución:**

```java
if (!Settings.canDrawOverlays(this)) {
    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
    startActivity(intent);
}
```
## Instalación de herramientas
### Instalación de `BurpSuite` en Windows

Enlace de referencia: https://portswigger.net/burp/releases/professional-community-2025-1-5?requestededition=community&requestedplatform=

1. Lo primero será descargarlo desde su pagina oficial.

![[Pasted image 20250329044721.png]]

2. Ejecutamos e instalamos

![[Pasted image 20250329044909.png]]


### Instalación de `Genymotion` en Windows

Enlace de referencia: https://www.genymotion.com/product-desktop/download/

Simplemente, ejecutamos el `.exe` e instalamos.

> [!INFO] Info
> El instalador a descargar, depende si ya tienen instalado VirtualBox. Así en base a eso, se debe elegir el instalador.

Alfinal, deberiamos tener estos programas.

![[Pasted image 20250329013114.png]]

### Instalación de `ADB` en Windows

Enlace de referencia: https://developer.android.com/tools/releases/platform-tools?hl=es-419

1. Descargamos la herramienta desde su pagina oficial

![[Pasted image 20250329001103.png]]

2. Luego, extraemos todo el contenido del archivo `platform-tools-latest-windows.zip`

![[Pasted image 20250329001338.png]]

3. Debemos mover la carpeta al directorio `C:\Windows\`

![[Pasted image 20250329001455.png]]

4. Luego, copiaremos la ruta en forma de texto y la agregaremos a nuestro `Path`

![[Pasted image 20250329002123.png]]

Y comprobamos que funciona, abriendo una terminal simple, y escribiendo `adb`.

![[Pasted image 20250329002317.png]]

### Instalando Certificado de `BurpSuite`

1. Ejecutamos BurpSuite y nos dirigimos al apartado de `Proxy > Proxy settings`

![[Pasted image 20250329045258.png]]

2. Luego, generamos un nuevo certificado.

![[Pasted image 20250329050629.png]]

3. Y por ultimo, lo guardamos con la extensión `.der`

![[Pasted image 20250329053224.png]]

4. Una vez ya tengamos el certificado, habrá que realizarle un tratamiento desde nuestra maquina Linux.

```
openssl x509 -inform DER -in BurpSuiteAndroid.der -out BurpSuiteAndroid.pem
openssl x509 -in BurpSuiteAndroid.pem -subject_hash_old | head -1
mv BurpSuiteAndroid.pem 9a5ba575.0
```

![[Pasted image 20250329053900.png]]

5. Una vez ya tengamos nuestro certificado, nos devolvemos a nuestra maquina, y nos conectamos por `ADB`.

![[Pasted image 20250329055458.png]]

6. Y por ultimo, hacemos un `adb push` a nuestro certificado para poder cargarlo al dispositivo en la ruta `/sdcard/`.

![[Pasted image 20250329055852.png]]

y verificamos.

![[Pasted image 20250329055951.png]]

7. Ahora, debemos mover el archivo `9a5ba575.0` al directorio `/system/etc/security/cacerts`.

![[Pasted image 20250329063602.png]]

Y por ultimo le damos el permiso al certificado `chmod 644 9a5ba575.0`

> [!BUG] `Read-only file system`
> En dado caso que se encuentren con este error, a la hora de interactuar con el directorio `system/`, es necesario realizar el siguiente paso.
> 
> Primero, ejecutamos: `mount -o rw,remount /system`
> 
> Realizamos las gestiones o data que necesitemos realizar.
> 
> Para luego volverlo a su estado normal con el comando: `mount -o ro,remount /system`

### Instalación de `APKTools` en Windows

Enlace de refencia: https://apktool.org/docs/install

Lo principal, será seguir los pasos uno a uno, como lo dicta la documentación.

> [!INFO] Informacion
> Como Windows no distingue entre mayúsculas y minúsculas, [ajuste la distinción entre mayúsculas y minúsculas](https://learn.microsoft.com/en-us/windows/wsl/case-sensitivity) para un funcionamiento correcto.

![[Pasted image 20250329003906.png]]

1. Guardamos el primer contenedor como `apktool.bat`

![[Pasted image 20250329004027.png]]

2. Luego, la ultima versión del `apktool`

![[Pasted image 20250329004109.png]]

3. Cambiamos el nombre del archivo `apktool_2.11.1.jar`, por `apktool.jar` y deberíamos de tener.

![[Pasted image 20250329004226.png]]

4. Y por ultimo, lo moveremos a nuestro directorio `c:\Windows\`

![[Pasted image 20250329004434.png]]

5. Y confirmamos que todo esta bien, ejecutando `apktool` en nuestra consola de comandos.

![[Pasted image 20250329004609.png]]

### Instalación de `JADX-GUI` en Windows

Enlace de referencia: https://github.com/skylot/jadx/releases

> [!BUG] Importante
> Tener en cuenta que para poder ejecutar este programa, el ordenador debe tener `JAVA` instalado.

1. Lo primero será, en la sección de reléase, elegir `jadx-gui-1.5.1-win.zip` para descargar.

![[Pasted image 20250329005248.png]]

2. Lo extraemos.

![[Pasted image 20250329005520.png]]

3. Y por ultimo, simplemente ejecutamos.

![[Pasted image 20250329010242.png]]

## Uso de Herramientas

### Abrir una Shell con `ADB` en Genymotion

Lo primero que debemos tener en cuenta, es que Genymotion ya trae por defecto la herramienta `adb`. Esta se aloja en la siguiente ruta: `C:\Program Files\Genymobile\Genymotion\tools`.

1. Abrir la consola de comandos en esa ruta.
2. Hacer uso del comando `adb devices`
3. Luego de identificar el dispositivo, nos conectaremos con el comando `adb connect x.x.x.x:xxxx`
4. Y luego abrir la Shell con el comando `adb shell`

![[Pasted image 20250329024124.png]]

### Usando `APKTool`

Para poder descompilar una aplicación, se hace uso del siguiente comando:

	apktool d app.apk

![[Pasted image 20250329032842.png]]

### Usando `JADX-GUI`

El uso de este aplicativo es relativamente sencillo, solamente es ejecutar la aplicación, y seleccionar el `app.apk`

![[Pasted image 20250329044415.png]]

Y, nos mostrara todo su contenido.

![[Pasted image 20250329044455.png]]
