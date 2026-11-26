---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/index.md
lastUpdated: 2026-11-23T00:32:11+01:00
title: Documentación de OPad
description: Resumen de OPad, el teclado de baja latencia para osu! basado en ESP32-S3 y su suite de escritorio, con puntos de entrada para usuarios y desarrolladores.
sidebar:
  order: 1
---

OPad es un teclado USB HID de baja latencia a 1000 Hz para osu! construido sobre la placa Waveshare ESP32-S3-Touch-LCD-2, acompañado de una suite de escritorio opcional en Rust (`opad-daemon`, `opad-gui`, `opadctl`) para Linux y Windows 10/11.

El teclado funciona de inmediato como un teclado USB sin controladores y sin instalar ningún software. Añadir la suite de escritorio opcional habilita telemetría en vivo de osu! mediante `tosu`, un diseñador visual de diseño de pantalla, contadores de pulsaciones de por vida, acciones por deslizamiento en la pantalla táctil, calibración y ajuste de Rapid Trigger para interruptores Hall Effect, y actualizaciones de firmware por USB sin usar botones.

## Empieza aquí (Usar OPad)

- [Qué necesitas](/es/docs/start/what-you-need/) — placa Waveshare, interruptores mecánicos o Hall Effect, PCBs OPad V3 y requisitos del sistema operativo.
- [Cableado de las teclas](/es/docs/start/wiring-the-keys/) — cableado manual de interruptores al cabezal P2 o montaje del carrier y los módulos V3.
- [Primera conexión](/es/docs/start/first-connection/) — conectar el teclado y verificar la escritura USB HID a 1000 Hz sin software.
- [Instalación de la suite de escritorio](/es/docs/start/install-the-app/) — paquetes de Linux (`.deb`, `.rpm`, Arch, AppImage) e instalador de Windows.

## Tareas frecuentes

- [Actualización de firmware](/es/docs/guides/update-firmware/) — actualización por USB desde `opad-gui` u `opadctl` con protección automática de reversión A/B.
- [Pantalla táctil y deslizamientos](/es/docs/guides/touchscreen-and-swipes/) — Quick Retry dentro de los mapas y acciones de deslizamiento configurables fuera de los mapas.
- [Personalizar el diseño de pantalla](/es/docs/guides/customize-screen-layout/) — crear, previsualizar, exportar e importar diseños personalizados `Idle` y `Playing` en el diseñador de pantalla.
- [Calibración de interruptores Hall Effect](/es/docs/guides/calibrate-hall-effect/) — calibración guiada de 5 pulsaciones y ajuste de actuación / Rapid Trigger.
- [Cambio de pines de teclas](/es/docs/guides/change-key-pins/) — reasignación de GPIOs para interruptores cableados a mano y uso de **Auto-Detect**.
- [Uso de OPad con tosu](/es/docs/guides/use-with-tosu/) — configuración de telemetría en vivo de osu! y ajuste de `ptrace` en Linux.
- [Copia de seguridad y restauración](/es/docs/guides/backup-and-restore/) — exportación e importación de la configuración y de los contadores de por vida.
- [Recuperación, reflasheo y desvinculación](/es/docs/recovery/) — recuperación de un teclado que no responde sin botones BOOT/RESET, reconciliación de contadores y desvinculación.
- [Solución de problemas](/es/docs/troubleshooting/) — distribuciones no QWERTY, `ptrace_scope` de Yama en Linux, reglas `udev`, Windows SmartScreen y recuperación.
- [Desinstalación de OPad](/es/docs/guides/uninstall/) — eliminación limpia de la suite de escritorio en Linux y Windows.

## Referencia y arquitectura

- **Referencia**: [CLI `opadctl`](/es/docs/reference/opadctl/), [Referencia de la GUI](/es/docs/reference/gui/), [Ajustes del dispositivo](/es/docs/reference/device-settings/), [Pinout](/es/docs/reference/pinout/), [Protocolo serie](/es/docs/reference/serial-protocol/), [IPC del daemon](/es/docs/reference/ipc/), [Archivos y rutas](/es/docs/reference/files-and-paths/).
- **Explicaciones**: [Arquitectura del sistema](/es/docs/explanation/architecture/), [Ingeniería de latencia](/es/docs/explanation/latency/), [La pantalla táctil como tercer botón](/es/docs/explanation/touchscreen-third-button/), [Versiones de la app y del teclado](/es/docs/explanation/app-and-pad-versions/), [Contadores y propiedad](/es/docs/explanation/counters-and-ownership/), [Actualizaciones y reversión](/es/docs/explanation/updates-and-rollback/), [Hall Effect y Rapid Trigger](/es/docs/explanation/hall-effect/).

## Desarrollo de OPad

- [Centro de desarrollo](/es/docs/develop/) — flujo de contribución, compilación del firmware (ESP-IDF v5.5.2) y escritorio (Rust), pruebas, detalles internos de firmware y escritorio, cambios de protocolo, hardware, empaquetado, lanzamientos y pruebas de latencia.
- [Lista de verificación de pruebas](https://github.com/OPad-dev/OPad/blob/main/docs/es/testing-checklist.md) — matriz completa de verificación de hardware y software.
