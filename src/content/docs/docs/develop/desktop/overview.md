---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/develop/desktop/overview.md
lastUpdated: 2026-11-26T09:52:52+01:00
title: Desktop Suite Overview
description: Architecture of the Rust desktop workspace, its three processes, how they talk to each other and to the pad, and the boundaries between its nine library crates.
sidebar:
  order: 1
---

The OPad desktop suite is a Rust (edition 2021) Cargo workspace, version `1.0.0-rc.6` ([/desktop/Cargo.toml](https://github.com/OPad-dev/OPad/blob/main/desktop/Cargo.toml)): three binaries (`opad-daemon`, `opad-gui`, `opadctl`) and nine library crates, for Linux (X11 and Wayland) and Windows 10/11. It is optional: the pad is a plain keyboard without it ([/AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §1.2). Building it: [Building from Source](/docs/develop/building/); tests: [Testing](/docs/develop/testing/).

## Process Model

<pre class="mermaid">
flowchart LR
    GUI["opad-gui&lt;br/&gt;iced window + tray"] &lt;--&gt;|"IPC: length-prefixed JSON&lt;br/&gt;Unix socket / named pipe"| D["opad-daemon&lt;br/&gt;tokio"]
    CLI["opadctl&lt;br/&gt;clap CLI"] &lt;--&gt;|IPC| D
    D &lt;--&gt;|"USB CDC-ACM&lt;br/&gt;protobuf frames"| PAD["Pad (ESP32-S3)"]
    D &lt;--&gt;|"WebSocket v2 + precise"| TOSU["tosu&lt;br/&gt;(child process)"]
    TOSU -.-&gt;|reads memory| OSU["osu!"]
    D --- DB[("opad.db&lt;br/&gt;SQLite")]
    CLI -.-&gt;|"flash / recover / bootloader:&lt;br/&gt;serial + espflash, after the daemon&lt;br/&gt;releases the port"| PAD
</pre>

1. **`opad-daemon`** ([/desktop/daemon/src/main.rs](https://github.com/OPad-dev/OPad/blob/main/desktop/daemon/src/main.rs)): the only process that holds the pad's serial port in normal use. Runs the ordered device actor, supervises `tosu`, persists to SQLite, checks for updates, and serves IPC. Details: [Daemon](/docs/develop/desktop/daemon/).
2. **`opad-gui`** ([/desktop/gui/src/main.rs](https://github.com/OPad-dev/OPad/blob/main/desktop/gui/src/main.rs)): the window and tray applet (`--tray`, `--page <name>`). Starts the daemon if it is not running. Details: [GUI](/docs/develop/desktop/gui/).
3. **`opadctl`** ([/desktop/cli/src/main.rs](https://github.com/OPad-dev/OPad/blob/main/desktop/cli/src/main.rs)): scripting and diagnostics over IPC; `flash`, `recover` and `bootloader` talk to the serial port directly. Details: [opadctl internals](/docs/develop/desktop/opadctl/).

The GUI and `opadctl` ship with the daemon and must match its version exactly: the IPC handshake checks `IPC_PROTOCOL_VERSION` and the package version ([/desktop/daemon/src/ipc_handlers.rs](https://github.com/OPad-dev/OPad/blob/main/desktop/daemon/src/ipc_handlers.rs)). The pad, by contrast, updates independently, so the serial protocol negotiates instead ([App and Pad Versions](/docs/explanation/app-and-pad-versions/)).

## Workspace Crates (`desktop/crates/`)

Dependencies point downward: `opad-model` depends on none of the others.

| Crate | Role |
|---|---|
| [`opad-model`](/docs/develop/desktop/crates/#1-opad-model) | Domain types (`DeviceInfo`, `DeviceConfig`, `CounterState`, `JsonBackup`), paths, swipe actions, tap-rate maths, board-test grading, result animations |
| [`opad-protocol`](/docs/develop/desktop/crates/#2-opad-protocol) | Protobuf types built at compile time with `protox` / `prost` (no `protoc`), legacy / marked / checked framing, CRC-16/CCITT-FALSE |
| [`opad-ipc`](/docs/develop/desktop/crates/#3-opad-ipc) | Request and response types, `u32` length-prefixed JSON over a Unix socket or Windows named pipe |
| [`opad-storage`](/docs/develop/desktop/crates/#4-opad-storage) | SQLite (WAL, schema v19), the gameplay write guard (`StorageError::WritesBlocked`), counter reconciliation |
| [`opad-device`](/docs/develop/desktop/crates/#5-opad-device) | Serial discovery, handshake and framing negotiation, the command channel, `espflash`-based flashing and recovery |
| [`opad-layout`](/docs/develop/desktop/crates/#6-opad-layout) | 320×240 layout validation and packing to the firmware's `ui_layout_t` |
| [`opad-ui-preview`](/docs/develop/desktop/crates/#7-opad-ui-preview) | The firmware's `ui/core` and LVGL compiled for the host, so the Screen Designer previews exactly what the pad draws |
| [`opad-tosu`](/docs/develop/desktop/crates/#8-opad-tosu) | `tosu` child-process supervisor and WebSocket client, Linux Yama `ptrace` checks |
| [`opad-update`](/docs/develop/desktop/crates/#9-opad-update) | Signed update feed (minisign Ed25519 + SHA-256), install-origin policy, atomic file swaps, `opad-feed` and `opad-update-helper` binaries |

Where each process keeps its files: [Files and Paths](/docs/reference/files-and-paths/).
