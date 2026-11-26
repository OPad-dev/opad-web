---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/develop/index.md
lastUpdated: 2026-11-26T23:14:24+01:00
title: Guía para desarrolladores
description: Por dónde empezar a cambiar OPad - la estructura del repositorio, las reglas que respeta todo cambio, el flujo de contribución y un mapa de las páginas para desarrolladores.
sidebar:
  order: 1
---

Esta sección es para quienes cambian OPad: el firmware, la suite de escritorio, el protocolo entre ambos, los archivos de hardware y la maquinaria de publicación. Las reglas vinculantes están en [AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md), que se aplica por igual a contribuidores humanos y de IA; esta página las resume y remite a los detalles.

## Estructura del repositorio

| Ruta | Qué es |
|---|---|
| [`firmware/`](https://github.com/OPad-dev/OPad/tree/main/firmware) | Proyecto ESP-IDF v5.5.2 para el ESP32-S3; `main/` contiene los subsistemas y `test/host/` las pruebas en C compiladas para el anfitrión |
| [`desktop/`](https://github.com/OPad-dev/OPad/tree/main/desktop) | Workspace de Rust: `daemon/` (`opad-daemon`), `gui/` (`opad-gui`), `cli/` (`opadctl`) y los `crates/` compartidos |
| [`protocol/`](https://github.com/OPad-dev/OPad/tree/main/protocol) | `opad.proto` y `opad.options`, el único esquema a partir del que se generan ambos lados |
| [`packaging/`](https://github.com/OPad-dev/OPad/tree/main/packaging) | Paquetes de Linux, AppImage, PKGBUILD de Arch y el script de Inno Setup para Windows |
| [`hardware/`](https://github.com/OPad-dev/OPad/tree/main/hardware) | PCB de KiCad (V1–V3), la carcasa en OpenSCAD y el comprobador de archivos de fabricación `opadverify` |
| [`scripts/`](https://github.com/OPad-dev/OPad/tree/main/scripts) | Generación de protobuf, trabajos de CI (`ci/`), el laboratorio de VM (`lab/`), herramientas de publicación (`release/`), benchmarks |
| [`docs/`](https://github.com/OPad-dev/OPad/tree/main/docs) | Esta documentación; `specs/` guarda los registros de diseño e `history/` las revisiones antiguas |

## Reglas que respeta todo cambio

Las seis reglas de producto de [AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §1, en resumen:

1. **La latencia siempre gana.** Nada entra en la ruta de pulsación. Un cambio en `firmware/main/input/` o `firmware/main/usb/` indica cómo afecta a la latencia y cómo se comprobó. Consulta [Ingeniería de latencia](/es/docs/explanation/latency/).
2. **El teclado es un teclado sin software instalado.** Escribir nunca depende del daemon, de la GUI ni de un controlador.
3. **La app y el teclado se actualizan por separado.** Todo cambio de protocolo funciona con app nueva y teclado antiguo, y con app antigua y teclado nuevo. Consulta [Versiones de la app y del teclado](/es/docs/explanation/app-and-pad-versions/) y [Cambios en el protocolo](/es/docs/develop/protocol-changes/).
4. **La pantalla táctil es el cuarto botón**, con pulsación, mantenimiento y liberación limpios, y sin teclas de más a mitad de mapa. Consulta [La pantalla táctil como cuarto botón](/es/docs/explanation/touchscreen-button/).
5. **Nunca los botones BOOT ni RESET.** El flasheo y la recuperación se hacen por USB. Consulta [Actualizaciones y reversión automática](/es/docs/explanation/updates-and-rollback/).
6. **Cada tecla sale de un dedo.** Ni macros, ni auto-tap, ni entrada temporizada, ni inyección de teclas del anfitrión al teclado, ni siquiera como opción.

[AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §5 enumera las reglas fáciles de romper: los archivos protobuf generados, la trampa de `sdkconfig`, las versiones fijadas (espflash 4.6.0, tosu v4.26.2, LVGL tal como está bloqueada), las licencias REUSE y lo que nunca se commitea.

## Contribuir

- **Ramas.** Los contribuidores externos hacen un fork, crean una rama y abren un pull request contra `main`; el mantenedor trabaja en un worktree y hace fast-forward de `main`. El historial se mantiene lineal (rebase, sin commits de merge), y una rama se borra en cuanto se fusiona.
- **Commits.** Conventional commits, `type(scope): subject`, con el asunto como una afirmación llana del comportamiento y la issue o el hallazgo de revisión en él (`(#14)`). Firma con tu propio nombre. El uso de IA se declara con un trailer, `AI: assisted` o `AI: generated`, en lugar de líneas de atribución de la herramienta. Los cambios de protocolo o de IPC añaden un trailer `Compatibility:`.
- **Licencias.** Los archivos nuevos necesitan información de licencia, en una cabecera o en [REUSE.toml](https://github.com/OPad-dev/OPad/blob/main/REUSE.toml).
- **Pruebas.** Ejecuta `make check` antes de dar un cambio por terminado, y di claramente qué no se pudo probar (por ejemplo, sin teclado conectado). Consulta [Pruebas](/es/docs/develop/testing/).

## Adónde ir después

| Para... | Lee |
|---|---|
| Compilar el firmware y la suite de escritorio | [Compilar desde el código fuente](/es/docs/develop/building/) |
| Ejecutar las comprobaciones de CI, en local o en el laboratorio | [Pruebas](/es/docs/develop/testing/) |
| Orientarte en el firmware | [Subsistemas del firmware](/es/docs/develop/firmware/overview/) |
| Orientarte en la suite de escritorio | [Arquitectura de escritorio](/es/docs/develop/desktop/overview/) |
| Añadir un campo o un mensaje al protocolo | [Cambios en el protocolo](/es/docs/develop/protocol-changes/) |
| Trabajar en las PCB, los cables o la carcasa | [Hardware](/es/docs/develop/hardware/) |
| Cambiar un paquete o un instalador | [Empaquetado](/es/docs/develop/packaging/) |
| Entender cómo se construye y se distribuye una versión | [Canalizaciones de publicación](/es/docs/develop/releases/) |
| Usar el laboratorio de VM | [Laboratorio de pruebas](/es/docs/develop/lab/) |
| Medir la latencia de las teclas | [Medición de latencia](/es/docs/develop/latency-testing/) |

## Reglas de la documentación

De [AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §7: el código y `git log` mandan, y un documento que los contradice está mal y se corrige o se elimina. Cada afirmación factual cita el archivo fuente del que sale (consulta las convenciones en [docs/README.md](https://github.com/OPad-dev/OPad/blob/main/docs/README.md)). Nada de páginas de relleno; las revisiones e instantáneas antiguas van a `docs/history/`.
