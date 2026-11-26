---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/develop/index.md
lastUpdated: 2026-11-26T23:14:24+01:00
title: Developer Guide
description: Where to start when changing OPad - the repository layout, the rules every change keeps, the contribution workflow, and a map of the developer pages.
sidebar:
  order: 1
---

This section is for people changing OPad: the firmware, the desktop suite, the protocol between them, the hardware files, and the release machinery. The binding rules live in [AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md), which applies to human and AI contributors alike; this page summarises them and points to the details.

## Repository layout

| Path | What it is |
|---|---|
| [`firmware/`](https://github.com/OPad-dev/OPad/tree/main/firmware) | ESP-IDF v5.5.2 project for the ESP32-S3; `main/` holds the subsystems, `test/host/` the host-compiled C tests |
| [`desktop/`](https://github.com/OPad-dev/OPad/tree/main/desktop) | Rust workspace: `daemon/` (`opad-daemon`), `gui/` (`opad-gui`), `cli/` (`opadctl`) and the shared `crates/` |
| [`protocol/`](https://github.com/OPad-dev/OPad/tree/main/protocol) | `opad.proto` and `opad.options`, the one schema both sides are generated from |
| [`packaging/`](https://github.com/OPad-dev/OPad/tree/main/packaging) | Linux packages, AppImage, Arch PKGBUILDs and the Windows Inno Setup script |
| [`hardware/`](https://github.com/OPad-dev/OPad/tree/main/hardware) | KiCad PCBs (V1–V3), the OpenSCAD case, and the `opadverify` fab-file checker |
| [`scripts/`](https://github.com/OPad-dev/OPad/tree/main/scripts) | Protobuf generation, CI jobs (`ci/`), the VM lab (`lab/`), release tooling (`release/`), benchmarks |
| [`docs/`](https://github.com/OPad-dev/OPad/tree/main/docs) | This documentation; `specs/` holds design records, `history/` old reviews |

## Rules every change keeps

The six product rules of [AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §1, in short:

1. **Latency always wins.** Nothing joins the keypress path. A change to `firmware/main/input/` or `firmware/main/usb/` states how it affects latency and how that was checked. See [Latency Engineering](/docs/explanation/latency/).
2. **The pad is a keyboard with no software installed.** Typing never depends on the daemon, the GUI or a driver.
3. **The app and the pad update independently.** Every protocol change works new-app/old-pad and old-app/new-pad. See [App and Pad Versions](/docs/explanation/app-and-pad-versions/) and [Protocol Changes](/docs/develop/protocol-changes/).
4. **The touchscreen is the fourth button**, with a clean press, hold and release, and no extra keys mid-map. See [Touchscreen as the Fourth Button](/docs/explanation/touchscreen-button/).
5. **Never the BOOT or RESET buttons.** Flashing and recovery happen over USB. See [Updates and Automatic Rollback](/docs/explanation/updates-and-rollback/).
6. **Every key comes from a finger.** No macros, auto-tap, timed input or host-to-pad key injection, not even as an opt-in.

[AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §5 lists the rules that are easy to break: generated protobuf files, the `sdkconfig` trap, pinned versions (espflash 4.6.0, tosu v4.26.2, LVGL as locked), REUSE licensing, and what is never committed.

## Contributing

- **Branches.** Outside contributors fork, branch and open a pull request against `main`; the maintainer works in a worktree and fast-forwards `main`. History stays linear (rebase, no merge commits), and a branch is deleted once merged.
- **Commits.** Conventional commits, `type(scope): subject`, with the subject a plain statement of the behaviour and the issue or review finding in it (`(#14)`). Sign as yourself. AI use is disclosed with one trailer, `AI: assisted` or `AI: generated`, in place of tool attribution lines. Protocol or IPC changes add a `Compatibility:` trailer.
- **Licensing.** New files need licence information, in a header or in [REUSE.toml](https://github.com/OPad-dev/OPad/blob/main/REUSE.toml).
- **Testing.** Run `make check` before calling a change done, and say plainly what could not be tested (for example, no pad connected). See [Testing](/docs/develop/testing/).

## Where to go next

| To... | Read |
|---|---|
| Build the firmware and the desktop suite | [Building from Source](/docs/develop/building/) |
| Run the checks CI runs, locally or in the lab | [Testing](/docs/develop/testing/) |
| Find your way around the firmware | [Firmware Subsystems](/docs/develop/firmware/overview/) |
| Find your way around the desktop suite | [Desktop Architecture](/docs/develop/desktop/overview/) |
| Add a field or message to the protocol | [Protocol Changes](/docs/develop/protocol-changes/) |
| Work on the PCBs, cables or case | [Hardware](/docs/develop/hardware/) |
| Change a package or installer | [Packaging](/docs/develop/packaging/) |
| Understand how a release is built and shipped | [Release Pipelines](/docs/develop/releases/) |
| Use the VM lab | [Testing Lab](/docs/develop/lab/) |
| Measure key latency | [Latency Measurement](/docs/develop/latency-testing/) |

## Documentation rules

From [AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §7: the code and `git log` are authoritative, and a doc that disagrees with them is wrong and gets fixed or deleted. Every factual claim cites the source file it came from (see the conventions in [docs/README.md](https://github.com/OPad-dev/OPad/blob/main/docs/README.md)). No placeholder pages; old reviews and snapshots go to `docs/history/`.
