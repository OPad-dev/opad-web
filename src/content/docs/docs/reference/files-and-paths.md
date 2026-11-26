---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/reference/files-and-paths.md
lastUpdated: 2026-11-23T00:32:11+01:00
title: Files and Paths Reference
description: Filesystem locations, SQLite database schema, log files, private tool paths, and install identity used by the OPad desktop suite on Linux and Windows.
sidebar:
  order: 7
---

The OPad desktop suite resolves all persistent paths, logs, and private bundled binaries through `desktop/crates/opad-model/src/paths.rs`. Because login-launched daemons inherit unpredictable working directories (such as `C:\Windows\System32` on Windows), OPad never falls back to relative paths.

## Filesystem Locations by Platform

| Component | Linux Location | Windows Location | Purpose |
|---|---|---|---|
| **Data Directory** | `$XDG_DATA_HOME/opad` (fallback `~/.local/share/opad`) | `%APPDATA%\opad` | Persistent user data (`opad.db`, automatic backups). |
| **State Directory** | `$XDG_STATE_HOME/opad` (fallback `~/.local/state/opad`) | `%APPDATA%\opad` | Disposable runtime logs. |
| **Database File** | `<data_dir>/opad.db` | `<data_dir>\opad.db` | Primary SQLite database (WAL mode). |
| **Automatic Backups** | `<data_dir>/backups/` | `<data_dir>\backups\` | Rolling automatic `JsonBackup` files (newest 10 kept). |
| **Daemon Log** | `<state_dir>/daemon.log` | `<state_dir>\daemon.log` | Output of a daemon launched by the GUI. |
| **tosu Log** | `<state_dir>/tosu.log` | `<state_dir>\tosu.log` | Output of the supervised `tosu` process. |
| **IPC Endpoint** | `$XDG_RUNTIME_DIR/opad/daemon.sock` (fallbacks `/run/user/<uid>/opad/daemon.sock`, `/tmp/opad-<uid>/daemon.sock`) | `\\.\pipe\opad-ipc-<SID>` | Local daemon IPC socket / named pipe. |
| **Private Lib Directory** | `<install_prefix>/lib/opad` | `<install_dir>` (`%LOCALAPPDATA%\Programs\opad`) | Bundled `tosu`, pinned `espflash`, and `install-origin`. |
| **Bundled tosu Binary** | `<install_lib_dir>/tosu/tosu` | `<install_lib_dir>\tosu\tosu.exe` | Bundled osu! memory reader. |
| **Install Origin** | `<install_lib_dir>/install-origin` | `<install_lib_dir>\install-origin` | Packaging channel marker (`windows`, `deb`, `rpm`, `aur`, `appimage`, `user`, `source`). |

### Linux Path Resolution

- **Data & state directories** follow XDG (`$XDG_DATA_HOME/opad` / `$XDG_STATE_HOME/opad`, defaulting to `~/.local/share/opad` and `~/.local/state/opad`).
- **Install prefix** is derived from the running executable's grandparent directory (for example, `/usr/bin/opad-daemon` -> prefix `/usr` -> `/usr/lib/opad`; `~/.local/bin/opad-daemon` -> `~/.local/lib/opad`).

### Windows Path Resolution

- Windows has no separate XDG state directory, so both persistent data (`opad.db`, `backups\`) and logs (`daemon.log`, `tosu.log`) live under `%APPDATA%\opad`.
- The Inno Setup installer installs per-user (`PrivilegesRequired=lowest`) into `%LOCALAPPDATA%\Programs\opad`, placing binaries, `espflash.exe`, `install-origin`, and `tosu\tosu.exe` together in that directory.

## SQLite Database (`opad.db`)

`opad.db` opens in Write-Ahead Logging mode (`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;`) and tracks migrations in `schema_migrations` (currently schema v19).

### Core Tables

- **`app_state`**: Key-value host metadata (`key`, `value`, `updated_at`), storing `install.id`, `tap_stats.history_days`, and updater settings/schedules.
- **`device_state`**: Per-pad rows keyed by canonical `device_id` (`OPAD-<MAC>`), storing `board_profile`, `firmware_version`, `counter_generation`, `lifetime_key1`, `lifetime_key2`, `lifetime_key3`, `last_seen_at`, and `last_sync_at`.
- **`config`**: Singleton row (`id = 1`) caching `DeviceConfig` (keycodes, GPIO pins, debounce, brightness, sleep, gameplay refresh Hz, `tosu_endpoint`, swipe actions/keys/modifiers, `result_animations`, `key3_hid_usage`, `game_keys`).
- **`layouts`**: Custom screen layout JSON keyed by `screen` (`Idle` / `Playing`).
- **Tap statistics tables** (`apply_v10` / `apply_v11`): Recorded gameplay attempt tap rates and history.

### Write Guard

All SQLite mutations check `writes_allowed` and return `StorageError::WritesBlocked` during `Playing` and `Cooldown`; pending writes flush once the daemon returns to `Idle`.

## Install Identity (`install.id`)

On first run, `opad-daemon` generates a UUIDv4 stored under `install.id` in `app_state`:

- **Per-installation scope**: Uninstalling OPad deletes the desktop data directory (`%APPDATA%\opad` on Windows, `~/.local/share/opad` on Linux package uninstall), so reinstalling creates a new `install.id`.
- **Pad ownership**: Its 16-byte binary form (`OWNER_ID_LEN = 16`) is written to the pad via `ClaimOwnership`.
- **Degraded mode**: If `opad.db` cannot be opened, the daemon runs without an identity and skips claiming pads or updating PC counters instead of crashing.
