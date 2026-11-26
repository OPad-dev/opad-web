---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/start/install-the-app.md
lastUpdated: 2026-11-24T22:19:20+01:00
title: Instalación de la suite de escritorio
description: Cómo instalar la suite de escritorio de OPad (opad-daemon, opad-gui, opadctl y tosu incluido) en Linux y Windows.
sidebar:
  order: 4
---

La suite de escritorio opcional de OPad añade telemetría en vivo de osu!, un diseñador de diseño de pantalla, sincronización de contadores de por vida, diagnósticos interactivos, actualizaciones de firmware y ajuste Hall Effect. Se compone de:

- `opad-daemon`: servicio en segundo plano que gestiona la comunicación USB CDC, la persistencia en SQLite y la supervisión de `tosu`.
- `opad-gui`: aplicación gráfica de configuración, diseñador de pantalla, diagnósticos y bandeja del sistema (construida con `iced`).
- `opadctl`: herramienta de línea de comandos para administración y flasheo de firmware.
- `tosu`: lector de memoria incluido que suministra telemetría de osu! en vivo (LGPL-3.0; puedes sustituirlo por el tuyo mediante `OPAD_TOSU_PATH` o **Settings** -> **ℹ About & tosu**).

## Instalación en Linux

Los paquetes precompilados para Linux se publican en la página de [GitHub Releases](https://github.com/OPad-dev/OPad/releases); las notas de cada lanzamiento empiezan diciendo qué archivo es para tu sistema. Están dirigidos a glibc 2.28+ y cubren Ubuntu 22.04/24.04/26.04, Debian 12/13, RHEL/AlmaLinux/Rocky 9–10, Fedora y Arch.

### Debian / Ubuntu / Pop!_OS (`.deb`)
```bash
sudo apt install ./OPad-Linux-Debian-Ubuntu-<version>.deb
```
O con `dpkg`:
```bash
sudo dpkg -i OPad-Linux-Debian-Ubuntu-<version>.deb
sudo apt-get install -f
```
El paquete instala:
- Binarios en `/usr/bin/`, `tosu` incluido en `/usr/lib/opad/tosu/` y `espflash` fijado en `/usr/lib/opad/bin/`.
- Reglas `udev` en `/etc/udev/rules.d/70-opad.rules` (y recarga `udevadm`).
- `cap_sys_ptrace=eip` en `/usr/lib/opad/tosu/tosu` para que `tosu` pueda leer la memoria de `osu!` con Yama `ptrace_scope` 1–2.
- La unidad de usuario de systemd `opad-daemon.service` y la entrada de inicio automático en escritorio/bandeja del sistema.

### Fedora / RHEL / openSUSE (`.rpm`)
```bash
sudo dnf install ./OPad-Linux-Fedora-<version>.rpm
```
Configura los mismos binarios, la regla `udev`, la capacidad `cap_sys_ptrace=eip` y la unidad de usuario de systemd que el paquete `.deb`.

### Arch Linux
Instala el paquete precompilado `opad-bin` del lanzamiento, que se actualiza solo como el `.deb` y el `.rpm`:
```bash
sudo pacman -U ./OPad-Linux-Arch-<version>.pkg.tar.zst
```
O compila e instala desde `packaging/linux/arch/PKGBUILD` del repositorio (nombre del paquete `opad`):
```bash
makepkg -si
```
En Arch, `tosu` se ejecuta bajo el `nodejs` del sistema (`TOSU_STANDALONE=0`), por lo que no se aplican capacidades de archivo a `node`; consulta [Solución de problemas §2](/es/docs/troubleshooting/) si `ptrace_scope > 0`.

### AppImage autónomo
```bash
chmod +x OPad-Linux-<version>.AppImage
./OPad-Linux-<version>.AppImage
```
En la primera ejecución, el AppImage ofrece instalar la regla `udev`, o puedes instalarla explícitamente con `pkexec`:
```bash
./OPad-Linux-<version>.AppImage install-udev
```
También puedes invocar el daemon o la CLI incluidos a través del AppImage: `./OPad-Linux-<version>.AppImage daemon` o `./OPad-Linux-<version>.AppImage ctl <command>`. Como un AppImage se monta con `nosuid`, `cap_sys_ptrace` no se aplica a su `tosu` incluido; consulta [Solución de problemas §2](/es/docs/troubleshooting/).

### Regla `udev` manual (instalaciones desde código fuente)
Si instalaste desde el código fuente con `make && sudo make install` o `make install-user`, instala `70-opad.rules` para que usuarios sin root puedan abrir el puerto CDC, el nodo USB y el nodo de entrada, y para que ModemManager no sondee el teclado:
```bash
sudo cp packaging/linux/udev/70-opad.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger
```
Ejecuta `opadctl setup` para comprobar las reglas `udev` y la configuración de `ptrace`.

## Instalación en Windows

Descarga `OPad-Windows-Setup-<version>.exe` desde [GitHub Releases](https://github.com/OPad-dev/OPad/releases) y ejecútalo.

1. **SmartScreen**: Hasta que se habilite la firma de código, Windows muestra "Windows protected your PC". Haz clic en **More info** -> **Run anyway** (puedes comprobar antes el archivo con el SHA-256 que la página del lanzamiento muestra junto a él).
2. **Instalación por usuario**: Se instala sin permisos de administrador (`PrivilegesRequired=lowest`) en `%LOCALAPPDATA%\Programs\opad` (`DefaultDirName={localappdata}\Programs\opad`).
3. **Archivos instalados**: `opad-gui.exe`, `opad-daemon.exe`, `opadctl.exe`, `espflash.exe`, `install-origin` y `tosu\tosu.exe`.
4. **Inicio automático**: La tarea opcional **Start OPad when I log in** (marcada por defecto) añade `opad-daemon` y `opad-gui` (`--tray`) en `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`.
5. **Sin controladores de terceros**: Windows 10/11 usa los controladores integrados `hidclass.sys` y `usbser.sys`.

## Iniciar el software

Abre **OPad** desde el menú de aplicaciones o el Menú Inicio:
- `opad-gui` se conecta a `opad-daemon` mediante IPC local (`$XDG_RUNTIME_DIR/opad/daemon.sock` en Linux, `\\.\pipe\opad-ipc-<SID>` en Windows).
- Verifica que todo esté conectado con `opadctl status` o en **Dashboard** de `opad-gui`.
