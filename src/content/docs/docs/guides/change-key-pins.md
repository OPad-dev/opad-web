---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/guides/change-key-pins.md
lastUpdated: 2026-11-23T00:42:27+01:00
title: Changing Key Pins
description: How to reassign hand-wired mechanical switch GPIO pins in opad-gui, allowed and reserved pins, and V3 carrier pin notes.
sidebar:
  order: 5
---

By default, standalone hand-wired builds assign Key 1 to `GPIO 14` (Header P2, pin 11) and Key 2 to `GPIO 9` (Header P2, pin 12). If your switches are wired to different supported header pins, you can reassign them in `opad-gui` without recompiling firmware.

> [!NOTE]
> Pin reassignment applies only to hand-wired mechanical switches. On OPad V3 modular PCBs, switch routing is fixed by the carrier board (MX V3: `GPIO 10` / `GPIO 7` / `GPIO 6`; HE V3: ADS7028 over SPI3), and `opad-gui` hides the pin pickers automatically when a module reports fixed pins.

## What you need

- Your OPad connected over USB with `opad-daemon` and `opad-gui` running.
- Each mechanical switch wired between a supported P1/P2 GPIO pin and `GND`.

## Allowed GPIO Pins

Firmware accepts only the 14 header GPIOs in `KEY_GPIO_ALLOWED` that support internal pull-ups to 3.3 V without conflicting with onboard peripherals:

| Header Position | GPIO | Notes |
|---|---|---|
| P2 pin 11 | `GPIO 14` | Key 1 default |
| P2 pin 12 | `GPIO 9` | Key 2 default |
| P2 pin 7 | `GPIO 15` | Allowed |
| P2 pin 8 | `GPIO 13` | Allowed |
| P2 pin 9 | `GPIO 11` | Allowed |
| P2 pin 10 | `GPIO 12` | Allowed |
| P1 pin 1 | `GPIO 2` | Allowed |
| P1 pin 2 | `GPIO 4` | Allowed |
| P1 pin 3 | `GPIO 6` | Allowed |
| P1 pin 4 | `GPIO 16` | Allowed |
| P1 pin 6 | `GPIO 18` | Allowed |
| P1 pin 7 | `GPIO 21` | Allowed |
| P1 pin 9 | `GPIO 7` | Allowed |
| P1 pin 10 | `GPIO 10` | Allowed |

Key 1 and Key 2 cannot share the same GPIO. These pins are reserved and rejected by validation:
- `GPIO 19` / `GPIO 20`: Native USB `D-` / `D+`.
- `GPIO 43` / `GPIO 44`: UART0 console.
- `GPIO 47` / `GPIO 48`: Touch and IMU I2C bus (`SCL` / `SDA`).
- `GPIO 17`: Onboard 10 kΩ pull-down (`CAM_PWDN`).
- `GPIO 8`: Module-ID ADC resistor divider.

`opad-gui` offers the same list as the firmware (`KEY_PINS`, checked against `KEY_GPIO_ALLOWED` by a test). A pad that firmware from before 2026-09-24 left on `GPIO 8` shows it as `GPIO8 (unsupported)` and keeps it while its other settings change; only moving a key onto a pin outside the list is refused.

## Reassigning Pins in `opad-gui`

1. Open `opad-gui` and click **Settings** in the sidebar.
2. Stay on the **⌨ Keypad** tab.
3. Under **Keys**, locate **KEY 1 PIN** and **KEY 2 PIN**. You have two ways to set each pin:
   - **Pick manually**: Choose the pin from the dropdown (for example, `GPIO15 (P2 pin 7)`).
   - **Auto-Detect**: Click **Auto-Detect** next to **KEY 1 PIN** or **KEY 2 PIN** (the button changes to **Detecting... (click to cancel)**), then press the physical switch wired for that key. The pad scans all allowed unused GPIOs and fills in whichever pin is pulled LOW for at least 15 ms (`DETECT_CONFIRM_US = 15000`).
4. Click **Save settings**. The pad stages the new pins and applies them as soon as both keys are released, then saves them to NVS once `IDLE`.

For a V3 carrier MX module whose saved pins are still set to the standalone defaults (`GPIO 14` / `GPIO 9`), you can also switch them to the carrier pins (`GPIO 10` / `GPIO 7`) from a terminal with `opadctl board-test --fix-pins`.

## How to check

1. Run `opadctl status` and verify **Key Pins** matches your new GPIOs.
2. Press Key 1 and Key 2 in a text editor (or on the **Diagnostics** -> **⌨ Switch Chatter & Input** tab in `opad-gui`) and confirm both keys register cleanly.

## What to do if it did not work

- **A key does nothing after changing its pin**: Check the physical GPIO silkscreen label the wire is attached to and compare it with **Key Pins** in `opadctl status`. Schematic header positions (such as `P2 pin 11`) are easy to miscount on the board.
- **Pin pickers are missing**: Your pad reports a fixed-pin input module (such as a V3 carrier + MX/HE module), where pins are wired in PCB traces.
- **Auto-Detect times out**: Make sure the switch's other leg is connected to `GND` and the pin is in the allowed list above.
