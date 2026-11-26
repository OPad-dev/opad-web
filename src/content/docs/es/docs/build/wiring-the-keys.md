---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/build/wiring-the-keys.md
lastUpdated: 2026-11-26T23:14:24+01:00
title: Cableado de las teclas
description: Cablea dos interruptores mecánicos al cabezal P2 de la Waveshare ESP32-S3-Touch-LCD-2, o conecta el carrier, el módulo y la USB board OPad V3.
sidebar:
  order: 2
---

Hay dos formas de montar las teclas: cablear a mano dos interruptores a la placa Waveshare o encajar entre sí las placas OPad V3. [Piezas y placas](/es/docs/build/parts/) enumera lo que necesita cada una.

## Opción 1: cablear a mano dos interruptores

Cada interruptor va entre un pin GPIO y GND. El firmware activa el pull-up interno del pin, así que el pin lee nivel alto cuando el interruptor está abierto y nivel bajo cuando lo pulsas. No necesitas resistencias ni diodos.

```text
Switch 1 (Key 1):  one leg -> P2 pin 11 (GPIO14)   other leg -> GND (P2 pin 13 or pin 2)
Switch 2 (Key 2):  one leg -> P2 pin 12 (GPIO9)    other leg -> GND (P2 pin 13 or pin 2)
```

1. Localiza el cabezal **P2** en la placa Waveshare.
2. Cablea **Key 1**: una patilla del primer interruptor a **P2 pin 11 (GPIO14)** y la otra a **GND**. El P2 pin 13, justo al lado, es GND, y el P2 pin 2 también.
3. Cablea **Key 2**: una patilla del segundo interruptor a **P2 pin 12 (GPIO9)** y la otra a GND.
4. Cualquiera de las dos patillas de un interruptor puede ir al GPIO. Los interruptores no tienen polaridad.

Estos dos pines son los predeterminados, así que el teclado funciona sin configurar nada. Si prefieres usar otros pines del cabezal, cabléalos ahora y configúralos después en la app; [Cambiar los pines de las teclas](/es/docs/guides/change-key-pins/) enumera los pines que puedes usar.

> [!WARNING]
> Si una tecla no hace nada, compara primero la etiqueta GPIO impresa en la placa junto al cable (la serigrafía) con **Key Pins** en `opadctl status`. La lista de pines de la app nombra posiciones del cabezal según el esquemático, como `GPIO14 (P2 pin 11)`, y es fácil contar mal los pines del cabezal.

## Opción 2: las PCBs OPad V3

El conjunto V3 te da tres teclas y un puerto USB-C trasero. Todo se monta encajando piezas; no hay que soldar nada a la placa.

1. Asienta el **controller carrier V3** en los cabezales P1 y P2 de la placa Waveshare.
2. Conecta el carrier a tu módulo de entrada, el **MX input module V3** o el **HE input module V3**, con el **FFC de 14 vías, 1,0 mm y tipo B**.
3. Conecta el carrier a la **USB board V3** con el **FFC de 8 vías, 1,0 mm y tipo A**. Su pinout es el mismo desde cualquiera de los dos extremos.
4. Conecta tu PC al puerto USB-C de la USB board.

El carrier fija qué pines usa cada tecla, así que no hay nada que configurar:

| Módulo | Líneas en el ESP32-S3 |
|---|---|
| MX input module V3 | Key 1 GPIO10, Key 2 GPIO7, Key 3 GPIO6, ID de módulo GPIO8 |
| HE input module V3 | ADS7028 por SPI: MISO GPIO6, SCLK GPIO2, MOSI GPIO4, CS GPIO10; ID de módulo GPIO8 |

El firmware lee qué módulo está montado a través de la línea de ID de módulo. Un cable de 14 vías dado la vuelta mueve el ID a GPIO7: el firmware reasigna las líneas SPI de un módulo HE para que coincidan, pero no puede leer así un módulo MX V3, de modo que asegúrate de que el cable no está dado la vuelta.

## Comprueba el cableado

1. Conecta el teclado a tu PC. Sin ninguna app, abre un editor de texto y pulsa cada tecla: deberías ver `z`, `x` (y `c` para Key 3 en un módulo V3). Consulta [Primera conexión](/es/docs/start/first-connection/).
2. Con la app de escritorio instalada, ejecuta `opadctl status` y revisa **Key Pins** e **Input Module**.
3. En un carrier V3, ejecuta la autoprueba de la placa con todas las teclas sueltas:

   ```bash
   opadctl board-test
   ```

   Comprueba el ID de módulo, la orientación del cable, las líneas de las teclas y los cortocircuitos del conector y, en un módulo HE V3, el ADC y los sensores. Añade `--magnet` para ver después los sensores HE en vivo mientras sostienes un imán sobre cada tecla, o `--fix-pins` si las teclas de un módulo MX siguen con los valores predeterminados del cableado a mano (GPIO14 / GPIO9): las mueve a GPIO10 / GPIO7 y vuelve a probar.
4. Para ver cada pulsación y cualquier rebote del interruptor, activa **Settings** → **🛠 Diagnostics** → **Enable Diagnostics Menu in Navigation** en `opad-gui` y abre **Diagnostics** → **⌨ Switch Chatter & Input**.
