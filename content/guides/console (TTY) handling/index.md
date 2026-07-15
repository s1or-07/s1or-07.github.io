_____________________
## Pasos a seguir

> [!TIP] Tratamiento de consola en una reverse shell
> Lo que haremos será aplicar un tratamiento a la consola, y debemos escribir lo siguiente:
> ```
> script /dev/null -c bash
> ```
> Ahora que hemos lanzado una seudo-consola, comenzamos con el tratamiento:
> 
> 1. Hacemos `Ctrl + Z`
> 
> Luego escribimos:
> ```
> stty raw -echo; fg
> reset xterm
> export TERM=xterm
> ```
> > [!WARNING] Y en dado caso que no tenga una bash
> > Aplicar el siguiente comando:
> > ```
> > export SHELL=bash
> > ```

Y listo!