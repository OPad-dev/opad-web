---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/start/what-you-need.md
lastUpdated: 2026-11-26T22:49:56+01:00
title: What You Need
description: Hardware prerequisites, board specifications, compatible switches, USB cables, and operating system requirements for building and using OPad.
sidebar:
  order: 1
---

OPad is built around an off-the-shelf microcontroller development board paired with either hand-wired switches or custom OPad V3 modular PCBs.

## Hardware Requirements

### 1. Main Controller Board
- **Waveshare ESP32-S3-Touch-LCD-2**: ESP32-S3R8 microcontroller (240 MHz dual-core Xtensa LX7, **16 MB Flash**, **8 MB Octal PSRAM**), integrated 2.0-inch ST7789 IPS LCD (`320x240`), and CST816S capacitive touchscreen.

### 2. Switches & Input Modules
You can build an OPad with hand-wired mechanical switches or the OPad V3 modular PCBs:
- **Hand-Wired Mechanical (MX)**: Two standard Cherry MX-compatible mechanical switches (Cherry, Gateron, Kailh, Outemu, etc.) wired between header P2 and `GND`. No external resistors or diodes are needed.
- **OPad V3 Modular PCBs**:
  - **Controller Carrier V3**: Plugs directly onto headers P1 and P2 of the Waveshare board and connects to the input module via a 14-way, 1.0 mm type B FFC cable (80 mm in the V3 and V4 cases) and to the USB board via an 8-way, 1.0 mm type A FFC cable.
  - **MX Input Module V3**: 3-key mechanical hotswap PCB with Kailh hot-swap sockets (`CPG151101S11`).
  - **HE Input Module V3**: 3-key Hall Effect magnetic switch PCB with TI DRV5055A3 Hall sensors, TI ADS7028 12-bit SPI ADC, and dedicated LP5907 3.3 V LDO.
  - **USB Board V3**: Passive rear USB-C daughterboard with ESD protection, ferrite, and back-feed Schottky diode.

### 3. USB Cable
- A USB Type-C **data** cable (USB-C to USB-A or USB-C to USB-C). Charge-only cables supply power but cannot enumerate USB HID or CDC interfaces.

## Host Computer Requirements

OPad supports **Linux** and **Windows 10/11**:

### Linux
- Standard kernel `usbhid` and `cdc_acm` drivers.
- Supported release package targets: Ubuntu 22.04 / 24.04 / 26.04, Debian 12 / 13, RHEL / AlmaLinux / Rocky 9 & 10, current Fedora, and Arch Linux (release packages and bundled `tosu` require glibc 2.28 or newer).
- `udev` rule `70-opad.rules` for non-root serial and input access (installed automatically by `.deb` and `.rpm` packages).

### Windows
- **Windows 10 or Windows 11 (64-bit / x64)**.
- Built-in inbox drivers (`hidclass.sys` for HID and `usbser.sys` for CDC serial); no third-party driver or Zadig setup is required.

### Optional Desktop Software
OPad works immediately as a 1000 Hz USB HID keyboard with no software installed. The optional desktop suite (`opad-daemon`, `opad-gui`, `opadctl`, and bundled `tosu`) adds live osu! telemetry, display layout editing, lifetime counters, Hall Effect tuning, and firmware updates.
