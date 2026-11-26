---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/develop/building.md
lastUpdated: 2026-11-23T00:32:10+01:00
title: Building from Source
description: How to build the OPad Rust desktop suite and ESP-IDF v5.5.2 ESP32-S3 firmware from source on Linux and Windows.
sidebar:
  order: 2
---

This guide covers building the Rust desktop workspace ([/desktop/Cargo.toml](https://github.com/OPad-dev/OPad/blob/main/desktop/Cargo.toml)) and the ESP32-S3 firmware ([/firmware/CMakeLists.txt](https://github.com/OPad-dev/OPad/blob/main/firmware/CMakeLists.txt)) from source.

## Prerequisites

### Desktop Suite (Rust)
- **Rust**: Stable Rust toolchain (edition 2021) via [rustup](https://rustup.rs) ([/desktop/Cargo.toml](https://github.com/OPad-dev/OPad/blob/main/desktop/Cargo.toml)).
- **Linux (Ubuntu / Debian)** ([/README.md](https://github.com/OPad-dev/OPad/blob/main/README.md)):
  ```bash
  sudo apt update
  sudo apt install -y build-essential pkg-config libasound2-dev libudev-dev \
      libx11-dev libxkbcommon-dev libwayland-dev libfontconfig1-dev libdbus-1-dev
  ```
- **Windows**: Visual Studio MSVC C++ Build Tools; Inno Setup 6 is optional (only needed to build `opad-setup.exe` from [/packaging/windows/installer.iss](https://github.com/OPad-dev/OPad/blob/main/packaging/windows/installer.iss)).

### Firmware (ESP-IDF v5.5.2)
- **ESP-IDF v5.5.2** (pinned version in [/AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §4 and [/.github/workflows/ci.yml](https://github.com/OPad-dev/OPad/blob/main/.github/workflows/ci.yml)).

## Building the Desktop Suite

```bash
cd desktop
cargo build --release
```
Or from the repository root using [/Makefile](https://github.com/OPad-dev/OPad/blob/main/Makefile):
```bash
make all
```
Release binaries are placed in `desktop/target/release/`:
- `opad-daemon`
- `opad-gui`
- `opadctl`

Optional auxiliary targets in [/Makefile](https://github.com/OPad-dev/OPad/blob/main/Makefile):
- `make espflash` downloads the pinned, SHA-256-verified `espflash` **4.6.0**.
- `make tosu` builds the pinned `tosu` **v4.26.2** (portable glibc 2.28 build by default; set `TOSU_PORTABLE=0` or `TOSU_STANDALONE=0` to customize).
- `make check` runs `cargo fmt --check`, `cargo clippy --all-targets -D warnings`, `cargo test --workspace`, and `firmware/test/host/run_tests.sh`.

## Building the Firmware

1. Source ESP-IDF v5.5.2:
   ```bash
   . $HOME/esp/esp-idf/export.sh
   ```
2. Configure target and build:
   ```bash
   cd firmware
   idf.py set-target esp32s3
   idf.py build
   ```

> [!IMPORTANT]
> After editing [/firmware/sdkconfig.defaults](https://github.com/OPad-dev/OPad/blob/main/firmware/sdkconfig.defaults), delete `firmware/sdkconfig` before rebuilding ([/AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §5). `idf.py fullclean` keeps the old `sdkconfig`, so edits silently have no effect.

Key outputs in `firmware/build/`:
- `bootloader/bootloader.bin`
- `partition_table/partition-table.bin`
- `ota_data_initial.bin`
- `opad-firmware.bin`

## Flashing Built Firmware

Update the inactive OTA slot with automatic rollback protection:
```bash
opadctl flash firmware/build/opad-firmware.bin
```
For a full flash (bootloader, partition table, OTA data, and app):
```bash
opadctl flash --full firmware/build
```
Never commit `build/`, `target/`, `dist/`, `firmware/sdkconfig`, `firmware/managed_components/`, or `.tools/` ([/AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §5).
