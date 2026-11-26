---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/index.md
lastUpdated: 2026-11-23T00:32:11+01:00
title: OPad Documentation
description: Overview of OPad, the low-latency ESP32-S3 osu! keypad and desktop suite, with starting points for users and developers.
sidebar:
  order: 1
---

OPad is a low-latency 1000 Hz USB HID osu! keypad built on the Waveshare ESP32-S3-Touch-LCD-2, paired with an optional Rust desktop suite (`opad-daemon`, `opad-gui`, `opadctl`) for Linux and Windows 10/11.

The keypad works out of the box as a driverless USB keyboard with no software installed. Adding the optional desktop suite enables live osu! gameplay telemetry via `tosu`, a visual screen layout designer, lifetime key counters, touchscreen swipe actions, Hall Effect switch calibration and rapid trigger tuning, and hands-free USB firmware updates.

## Start Here (Using OPad)

- [What You Need](/docs/start/what-you-need/) — Waveshare board, mechanical or Hall Effect switches, OPad V3 PCBs, and OS requirements.
- [Wiring the Keys](/docs/start/wiring-the-keys/) — hand-wiring switches to Header P2 or assembling the V3 carrier and modules.
- [First Connection](/docs/start/first-connection/) — plugging in the pad and verifying 1000 Hz USB HID typing without software.
- [Installing the Desktop Suite](/docs/start/install-the-app/) — Linux packages (`.deb`, `.rpm`, Arch, AppImage) and the Windows installer.

## Common Tasks

- [Updating Firmware](/docs/guides/update-firmware/) — updating over USB from `opad-gui` or `opadctl` with automatic A/B rollback protection.
- [Touchscreen & Swipes](/docs/guides/touchscreen-and-swipes/) — Quick Retry in maps and configurable swipe actions outside maps.
- [Customizing the Screen Layout](/docs/guides/customize-screen-layout/) — designing, previewing, exporting, and importing custom `Idle` and `Playing` layouts in Screen Designer.
- [Calibrating Hall Effect Switches](/docs/guides/calibrate-hall-effect/) — guided 5-press calibration and actuation / rapid trigger tuning.
- [Changing Key Pins](/docs/guides/change-key-pins/) — rebinding hand-wired switch GPIOs and using **Auto-Detect**.
- [Using OPad with tosu](/docs/guides/use-with-tosu/) — live osu! telemetry setup and Linux `ptrace` configuration.
- [Backup and Restore](/docs/guides/backup-and-restore/) — exporting and importing configuration and lifetime key counters.
- [Recovery, Reflashing & Unbinding](/docs/recovery/) — recovering an unresponsive pad without BOOT/RESET buttons, counter reconciliation, and unbinding.
- [Troubleshooting](/docs/troubleshooting/) — non-QWERTY layouts, Linux Yama `ptrace_scope`, `udev` rules, Windows SmartScreen, and recovery.
- [Uninstalling OPad](/docs/guides/uninstall/) — removing the desktop suite cleanly on Linux and Windows.

## Reference & Architecture

- **Reference**: [`opadctl` CLI](/docs/reference/opadctl/), [GUI Reference](/docs/reference/gui/), [Device Settings](/docs/reference/device-settings/), [Pinout](/docs/reference/pinout/), [Serial Protocol](/docs/reference/serial-protocol/), [Daemon IPC](/docs/reference/ipc/), [Files & Paths](/docs/reference/files-and-paths/).
- **Explanations**: [System Architecture](/docs/explanation/architecture/), [Latency Engineering](/docs/explanation/latency/), [Touchscreen as Third Button](/docs/explanation/touchscreen-third-button/), [App & Pad Versions](/docs/explanation/app-and-pad-versions/), [Counters & Ownership](/docs/explanation/counters-and-ownership/), [Updates & Rollback](/docs/explanation/updates-and-rollback/), [Hall Effect & Rapid Trigger](/docs/explanation/hall-effect/).

## Developing OPad

- [Developer Hub](/docs/develop/) — contributor workflow, building firmware (ESP-IDF v5.5.2) and desktop (Rust), running tests, firmware and desktop internals, protocol changes, hardware, packaging, releases, and latency testing.
- [Testing Checklist](https://github.com/OPad-dev/OPad/blob/main/docs/testing-checklist.md) — full hardware and software verification matrix.
