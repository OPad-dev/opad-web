---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/start/install-the-app.md
lastUpdated: 2026-11-24T22:19:20+01:00
title: Installing the Desktop Suite
description: How to install the OPad desktop suite (opad-daemon, opad-gui, opadctl, and bundled tosu) on Linux and Windows.
sidebar:
  order: 4
---

The optional OPad desktop suite adds live osu! gameplay telemetry, a screen layout designer, lifetime key counter sync, interactive diagnostics, firmware updates, and Hall Effect tuning. It consists of:

- `opad-daemon`: background service handling USB CDC communication, SQLite persistence, and `tosu` supervision.
- `opad-gui`: graphical configuration, layout designer, diagnostics, and system tray app (built with `iced`).
- `opadctl`: command-line management and firmware flashing tool.
- `tosu`: bundled memory reader providing live osu! telemetry (LGPL-3.0; you can substitute your own via `OPAD_TOSU_PATH` or **Settings** -> **ℹ About & tosu**).

## Linux Installation

Pre-built Linux packages are published on the [GitHub Releases](https://github.com/OPad-dev/OPad/releases) page; each release's notes start with which file is for your system. They target glibc 2.28+, covering Ubuntu 22.04/24.04/26.04, Debian 12/13, RHEL/AlmaLinux/Rocky 9–10, Fedora, and Arch.

### Debian / Ubuntu / Pop!_OS (`.deb`)
```bash
sudo apt install ./OPad-Linux-Debian-Ubuntu-<version>.deb
```
Or with `dpkg`:
```bash
sudo dpkg -i OPad-Linux-Debian-Ubuntu-<version>.deb
sudo apt-get install -f
```
The package installs:
- Binaries into `/usr/bin/`, bundled `tosu` into `/usr/lib/opad/tosu/`, and pinned `espflash` into `/usr/lib/opad/bin/`.
- `udev` rules at `/etc/udev/rules.d/70-opad.rules` (and reloads `udevadm`).
- `cap_sys_ptrace=eip` on `/usr/lib/opad/tosu/tosu` so `tosu` can read `osu!` memory under Yama `ptrace_scope` 1–2.
- The `opad-daemon.service` systemd user unit and desktop/tray autostart entry.

### Fedora / RHEL / openSUSE (`.rpm`)
```bash
sudo dnf install ./OPad-Linux-Fedora-<version>.rpm
```
Sets up the same binaries, `udev` rule, `cap_sys_ptrace=eip` capability, and systemd user unit as the `.deb` package.

### Arch Linux
Install the release's prebuilt `opad-bin` package, which updates itself like the `.deb` and `.rpm`:
```bash
sudo pacman -U ./OPad-Linux-Arch-<version>.pkg.tar.zst
```
Or build and install from the repository's `packaging/linux/arch/PKGBUILD` (package name `opad`):
```bash
makepkg -si
```
On Arch, `tosu` runs under the system `nodejs` (`TOSU_STANDALONE=0`), so file capabilities are not applied to `node`; see [Troubleshooting §2](/docs/troubleshooting/) if `ptrace_scope > 0`.

### Standalone AppImage
```bash
chmod +x OPad-Linux-<version>.AppImage
./OPad-Linux-<version>.AppImage
```
On first run, the AppImage offers to install the `udev` rule, or you can install it explicitly via `pkexec`:
```bash
./OPad-Linux-<version>.AppImage install-udev
```
You can also invoke the bundled daemon or CLI through the AppImage: `./OPad-Linux-<version>.AppImage daemon` or `./OPad-Linux-<version>.AppImage ctl <command>`. Because an AppImage mounts `nosuid`, `cap_sys_ptrace` does not apply to its bundled `tosu`; see [Troubleshooting §2](/docs/troubleshooting/).

### Manual `udev` Rule (Source Installs)
If you installed from source with `make && sudo make install` or `make install-user`, install `70-opad.rules` so non-root users can open the CDC port, USB node, and input node and so ModemManager does not probe the pad:
```bash
sudo cp packaging/linux/udev/70-opad.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger
```
Run `opadctl setup` to verify `udev` rules and `ptrace` configuration.

## Windows Installation

Download `OPad-Windows-Setup-<version>.exe` from [GitHub Releases](https://github.com/OPad-dev/OPad/releases) and run it.

1. **SmartScreen**: Until code signing is enabled, Windows displays "Windows protected your PC". Click **More info** -> **Run anyway** (you can first check the file against the SHA-256 the release page shows next to it).
2. **Per-user install**: Installs without administrator rights (`PrivilegesRequired=lowest`) into `%LOCALAPPDATA%\Programs\opad` (`DefaultDirName={localappdata}\Programs\opad`).
3. **Installed files**: `opad-gui.exe`, `opad-daemon.exe`, `opadctl.exe`, `espflash.exe`, `install-origin`, and `tosu\tosu.exe`.
4. **Startup**: The optional task **Start OPad when I log in** (checked by default) adds `opad-daemon` and `opad-gui` (`--tray`) under `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`.
5. **No third-party drivers**: Windows 10/11 uses built-in `hidclass.sys` and `usbser.sys`.

## Starting the Software

Launch **OPad** from your application menu or Start Menu:
- `opad-gui` connects to `opad-daemon` over local IPC (`$XDG_RUNTIME_DIR/opad/daemon.sock` on Linux, `\\.\pipe\opad-ipc-<SID>` on Windows).
- Verify everything is connected with `opadctl status` or on the `opad-gui` **Dashboard**.
