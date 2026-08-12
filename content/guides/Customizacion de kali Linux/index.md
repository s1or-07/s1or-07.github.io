
_____________________
# Proceso de personalización
### Actualización del sistema

Primero se procederá a actualizar el sistema operativo en cuestión:

```shell
sudo apt update && sudo apt full-upgrade -y
```

### Instalación de Dependencias

Luego se instalaran las dependencias y herramientas iniciales.

```shell
sudo apt install rofi build-essential git vim libxcb-util0-dev libxcb-ewmh-dev libxcb-randr0-dev libxcb-icccm4-dev libxcb-keysyms1-dev libxcb-xinerama0-dev libasound2-dev libxcb-xtest0-dev libxcb-shape0-dev libxcb-xkb-dev libconfig-dev libdbus-1-dev libegl-dev libev-dev libgl-dev libepoxy-dev libpcre2-dev libpixman-1-dev libx11-xcb-dev libxcb1-dev libxcb-composite0-dev libxcb-damage0-dev libxcb-glx0-dev libxcb-image0-dev libxcb-present-dev libxcb-render0-dev libxcb-render-util0-dev libxcb-util-dev libxcb-xfixes0-dev meson ninja-build uthash-dev cmake cmake-data pkg-config python3-sphinx libcairo2-dev python3-xcbgen xcb-proto libxcb-xrm-dev libxcb-cursor-dev libpulse-dev libjsoncpp-dev libmpdclient-dev libcurl4-openssl-dev libnl-genl-3-dev imagemagick feh libapparmor-dev gawk -y
```

### Paquete y estructura de `Blue-skye`

Únicamente clonaremos el repositorio

```shell
cd ~/Descargas/
git clone https://github.com/VaughnValle/blue-sky.git
```

### Instalación y compilación de `BSPWM`

Procedemos a clonar el repositorio para `BSPWM`

```shell
cd ~/Descargas/
git clone https://github.com/baskerville/bspwm.git
```

Entramos al directorio `bspwm` y compilamos

```shell
cd ~/Descargas/bspwm
make
sudo make install
```

luego ejecutamos el siguiente comando para asegurarnos que `bspwm` si aparezca una vez cerramos sesión

```shell
sudo cp /usr/local/share/xsessions/bspwm.desktop /usr/share/xsessions/
```

### Instalación y compilación de `SXHKD`

Procedemos a clonar el repositorio para `SXHKD`

```shell
cd ~/Descargas/
git clone https://github.com/baskerville/sxhkd.git
```

Entramos al directorio `sxhkd` y compilamos

```shell
cd ~/Descargas/sxhkd
make
sudo make install
```

### Creación de carpetas para `bspwm` y `sxhkd`

Finalizamos creando sus respectivas carpetas dentro del directorio `~/.config/`

```shell
mkdir ~/.config/{bspwm,sxhkd,picom}
```

Y anexamos los ejemplos del repositorio clonado dentro de las carpetas que acabamos de crear.

```shell
cp ~/Descargas/bspwm/examples/bspwmrc ~/.config/bspwm && cp ~/Descargas/bspwm/examples/sxhkdrc ~/.config/sxhkd
```

Luego creamos la carpeta `scripts` dentro del directorio `~/.config/bspwm` para poder crear el archivo `bspwm_resize`

```shell
cd ~/.config/bspwm/
mkdir script
touch bspwm_resize
chmod +x bspwm_resize
```

### Instalación y compilación de `Polybar`

Procedemos a ejecutar el siguiente comando.

```shell
sudo apt install polybar -y
```

Luego, copiamos la carpeta `polybar` del repositorio de `Blue-Sky` y la movemos a nuestra carpeta `.config/`

```shell
cd ~/Descargas/blue-sky
mv polybar/ ~/.config/
```

### Instalación y compilación de `Picom`

Procedemos a clonar el repositorio para `Picom`

```shell
cd ~/Descargas/
git clone https://github.com/yshui/picom.git
```

Entramos al directorio `picom` y compilamos

```shell
cd ~/Descargas/picom
meson setup --buildtype=release build
ninja -C build
ninja -C build install
```

Y ya por ultimo creamos el archivo `picom.conf` dentro del directorio `~/.config/picom`

```shell
cd ~/.config/picom
touch picom.conf
```

### Instalamos `Firejial`

Procedemos a clonar el repositorio para `firejail`

```shell
cd ~/Descargas/
git clone https://github.com/netblue30/firejail.git
```

Entramos al directorio `firejail` y compilamos

```shell
cd ~/Descargas/firejail
./configure && make && sudo make install-strip
```

### Descargamos `Kitty`

Para esta instalación debemos de crear la carpeta `kitty` en el directorio `/opt/`.

```shell
cd /opt/
mkdir kitty/
```

luego descargamos la ultima versión de la terminal.

```shell
cd /opt/kitty/
wget https://github.com/kovidgoyal/kitty/releases/download/v0.43.1/kitty-0.43.1-x86_64.txz
tar -xf kitty-0.43.1-x86_64.txz
```

> [!important] PATH
> Ya dentro de la terminal `kitty`, debemos ejecutar el siguiente comando.
> 
> ```shell
> echo -e "\n# PATH\n# -----------------------------------------\n$PATH$" >> ~/.zshrc
> ```
> 

### Descarga y compilación de fuentes

Una vez ya descargadas las fuentes de preferencia, es necesario moverlas a 4 direcciones especificas y reiniciamos el cache.

```shell
cd ~/Descargas/fonts
sudo cp * /usr/share/fonts && fc-cache -v
sudo cp * /usr/local/share/fonts && fc-cache -v
sudo cp * /usr/share/fonts/truetype && fc-cache -v
sudo cp * ~/.config/polybar/fonts/ && fc-cache -v
```

### Descarga e instalación de la `PowerLVL10k`

Primero clonaremos el repositorio, tanto en el usuario local como en el root.

```shell
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
```

> [!warning] Enlace simbolico
> Crearemos un enlace simbólico para el archivo `.zshrc` desde el usuario `root`
> 
> ```shell
> cd /root/
> ln -s -f /home/s1or/.zshrc .zshrc
> ```
> El objetivo de crear un enlace simbólico es configurar un único archivo

luego ejecutamos el siguiente comando.

```shell
echo -e "\n# Powerlvl10k\n# -----------------------------------------\nsource ~/powerlevel10k/powerlevel10k.zsh-theme" >> ~/.zshrc
```

### Descarga e Instalación de `BAT`

Clonaremos el repositorio `bat` y descompilamos

```shell
cd ~/Descargas/
wget https://github.com/sharkdp/bat/releases/download/v0.25.0/bat_0.25.0_amd64.deb
sudo dpkg -i bat_0.25.0_amd64.deb
```

### Descarga e Instalación de `LSD`

Clonaremos el repositorio `lsd` y descompilamos

```shell
cd ~/Descargas/
wget https://github.com/lsd-rs/lsd/releases/download/v1.1.5/lsd_1.1.5_amd64.deb
sudo dpkg -i bat_0.25.0_amd64.deb
```

_____________________
# scripts de configuración
### scripts para el directorio de `bspwm`

> [!TIP] Los siguientes archivos deben estar alojados en el directorio `~/.config/bspwm/script/` y deben tener permisos de ejecución `+x`.
> ###### bspwm_resize
> ```powershell
> > #!/usr/bin/env dash
> 
> if bspc query -N -n focused.floating > /dev/null; then
>         step=20
> else
>         step=100
> fi
> 
> case "$1" in
>         west) dir=right; falldir=left; x="-$step"; y=0;;
>         east) dir=right; falldir=left; x="$step"; y=0;;
>         north) dir=top; falldir=bottom; x=0; y="-$step";;
>         south) dir=top; falldir=bottom; x=0; y="$step";;
> esac
> 
> bspc node -z "$dir" "$x" "$y" || bspc node -z "$falldir" "$x" "$y"
> ```
> 

### scripts para el directorio de `polybar`


> [!WARNING] Los siguientes archivos deben estar alojados en el directorio `~/.config/polybar/scripts/` y deben tener permisos de ejecución `+x`.
> ###### target_to_hack.sh
> 
> ```bash
> #!/bin/bash
> 
> ip_address=$(cat /home/s1or/.config/bin/target | awk '{print $1}')
> machine_name=$(cat /home/s1or/.config/bin/target | awk '{print $2}')
> 
> if [ $ip_address ] && [ $machine_name ]; then
>     echo "%{B#212121}%{F#ff0000}ICONO %{T2}%{F#ffffff}$ip_address%{u-} | $machine_name"
> else
>     echo "%{B#212121}%{F#ff0000}ICONO %{u-}%{T2}%{F#ffffff}No target"
> fi
> ```
> 
> ###### hack_to_hack.sh
> 
> ```bash
> #!/bin/sh
> 
> IFACE=$(/usr/sbin/ifconfig | grep tun0 | awk '{print $1}' | tr -d ':')
> 
> if [ "$IFACE" = "tun0" ]; then
>     echo "%{B#212121}%{F#1bbf3e}ICONO %{T2}%{F#ffffff}$(/usr/sbin/ifconfig tun0 | grep "inet " | awk '{print $2}')%{u-}"
> else
>     echo "%{B#212121}%{F#1bbf3e}ICONO %{u-} %{T2}%{F#ffffff}Disconnected"
> fi
> ```
> 
> ###### ethernet_status.sh
> 
> ```bash
> #!/usr/bin/env bash
> 
> echo "%{T-}%{B#212121}%{F#2495e7}ICONO %{T2}%{F#ffffff}$(/usr/sbin/ifconfig eth0 | grep 'inet ' | awk '{print $2}')%{u-}"
> ```
> 

### errores comunes

> [!BUG] Insecurete files in root
> zsh compinit: insecure files, run compaudit for list.
> Ignore insecure files and continue [y] or abort compinit [n]?
> 
> ```shell
> $ compaudit 
> There are insecure files:
> /usr/local/share/zsh/site-functions/_bspc
> 
> $ ls -la /usr/local/share/zsh/site-functions/_bspc
> -rw-rw-r-- 1 s1or s1or 16336 may 22 03:51 /usr/local/share/zsh/site-functions/_bspc
> 
> $ chown root:root /usr/local/share/zsh/site-functions/_bspc
> ```

### funcionalidades de la terminal

> [!TIP] los siguientes scripts deben estar alojados dentro del archivo `.zshrc`
> ###### comandos `settarget`, `cleartarget`, `extractPorts`
> 
> ```bash
> # Custom scripts
> # ------------------------------------------------------------------
> # settarget
> function settarget(){
>     ip_address=$1
>     machine_name=$2
>     echo "$ip_address $machine_name" > /home/s1or/.config/polybar/scripts/target
> }
> # cleartarget
> function cleartarget(){
>     echo '' > /home/s1or/.config/polybar/scripts/target
> }
> #extractPorts
> function extractPorts(){
>   ports="$(cat $1 | grep -oP '\d{1,5}/open' | awk '{print $1}' FS='/' | xargs | tr ' ' ',')"
>   ip_address="$(cat $1 | grep -oP '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' | sort -u | head -n 1)"
> 
>   echo -e "\n[*] Extracting information...\n" > extractPorts.tmp
>   echo -e "\t[*] IP Address: $ip_address" >> extractPorts.tmp
>   echo -e "\t[*] Open ports: $ports\n" >> extractPorts.tmp
>   echo $ports | tr -d '\n' | xclip -sel clip
>   echo -e "[*] Ports copied to clipboard\n" >> extractPorts.tmp
> 
>   bat extractPorts.tmp
>   rm extractPorts.tmp
> }
> ```
> 
> ###### aliases
> 
> ```bash
> # Custom Aliases
> # -----------------------------------------------
> # bat
> alias cat='bat'
> alias catn='bat --style=plain'
> alias catnp='bat --style=plain --paging=never'
> 
> # ls
> alias ll='lsd -lh --group-dirs=first'
> alias la='lsd -a --group-dirs=first'
> alias l='lsd --group-dirs=first'
> alias lla='lsd -lha --group-dirs=first'
> alias ls='lsd --group-dirs=first'
> ```
> 
> ###### resolución de problemas
> 
> ```bash
> # Fix the Java Problem
> export _JAVA_AWT_WM_NONREPARENTING=1
> 
> # History configurations
> HISTFILE=~/.zsh_history
> HISTSIZE=1000
> SAVEHIST=2000
> setopt histignorealldups sharehistory
> setopt hist_expire_dups_first # delete duplicates first when HISTFILE size exceeds HISTSIZE
> setopt hist_ignore_dups       # ignore duplicated commands history list
> setopt hist_ignore_space      # ignore commands that start with space
> setopt hist_verify            # show command with history expansion to user before running it
> #setopt share_history         # share command history data
> ```
> 

_____________________
# comandos de interés
### nvim

| SHORCUT               | DESCRIPTION         |
| --------------------- | ------------------- |
| `Esc + Space + T + H` | Elegir nuevo tema   |
| `Ctrl + N`            | Abrir barra lateral |
| `Esc + Space + f + f` | Buscar por archivo  |
| `Esc + Space + C + H` | CheatSheet          |

### kitty

| SHORTCUT                    | DESCRIPTION                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `ctrl + shift + return`     | Abrir otra consola dentro de la misma ruta                                                                          |
| `ctrl + shift + r`          | Ajustar el tamaño de la consola                                                                                     |
| `ctrl + shift + w`          | Cerrar una de las ventanas                                                                                          |
| `ctrl + shift + z`          | Hacer zoom - Consola tamaño completo                                                                                |
| `ctrl + shift + t`          | Crear espacios de trabajo                                                                                           |
| `ctrl + shift + alt + t`    | renombrar esos espacios de trabajo                                                                                  |
| `ctrl + shift + left,right` | moverse entre los espacios de trabajo                                                                               |
| `ctrl + shit + , .`         | mover de posición los espacios de trabajo                                                                           |
| `alt + u`                   | para retroceder una acciona en un archivo                                                                           |
| `ctrl + r`                  | mientras estas escribiendo un comando, tocar este shorcut para ver el historial de comandos usados con anterioridad |
| `ctrl + shift + L`          | Sirve para cambiar la forma en la que estar organizadas las ventanas (horizontal a vertical)                        |
### sytem

| SHORCUT                                   | DESCRIPTION                                              |
| ----------------------------------------- | -------------------------------------------------------- |
| `super + shift + 1...9`                   | Mover la ventana seleccionada a otro escritorio.         |
| `ctrl + R`                                | Ver todos los comandos usados en la consola              |
| `ctrl + T`                                | Buscador de archivos en el directorio actual             |
| `super + shift + x`                       | Bloquear pantalla                                        |
| `super + shift + q`                       | Reiniciar equipo                                         |
| `super + d`                               | Rofi                                                     |
| `super + shift + r` `super + esc`         | Reiniciar consola                                        |
| `super + w`                               | Cerrar ventana seleccionada                              |
| `super + return`                          | Abrir consola                                            |
| `ctrl + super + alt + left,right,up,down` | Preselector.                                             |
| `ctrl + super`                            | Ajusta tamaño del preselector una vez esta usandose.     |
| `super + s`                               | Ajustar la ventana.                                      |
| `super + t`                               | Maximizar a pantalla completa                            |
| `ctrl + super + left,right,up,down`       | Mueve la ventana selecionada.                            |
| `super + alt`                             | Ajusta el tamaño de la ventana seleccionada manualmente. |
| `super + left,right,up,down`              | Se mueve entre ventanas en el mismo escritorio           |
| `super + shift + f`                       | Abrir Firefox                                            |
| `super + shift + left,right,up,down`      | Cambiar de posición de la ventana con la de al lado      |
| `alt + .`                                 | coger la ultima palabra del comando anterior             |

### smbserver

```shell
sudo impacket-smbserver smbFolder $(pwd) -smb2support -username s1or -password s1or
```

```shell
echo '' > ~/.zsh_history
```

# herramientas
### Docker

Ejecute el siguiente comando para desinstalar todos los paquetes en conflicto:

```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt remove $pkg; done
```

Configurar Docker `apt`repositorio.

```bash
# Add Docker's official GPG key:
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian bookworm stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Para instalar la última versión, ejecute:

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl status docker
```

### BloodHound

Descargue la última versión de `BloodHound CLI` para su sistema operativo y arquitectura (AMD o ARM)

```shell
wget https://github.com/SpecterOps/bloodhound-cli/releases/latest/download/bloodhound-cli-linux-amd64.tar.gz
```

Acontinuación, descomprima el archivo:

```shell
tar -xvzf bloodhound-cli-linux-amd64.tar.gz
```

En su terminal, ingrese el siguiente comando para instalar BloodHound Community Edition a través de BloodHound CLI:

```shell
sudo ./bloodhound-cli install
```