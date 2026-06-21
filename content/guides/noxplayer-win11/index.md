_____________________
## Por qué ocurre el problema

La mayoría de emuladores de Android de escritorio son **hipervisores de tipo 2**: corren _sobre_ Windows y necesitan acceso directo a las extensiones de virtualización del procesador —**Intel VT-x** o **AMD-V**— para ejecutar la máquina virtual con aceleración por hardware.

El problema es que esas extensiones de CPU **solo puede poseerlas un hipervisor a la vez**. Cuando Windows arranca su propio hipervisor (Hyper-V), este se coloca en el nivel más privilegiado del procesador (lo que se conoce como _ring -1_) y **se apropia de VT-x/AMD-V**. A partir de ese momento, cualquier hipervisor de terceros ya no puede acceder al hardware: o falla al iniciar la VM, o cae a un **modo de emulación por software muchísimo más lento**.

¿Y quién enciende el hipervisor de Windows sin que tú se lo pidas explícitamente? Principalmente la **Seguridad basada en virtualización (VBS, _Virtualization-Based Security_)**, que en Windows 11 viene activada de fábrica en equipos compatibles. VBS es el paraguas que engloba:

|      Tecnología      | Qué hace                                                            | Nombre que ves en Windows                          |
| :------------------: | ------------------------------------------------------------------- | -------------------------------------------------- |
|       **HVCI**       | Verifica la integridad del código del kernel dentro de la VM segura | "Integridad de memoria" / "Aislamiento del núcleo" |
| **Credential Guard** | Aísla las credenciales (LSASS) para frenar ataques _pass-the-hash_  | "Protección de credenciales"                       |
|   **Device Guard**   | Control de aplicaciones / WDAC basado en virtualización             |                                                    |


Todas ellas **dependen del hipervisor de Hyper-V para funcionar**. Por eso, aunque tú nunca hayas instalado el rol de Hyper-V "a mano", el hipervisor puede estar corriendo igualmente por culpa de VBS. **Ese es el verdadero culpable en Windows 11.**

> [!tip] Conclusion clave
> No basta con "quitar Hyper-V" del Panel de control. Hay que asegurarse de que **ningún componente arranque el hipervisor**: ni Hyper-V, ni VBS, ni Credential Guard, ni Device Guard.

## Antes de empezar: precauciones

⚠️ **Lo que vas a desactivar son funciones de seguridad reales.** Credential Guard, HVCI y VBS protegen tu equipo contra malware de kernel y robo de credenciales. Desactivarlas reduce tu superficie de protección. Hazlo solo si necesitas el rendimiento del emulador y entiendes el compromiso. Para entornos corporativos o equipos con datos sensibles, valora dejarlo como está.

Recomendaciones:

1. **Crea un punto de restauración** (`Crear un punto de restauración` → _Crear_). Si algo se rompe, vuelves atrás.
2. Trabaja siempre con **PowerShell / CMD como Administrador**.
3. Anota qué cambias, para poder **revertirlo**.
4. Aplica los métodos **en orden** y reinicia cuando se indique. No los hagas todos a ciegas: con frecuencia, **el Método 1 (bcdedit) por sí solo ya resuelve el problema**.


## Diagnóstico: ¿qué tengo activo ahora mismo?

Antes de tocar nada, averigua el estado real. Esto te ahorra trabajo y te dice qué método necesitas.

**Opción A - Información del sistema:** Ejecuta `msinfo32` y revisa, en _Resumen del sistema_, estas dos líneas:

- **Seguridad basada en virtualización:** debería decir _En ejecución_ si VBS está activa.
- **Hipervisor de Windows:** si aparece _Se detectó un hipervisor..._, el hipervisor está consumiendo VT-x.

**Opción B - PowerShell:**

```powershell
PS C:\Users\s1or> Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard |
  Select-Object VirtualizationBasedSecurityStatus, SecurityServicesRunning
```

Interpretación:

- `VirtualizationBasedSecurityStatus`: `0` = desactivada, `1` = activada pero no en ejecución, `2` = **activada y en ejecución** (este es el caso problemático).
- `SecurityServicesRunning`: una lista vacía `{}` es lo ideal. `{1}` = Credential Guard en ejecución, `{2}` = HVCI en ejecución.

Comprueba también si Hyper-V está habilitado como característica:

```powershell
PS C:\Users\s1or> Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-Hypervisor | Select-Object State
```

Y la configuración del cargador de arranque:

```powershell
PS C:\Users\s1or> bcdedit /enum {current} | findstr -i hypervisorlaunchtype
```

Ahora si, vamos a los métodos!

_____________________
## Metodo 1 - `bcdedit`

Este es el comando que faltaba en la mayoría de guías y el que resuelve la mayoría de los casos. **No desinstala nada**: simplemente le ordena al cargador de arranque de Windows que **no inicie el hipervisor**, sin importar si Hyper-V o VBS están "instalados". Es reversible con un solo comando.

En **CMD o PowerShell como Administrador**:

powershell

```powershell
PS C:\Users\s1or> bcdedit /set hypervisorlaunchtype off
```

Reinicia el equipo. En muchísimos equipos, con esto solo, NoxPlayer ya arranca con aceleración por hardware.

> [!TIP]
> Si más adelante quieres volver a tener Hyper-V/VBS: `bcdedit /set hypervisorlaunchtype auto`.

Si tras reiniciar el problema persiste, continúa con los métodos siguientes para desactivar también las funciones que vuelven a encender el hipervisor.

_____________________
## Método 2 - Desactivar las características de Windows

Abre **"Activar o desactivar las características de Windows"** o en el ejecutar escribe (`OptionalFeatures.exe`).

![[Pasted image 20260620165752.png]]

y **desmarca** todo lo que pueda arrancar un hipervisor:

- ☐ **Hyper-V** (entero)
- ☐ **Plataforma de máquina virtual** (_Virtual Machine Platform_)
- ☐ **Plataforma del hipervisor de Windows** (_Windows Hypervisor Platform_)
- ☐ **Espacio aislado de Windows** (_Windows Sandbox_), si lo tienes

![[Pasted image 20260620165810.png]]

Acepta y reinicia.

> [!success]
> La _Plataforma de máquina virtual_ es la que usa **WSL2**. Si la desactivas, WSL2 dejará de funcionar (puedes volver a activarla cuando termines de usar el emulador).

**Equivalente por línea de comandos** (más rápido y fiable), en PowerShell como Administrador:

```powershell
PS C:\Users\s1or> Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -NoRestart
PS C:\Users\s1or> Disable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
PS C:\Users\s1or> Disable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -NoRestart
```

Reinicia al termina.

_____________________
## Metodo 3 - Desactivar aislamiento de nucleo / Integridad de memoria (HVCI)

Ve a **Seguridad de Windows → Seguridad del dispositivo → Aislamiento del núcleo** y desactiva **Integridad de memoria**.
Esto desactiva HVCI, uno de los componentes que mantiene VBS encendida. Requiere reinicio.

![[Pasted image 20260620170910.png]]

Si el interruptor aparece **atenuado (gris)** o vuelve a activarse solo, fuérzalo por registro (PowerShell como Administrador):

```Powershell
PS C:\Users\s1or> reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v Enabled /t REG_DWORD /d 0 /f
```

_____________________
## Método 4 - Editor de directivas de grupo local (`gpedit.msc`)

Solo disponible en Windows 11 **Pro/Enterprise/Education** (Home no incluye gpedit).

1. Ejecuta `gpedit.msc`.
2. Navega a: `Configuración del equipo > Plantillas administrativas > Sistema > Device Guard`
3. Abre **"Activar la seguridad basada en virtualización"** y ponla en **Deshabilitada**.

![[Pasted image 20260620173528.png]]

![[Pasted image 20260620174344.png]]

Con esto desactivas VBS por directiva, lo que arrastra a Credential Guard y Device Guard. Reinicia.

_____________________
## Método 5 - Editor de registros (`regedit`)

Aquí está la corrección importante respecto a muchas guías: las claves que realmente controlan VBS y Credential Guard **no están solo bajo `\Hypervisor`**, sino en `DeviceGuard` y `Lsa`. Edítalas todas.

Ejecuta `regedit` (como Administrador) y aplica estos valores. Puedes hacerlo a mano o pegar los comandos `reg add` (más seguro contra erratas):

**Desactivar VBS:**

```shell
Microsoft Windows
(c) Microsoft Corporation. Todos los derechos reservados.

C:\Users\s1or> reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v EnableVirtualizationBasedSecurity /t REG_DWORD /d 0 /f
```

**Desactivar HVCI:**

```shell
Microsoft Windows
(c) Microsoft Corporation. Todos los derechos reservados.

C:\Users\s1or> reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v Enabled /t REG_DWORD /d 0 /f
```

**Desactivar Credential Guard:**

```shell
Microsoft Windows
(c) Microsoft Corporation. Todos los derechos reservados.

C:\Users\s1or> reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\CredentialGuard" /v Enabled /t REG_DWORD /d 0 /f
C:\Users\s1or> reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v LsaCfgFlags /t REG_DWORD /d 0 /f
```

> [!tip]
> Regla general de estados: `1 = activado`, `0 = desactivado`. Cualquier valor de estos en `1` debe pasar a `0`. Reinicia después de los cambios.

_____________________
## Metodo 6 - VT-x / AMD-V en la BIOS/UEFI

Aquí corrijo un malentendido habitual. **La virtualización por hardware (VT-x / AMD-V / SVM Mode) debe estar ACTIVADA** en la BIOS para que NoxPlayer funcione con aceleración: es justo lo que el emulador necesita usar.

La confusión del "si está activada, desactívala; si está desactivada, actívala" nace de **mezclar dos cosas distintas**:

- **VT-x/AMD-V (extensión de la CPU):** el "motor". Debe estar **ON**.
- **El hipervisor de Windows (Hyper-V/VBS):** _quién_ se apropia de ese motor. Es lo que tienes que apagar (Métodos 1 - 5).

Es decir: no se trata de apagar VT-x, sino de dejar VT-x encendido **y** evitar que Windows lo monopolice.

**Qué revisar en la BIOS/UEFI** (el nombre varía por fabricante):

- Intel: `Intel Virtualization Technology (VT-x)` y `VT-d` → **Enabled**
- AMD: `SVM Mode` → **Enabled**

![[Pasted image 20260620180102.png]]

> [!warning]
> Excepción real (no "prueba y error"): si tu equipo arranca con **Secure Boot** y VBS está bloqueada por firmware, en algunos casos hay que desactivar temporalmente VBS/Secure Boot para romper el monopolio. Pero VT-x como tal **se queda activado**.

_____________________

Espero te hallan servido estas recomendaciones, y si no te funcionan, por favor escríbeme directamente a través de mi Linkedln para poder apoyarte!
