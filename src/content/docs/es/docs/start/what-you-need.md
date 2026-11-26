---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/start/what-you-need.md
lastUpdated: 2026-11-26T22:49:56+01:00
title: Qué necesitas
description: Requisitos previos de hardware, especificaciones de la placa, interruptores compatibles, cables USB y requisitos del sistema operativo para montar y usar OPad.
sidebar:
  order: 1
---

OPad se construye en torno a una placa de desarrollo microcontroladora comercial combinada con interruptores cableados a mano o con las PCBs modulares OPad V3.

## Requisitos de hardware

### 1. Placa controladora principal
- **Waveshare ESP32-S3-Touch-LCD-2**: Microcontrolador ESP32-S3R8 (Xtensa LX7 de doble núcleo a 240 MHz, **16 MB de Flash**, **8 MB de Octal PSRAM**), pantalla IPS LCD ST7789 integrada de 2.0 pulgadas (`320x240`) y pantalla táctil capacitiva CST816S.

### 2. Interruptores y módulos de entrada
Puedes montar un OPad con interruptores mecánicos cableados a mano o con las PCBs modulares OPad V3:
- **Mecánico cableado a mano (MX)**: Dos interruptores mecánicos estándar compatibles con Cherry MX (Cherry, Gateron, Kailh, Outemu, etc.) cableados entre el cabezal P2 y `GND`. No se necesitan resistencias ni diodos externos.
- **PCBs modulares OPad V3**:
  - **Controller Carrier V3**: Se acopla directamente a los cabezales P1 y P2 de la placa Waveshare y se conecta al módulo de entrada mediante un cable FFC tipo B de 14 vías y 1.0 mm (80 mm en las carcasas V3 y V4) y a la placa USB mediante un cable FFC tipo A de 8 vías y 1.0 mm.
  - **MX Input Module V3**: PCB hotswap mecánica de 3 teclas con zócalos hot-swap Kailh (`CPG151101S11`).
  - **HE Input Module V3**: PCB de interruptores magnéticos Hall Effect de 3 teclas con sensores Hall TI DRV5055A3, ADC SPI de 12 bits TI ADS7028 y LDO LP5907 de 3.3 V dedicado.
  - **USB Board V3**: Placa auxiliar USB-C trasera pasiva con protección ESD, ferrita y diodo Schottky antirretorno.

### 3. Cable USB
- Un cable USB Tipo-C **de datos** (USB-C a USB-A o USB-C a USB-C). Los cables solo de carga suministran corriente pero no pueden enumerar interfaces USB HID ni CDC.

## Requisitos del ordenador anfitrión

OPad es compatible con **Linux** y **Windows 10/11**:

### Linux
- Controladores estándar del núcleo `usbhid` y `cdc_acm`.
- Objetivos de paquetes de lanzamiento soportados: Ubuntu 22.04 / 24.04 / 26.04, Debian 12 / 13, RHEL / AlmaLinux / Rocky 9 y 10, Fedora actual y Arch Linux (los paquetes de lanzamiento y el `tosu` incluido requieren glibc 2.28 o superior).
- Regla `udev` `70-opad.rules` para acceso serie y de entrada sin root (instalada automáticamente por los paquetes `.deb` y `.rpm`).

### Windows
- **Windows 10 o Windows 11 (64 bits / x64)**.
- Controladores integrados (`hidclass.sys` para HID y `usbser.sys` para serie CDC); no requiere controladores de terceros ni Zadig.

### Software de escritorio opcional
OPad funciona de inmediato como un teclado USB HID a 1000 Hz sin software instalado. La suite de escritorio opcional (`opad-daemon`, `opad-gui`, `opadctl` y `tosu` incluido) añade telemetría en vivo de osu!, edición del diseño de pantalla, contadores de por vida, ajuste Hall Effect y actualizaciones de firmware.
