---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/index.md
lastUpdated: 2026-11-26T23:14:24+01:00
title: OPad Documentation
description: OPad is a low-latency osu! keypad on the Waveshare ESP32-S3-Touch-LCD-2, with optional desktop software for Linux and Windows 10/11.
sidebar:
  order: 1
---

OPad is a three-key osu! keypad built on the Waveshare ESP32-S3-Touch-LCD-2. It is a 1000 Hz USB keyboard: osu! plays with two keys, the third is there for your play style, and the touchscreen is a fourth button.

You do not need any software to play: plug the pad in and it types like any keyboard, on Linux and Windows 10/11, with no driver. The optional desktop app (`opad-daemon`, `opad-gui` and `opadctl`) adds the extras:

- live osu! map and play data on the pad's screen, through the bundled tosu;
- a designer for the pad's idle and in-map screens;
- lifetime key counters kept on the pad and on your PC;
- touchscreen swipe actions;
- Hall Effect calibration and rapid trigger;
- firmware updates over USB.

## Get started

1. [What you need](/docs/start/what-you-need/): your OPad, a USB-C data cable and a supported OS.
2. [First connection](/docs/start/first-connection/): plug the pad in and check that it types.
3. [Installing the desktop app](/docs/start/install-the-app/): Linux packages, AppImage and the Windows installer.

## Build your own

- [Parts and boards](/docs/build/parts/): the Waveshare board, switches or V3 PCBs, cables and case.
- [Wiring the keys](/docs/build/wiring-the-keys/): hand-wire two switches, or assemble the V3 carrier and module.

## Common tasks

- [Update the firmware](/docs/guides/update-firmware/)
- [Use the touchscreen and swipes](/docs/guides/touchscreen-and-swipes/)
- [Customize the screen layout](/docs/guides/customize-screen-layout/)
- [Calibrate Hall Effect switches](/docs/guides/calibrate-hall-effect/)
- [Change the key pins](/docs/guides/change-key-pins/)
- [Use OPad with tosu](/docs/guides/use-with-tosu/)
- [Back up and restore](/docs/guides/backup-and-restore/)
- [Uninstall the software](/docs/guides/uninstall/)

## When something goes wrong

- [Troubleshooting](/docs/troubleshooting/): keyboard layouts, tosu on Linux, USB permissions, Windows warnings.
- [Counters, recovery and unbinding](/docs/recovery/): how counters are reconciled, reflashing, and bringing back a pad that does not show up. No BOOT or RESET button is ever needed.

## Reference and background

- **Reference:** [`opadctl`](/docs/reference/opadctl/), [GUI](/docs/reference/gui/), [device settings](/docs/reference/device-settings/), [pinout](/docs/reference/pinout/), [serial protocol](/docs/reference/serial-protocol/), [daemon IPC](/docs/reference/ipc/), [files and paths](/docs/reference/files-and-paths/).
- **How it works:** [architecture](/docs/explanation/architecture/), [latency](/docs/explanation/latency/), [the touchscreen as a fourth button](/docs/explanation/touchscreen-button/), [app and pad versions](/docs/explanation/app-and-pad-versions/), [counters and ownership](/docs/explanation/counters-and-ownership/), [updates and rollback](/docs/explanation/updates-and-rollback/), [Hall Effect and rapid trigger](/docs/explanation/hall-effect/).
- **Contributing:** the [developer hub](/docs/develop/) covers building, testing, internals, packaging and releases. The [testing checklist](https://github.com/OPad-dev/OPad/blob/main/docs/testing-checklist.md) lists every hardware and software check.
