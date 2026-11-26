---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/start/wiring-the-keys.md
lastUpdated: 2026-11-26T22:49:56+01:00
title: Cableado de las teclas
description: Cómo cablear interruptores mecánicos a mano al cabezal P2 de la Waveshare ESP32-S3-Touch-LCD-2 o ensamblar el carrier y los módulos de entrada OPad V3.
sidebar:
  order: 2
---

Los interruptores mecánicos en OPad se leen en lógica activa-baja utilizando las resistencias pull-up internas del ESP32-S3 (`GPIO_PULLUP_ONLY`): pulsar un interruptor conecta su pin GPIO a `GND`. No se requieren resistencias ni diodos externos en montajes cableados a mano.

## Opción 1: Cableado manual de interruptores mecánicos (cabezal P2)

Cuando cableas dos interruptores directamente a los cabezales de la Waveshare ESP32-S3-Touch-LCD-2:

```text
Switch 1 (Key 1) ------------ P2 Pin 11 (GPIO 14)
                 \
                  ----------- P2 Pin 13 or Pin 2 (GND)

Switch 2 (Key 2) ------------ P2 Pin 12 (GPIO 9)
                 \
                  ----------- P2 Pin 13 or Pin 2 (GND)
```

1. **Localiza el cabezal P2** en la parte trasera de la placa Waveshare ESP32-S3-Touch-LCD-2.
2. **Cablea Key 1**: Conecta un terminal del interruptor 1 a **P2 Pin 11 (`GPIO 14`)** y el otro terminal a **GND** (P2 Pin 13 está justo al lado, o puedes usar P2 Pin 2).
3. **Cablea Key 2**: Conecta un terminal del interruptor 2 a **P2 Pin 12 (`GPIO 9`)** y el otro terminal a **GND**.
4. **Polaridad**: Los interruptores mecánicos no tienen polaridad; cualquiera de las dos patillas puede ir al pin GPIO y la otra a `GND`.
5. **Pines personalizados**: Si conectas los interruptores a otros GPIOs admitidos de P1/P2, reasígnalos después en `opad-gui` (**Settings** -> **⌨ Keypad** -> **KEY 1 PIN** / **KEY 2 PIN** o **Auto-Detect**). Consulta [Cambio de pines de teclas](/es/docs/guides/change-key-pins/) y [Referencia de pinout](/es/docs/reference/pinout/).

> [!WARNING]
> Compara siempre la etiqueta física de serigrafía de la placa con **Key Pins** en `opadctl status` si una tecla no hace nada. El desplegable de la GUI muestra posiciones del cabezal del esquemático (como `GPIO14 (P2 pin 11)`), fáciles de confundir al contar los pines del cabezal.

## Opción 2: Carrier y PCBs modulares OPad V3

Si estás montando el conjunto de PCBs OPad V3 (`hardware/pcb/V3/`):

- **Controller Carrier V3**: Encaja sobre los cabezales P1 y P2 de la placa Waveshare mediante dos conectores hembra 1x14.
- **Cable de módulo**: Conecta el carrier al **MX Input Module V3** (3 teclas, zócalos hot-swap Kailh) o al **HE Input Module V3** (3 teclas, sensores Hall Effect + ADC ADS7028) mediante un **FFC tipo B de 14 vías y 1.0 mm** (80 mm en las carcasas V3 y V4).
- **Cable USB**: Conecta el carrier a la **USB Board V3** mediante un **FFC tipo A de 8 vías y 1.0 mm** (80 mm en las carcasas V3 y V4, pinout simétrico).
- **Enrutado fijo del carrier V3**:
  - **MX Input Module V3** (FFC derecho): `KEY1 = GPIO 10`, `KEY2 = GPIO 7`, `KEY3 = GPIO 6`, `ID = GPIO 8` (nota: un módulo MX V3 con el FFC invertido no se lee; inserta el cable tipo B derecho).
  - **HE Input Module V3**: `ID = GPIO 8`, SPI3 hacia el ADS7028 en `MISO = GPIO 6`, `SCLK = GPIO 2`, `MOSI = GPIO 4`, `CS = GPIO 10` (el firmware remapea automáticamente los pines SPI si el FFC de 14 vías está invertido, con `ID` en `GPIO 7`).

## Verificar el cableado

1. Conecta el teclado al ordenador por USB.
2. Comprueba las asignaciones de pines activas y el módulo detectado en un terminal:
   ```bash
   opadctl status
   ```
3. En un carrier + módulo V3, ejecuta la autoprueba de PCB de hardware con todas las teclas sueltas:
   ```bash
   opadctl board-test
   ```
   (Añade `--fix-pins` si un módulo MX en carrier sigue configurado en los pines predeterminados autónomos `GPIO 14` / `GPIO 9`, o `--magnet` para verificar los sensores Hall Effect V3 en vivo.)
4. En montajes cableados a mano, también puedes activar **Settings** -> **🛠 Diagnostics** -> **Enable Diagnostics Menu in Navigation** en `opad-gui` y probar pulsaciones y rebotes en la pestaña **⌨ Switch Chatter & Input**, o usar **Auto-Detect** en **Settings** -> **⌨ Keypad**.
