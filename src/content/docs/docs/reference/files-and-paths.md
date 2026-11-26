---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/reference/files-and-paths.md
lastUpdated: 2026-11-26T09:52:52+01:00
title: Files and Paths Reference
description: Where the OPad desktop suite keeps its database, backups, logs, IPC endpoint and bundled tools on Linux and Windows, and the SQLite schema.
sidebar:
  order: 7
---

Every path the desktop suite reads or writes is resolved in `desktop/crates/opad-model/src/paths.rs`. A daemon started at login inherits an unpredictable working directory (often `C:\Windows\System32` on Windows), so no path is ever relative: when a directory cannot be resolved, the call fails instead of guessing.

## Locations

| What | Linux | Windows |
|---|---|---|
| Data directory | `$XDG_DATA_HOME/opad`, else `~/.local/share/opad` | `%APPDATA%\opad` |
| State directory (logs) | `$XDG_STATE_HOME/opad`, else `~/.local/state/opad` | `%APPDATA%\opad` (no separate state directory) |
| Database | `<data>/opad.db` | `<data>\opad.db` |
| Automatic backups | `<data>/backups/`, newest 10 kept | `<data>\backups\` |
| Daemon log (a daemon the GUI started) | `<state>/daemon.log` | `<state>\daemon.log` |
| tosu log | `<state>/tosu.log` | `<state>\tosu.log` |
| IPC endpoint | `$XDG_RUNTIME_DIR/opad/daemon.sock` (fallbacks in [IPC Protocol Reference](/docs/reference/ipc/#transport)) | `\\.\pipe\opad-ipc-<SID>` |

## Installed files

The private install directory is found from the running executable, so one rule covers every prefix:

| What | Linux | Windows |
|---|---|---|
| Install prefix | The executable's grandparent (`/usr/bin/opad-daemon` → `/usr`, `~/.local/bin/opad-daemon` → `~/.local`) | The executable's directory, by default `%LOCALAPPDATA%\Programs\opad` (per-user install) |
| Private directory (`install_lib_dir`) | `<prefix>/lib/opad` | `<prefix>` |
| Bundled tosu | `<lib>/tosu/tosu` | `<prefix>\tosu\tosu.exe` |
| Install-origin marker | `<lib>/install-origin` | `<prefix>\install-origin` |
| Pinned `espflash` | `<prefix>/lib/opad/bin/espflash` (or next to the executable) | `<prefix>\espflash.exe` |

When no bundled `espflash` is found, the flasher tries `%USERPROFILE%\.cargo\bin\espflash.exe` on Windows, then `espflash` on `PATH`.

The `install-origin` marker names how OPad was installed, which decides how it updates: `windows`, `deb`, `rpm`, `aur`, `appimage`, `user` or `source`. Anything else reads as unknown.

## SQLite database (`opad.db`)

The database opens with `PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;`. Applied migrations are recorded in `schema_migrations (version, applied_at)`; the current schema is v19.

| Table | Key | Contents | Since |
|---|---|---|---|
| `device_state` | `device_id` (`OPAD-<MAC>`) | `board_profile`, `firmware_version`, `counter_generation`, `lifetime_key1`, `lifetime_key2`, `lifetime_key3` (NULL until a three-key pad synced), `last_seen_at`, `last_sync_at` | v1; key 3 v18 |
| `config` | `id` = `1` (single row) | The app's copy of the pad config: keys, debounce, brightness, display sleep, gameplay refresh rate, `tosu_endpoint`, `press_color_rgb`, key pins, swipe actions/keys/modifiers, `result_animations`, `key3_hid_usage`, `game_keys` | v1, columns added v2–v17 |
| `layouts` | `screen` (`0` = Idle, `1` = Playing) | `json`, `updated_at` | v3 |
| `app_state` | `key` | `value`, `updated_at` | v7 |
| `tap_attempts` | `id` | One row per finished attempt: times, beatmap, mods, title/artist/difficulty, per-channel (`k1`, `k2`, `combined`) press count, intervals, average and peak, song press count and length, song peak | v9; song v10, song peak v11 |

Migration v19 renamed pads stored as `OSUPAD-<MAC>` (firmware up to `1.0.0-rc`) to `OPAD-<MAC>`, keeping their counters.

### `app_state` keys

| Key | Holds |
|---|---|
| `install.id` | This install's identity (below) |
| `stats.history_days` | The statistics history period, `0` = all time |
| `update.app.enabled`, `update.tosu.enabled`, `update.firmware.auto` | Automatic-update switches; missing = on |
| `update.channel` | `stable` (default) or `beta` |
| `update.schedule`, `update.last_result` | The updater's check schedule and the last install's result |

### Write guard

The daemon turns storage writes off for a map and its cooldown: every write then returns `StorageError::WritesBlocked`. Data that must survive, such as finished tap attempts and a new history period, is kept in memory and saved once writes are allowed again.

## Install identity

On first run the daemon generates a UUIDv4 and stores it as `install.id`. Its 16 bytes are what a pad records as its owner (`ClaimOwnership`). It is per install, not per machine: uninstalling deletes the data directory (the Windows uninstaller, and the Linux packages' `uninstall-cleanup` for XDG default paths), so a reinstall gets a new identity. It protects counter integrity, not exclusivity; nothing about it is cryptographic.

If the database cannot be opened, the daemon runs without an identity: it claims no pads and shows no ownership prompts.
