---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/start/first-connection.md
lastUpdated: 2026-11-26T22:49:56+01:00
title: First Connection
description: Connecting OPad to a host computer, verifying 1000 Hz USB HID keyboard enumeration without software, and testing default key mappings.
sidebar:
  order: 3
---

OPad works out of the box as a standalone 1000 Hz USB HID keyboard with no desktop software or drivers installed. No background daemon, companion app, or third-party driver is required for basic typing and rhythm gaming.

## Plugging in the Pad

1. Plug a USB Type-C data cable into the Waveshare ESP32-S3 board (or the rear USB-C port on an OPad V3 or V4 case).
2. Connect the other end to a USB port on your PC.
3. The ESP32-S3 powers on, initializes the 2.0-inch LCD, and enumerates over USB. (Note: if an uncalibrated Hall Effect module is installed, the screen locks to the calibration prompt and suppresses keys until calibrated; see [Calibrating Hall Effect Switches](/docs/guides/calibrate-hall-effect/).)

## USB Enumeration Details

OPad enumerates as a USB composite device with two 1000 Hz (`bInterval = 1`) HID interfaces (keyboard + media/Key 2) and one CDC-ACM serial interface:

- **Vendor ID (VID)**: `0x303A` (Espressif)
- **Product ID (PID)**: `0x8415` (OPad application firmware; `0x1001` is the ESP32-S3 ROM bootloader)
- **Manufacturer String**: `GFerreiroS`
- **Product String**: `OPad ESP32-S3`
- **Serial String**: `OPAD-XXXXXXXXXXXX` (12 uppercase hex digits derived from the ESP32-S3 Wi-Fi STA MAC address)

### Verifying on Linux
Run `lsusb`:
```bash
lsusb -d 303a:8415
```
Check kernel messages with `dmesg`:
```bash
dmesg | grep -i opad
```
You should see the `OPad ESP32-S3` HID keyboard, media controls, and CDC-ACM serial (`/dev/ttyACM*`) interfaces enumerated.

### Verifying on Windows
1. Open **Device Manager**.
2. Expand **Keyboards**: standard **HID Keyboard Device** entries appear using the built-in `hidclass.sys` driver.
3. Expand **Ports (COM & LPT)**: **OPad (COMx)** appears using the built-in `usbser.sys` driver (Windows reads the `FriendlyName = "OPad"` property from OPad's MS OS 2.0 descriptor).

## Default Key Mappings

Out of the box, OPad uses these default HID keycodes:

| Control | Hardware Connection | Default HID Usage | US QWERTY Key |
|---|---|---|---|
| **Key 1** | Hand-wired: `GPIO 14` (P2 Pin 11) / V3 MX: `GPIO 10` / V3 HE: ADS7028 `AIN5` | `0x1D` | `z` |
| **Key 2** | Hand-wired: `GPIO 9` (P2 Pin 12) / V3 MX: `GPIO 7` / V3 HE: ADS7028 `AIN4` | `0x1B` | `x` |
| **Key 3** (V3 3-key modules) | V3 MX: `GPIO 6` / V3 HE: ADS7028 `AIN3` | `0x06` | `c` |
| **Touchscreen** | CST816S capacitive touch | `0x35` | `` ` `` / `~` (Quick Retry when standalone or in a map) |

### Quick Typing Test
Open any text editor:
1. Press Key 1: `z` appears (or the matching key on non-QWERTY layouts; see [Troubleshooting §1](/docs/troubleshooting/)).
2. Press Key 2: `x` appears.
3. Press Key 3 (on 3-key V3 modules): `c` appears.
4. Touch and hold the LCD screen (with no desktop daemon/tosu connected): `` ` `` is held while your finger stays down and released cleanly when you lift it.

To enable live osu! HUD telemetry, display layout customization, swipe actions, or Hall Effect settings, continue to [Installing the Desktop Suite](/docs/start/install-the-app/).
