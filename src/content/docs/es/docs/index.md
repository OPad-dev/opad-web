---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/index.md
lastUpdated: 2026-11-26T23:14:24+01:00
title: Documentación de OPad
description: OPad es un teclado de baja latencia para osu! sobre la Waveshare ESP32-S3-Touch-LCD-2, con software de escritorio opcional para Linux y Windows 10/11.
sidebar:
  order: 1
---

OPad es un teclado de tres teclas para osu! construido sobre la Waveshare ESP32-S3-Touch-LCD-2. Es un teclado USB a 1000 Hz: osu! se juega con dos teclas, la tercera está para tu estilo de juego y la pantalla táctil es un cuarto botón.

No necesitas ningún software para jugar: conecta el teclado y escribe como cualquier otro, en Linux y en Windows 10/11, sin controladores. La app de escritorio opcional (`opad-daemon`, `opad-gui` y `opadctl`) añade los extras:

- datos en vivo del mapa y la partida de osu! en la pantalla del teclado, mediante el tosu incluido;
- un diseñador para las pantallas de reposo y de partida del teclado;
- contadores de pulsaciones de por vida guardados en el teclado y en tu PC;
- acciones por deslizamiento en la pantalla táctil;
- calibración Hall Effect y rapid trigger;
- actualizaciones de firmware por USB.

## Primeros pasos

1. [Qué necesitas](/es/docs/start/what-you-need/): tu OPad, un cable USB-C de datos y un sistema operativo compatible.
2. [Primera conexión](/es/docs/start/first-connection/): conecta el teclado y comprueba que escribe.
3. [Instalar la app de escritorio](/es/docs/start/install-the-app/): paquetes de Linux, AppImage y el instalador de Windows.

## Monta el tuyo

- [Piezas y placas](/es/docs/build/parts/): la placa Waveshare, interruptores o PCBs V3, cables y carcasa.
- [Cableado de las teclas](/es/docs/build/wiring-the-keys/): cablea a mano dos interruptores o monta el carrier y el módulo V3.

## Tareas habituales

- [Actualizar el firmware](/es/docs/guides/update-firmware/)
- [Usar la pantalla táctil y los deslizamientos](/es/docs/guides/touchscreen-and-swipes/)
- [Personalizar el diseño de la pantalla](/es/docs/guides/customize-screen-layout/)
- [Calibrar interruptores Hall Effect](/es/docs/guides/calibrate-hall-effect/)
- [Cambiar los pines de las teclas](/es/docs/guides/change-key-pins/)
- [Usar OPad con tosu](/es/docs/guides/use-with-tosu/)
- [Copia de seguridad y restauración](/es/docs/guides/backup-and-restore/)
- [Desinstalar el software](/es/docs/guides/uninstall/)

## Cuando algo va mal

- [Solución de problemas](/es/docs/troubleshooting/): distribuciones de teclado, tosu en Linux, permisos USB, avisos de Windows.
- [Contadores, recuperación y desvinculación](/es/docs/recovery/): cómo se reconcilian los contadores, cómo reflashear y cómo recuperar un teclado que no aparece. Nunca hace falta un botón BOOT o RESET.

## Referencia y contexto

- **Referencia:** [`opadctl`](/es/docs/reference/opadctl/), [GUI](/es/docs/reference/gui/), [ajustes del dispositivo](/es/docs/reference/device-settings/), [pinout](/es/docs/reference/pinout/), [protocolo serie](/es/docs/reference/serial-protocol/), [IPC del daemon](/es/docs/reference/ipc/), [archivos y rutas](/es/docs/reference/files-and-paths/).
- **Cómo funciona:** [arquitectura](/es/docs/explanation/architecture/), [latencia](/es/docs/explanation/latency/), [la pantalla táctil como cuarto botón](/es/docs/explanation/touchscreen-button/), [versiones de la app y del teclado](/es/docs/explanation/app-and-pad-versions/), [contadores y propiedad](/es/docs/explanation/counters-and-ownership/), [actualizaciones y reversión](/es/docs/explanation/updates-and-rollback/), [Hall Effect y rapid trigger](/es/docs/explanation/hall-effect/).
- **Contribuir:** el [centro de desarrollo](/es/docs/develop/) cubre la compilación, las pruebas, los detalles internos, el empaquetado y los lanzamientos. La [lista de verificación de pruebas](https://github.com/OPad-dev/OPad/blob/main/docs/es/testing-checklist.md) recoge todas las comprobaciones de hardware y software.
