---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/start/what-you-need.md
lastUpdated: 2026-11-26T23:14:24+01:00
title: What You Need
description: An OPad, a USB-C data cable and a Linux or Windows 10/11 computer. The desktop app is optional.
sidebar:
  order: 1
---

- **Your OPad.** It comes assembled, with three keys (mechanical or Hall Effect, depending on the version you chose; osu! plays with two, and the third is there for your play style), plus a touchscreen you can tap for Quick Retry during a map.
- **A USB-C data cable.** One comes with the pad. If you use another, make sure it carries data: a charge-only cable powers the pad, but your PC never sees it as a keyboard.
- **A computer with Linux or Windows 10/11 (x64).** The pad uses the drivers your system already has (`usbhid` and `cdc_acm` on Linux, `hidclass.sys` and `usbser.sys` on Windows), so you never install a driver.

The desktop app is optional. Without it the pad is still a complete 1000 Hz keyboard, and its touchscreen sends Quick Retry. [Installing the desktop app](/docs/start/install-the-app/) lists what the app adds and which Linux distributions its packages are built for.

Building your own pad from a Waveshare board instead? Start with [Parts and boards](/docs/build/parts/).

## Next

Plug the pad in: [First connection](/docs/start/first-connection/).
