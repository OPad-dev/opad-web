---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/guides/use-with-tosu.md
lastUpdated: 2026-11-23T00:32:11+01:00
title: Using with tosu
description: How OPad integrates with tosu for live osu! beatmap telemetry, Linux ptrace setup, custom tosu binaries, and status verification.
sidebar:
  order: 6
---

OPad bundles `tosu` (v4.26.2, LGPL-3.0) to read live game state from `osu!` / `osu!lazer` and stream beatmap metadata, accuracy, PP, combo, unstable rate (UR), and tap rate to the pad's LCD display.

## What you need

- The OPad desktop suite installed (`opad-daemon` running) and your OPad connected over USB.
- `osu!` (stable or `osu!lazer`) running on Linux or Windows 10/11.

## How tosu Integration Works

1. **Automatic supervision**: When `opad-daemon` starts, its `tosu` supervisor checks if anything is already listening on `127.0.0.1:24050`. If not, it launches `tosu` automatically (searching `$OPAD_TOSU_PATH`, `~/.local/opt/tosu/tosu`, `tosu` on `$PATH`, and finally the bundled copy last—so a user-installed `tosu` always wins). It restarts `tosu` with exponential backoff (5 s up to 60 s) if it exits, and disables `tosu`'s own self-updater and auto-opened browser dashboard.
2. **WebSocket connection**: `opad-daemon` connects to `ws://127.0.0.1:24050/websocket/v2` for beatmap and gameplay state, and to `/websocket/v2/precise` for osu!'s K1/K2 key-down counters. (Stored legacy `/ws` URLs are normalized to `/websocket/v2`.)
3. **Rate-limited USB updates**: `DataSync` sends only changed values to the pad, throttled to the configured **GAMEPLAY REFRESH RATE** (1–30 Hz, default 10 Hz, set in **Settings** -> **🖥 Display & Game**) while playing and 2 Hz (`500 ms`) while idle.
4. **Touchscreen awareness**: While `tosu` is connected, the pad knows when you are inside a map (`Playing`) vs in menus, enabling Quick Retry during maps and swipe actions outside maps. Without `tosu`, every touch acts as Quick Retry.

## Linux Setup (`ptrace` Permissions)

Under Linux Yama (`/proc/sys/kernel/yama/ptrace_scope > 0`), unprivileged processes cannot inspect the memory of unrelated processes like `osu!`:

- **`.deb` and `.rpm` packages**: The package post-install script automatically runs `setcap cap_sys_ptrace=eip /usr/lib/opad/tosu/tosu`, so `tosu` works out of the box without lowering system-wide `ptrace_scope`.
- **AppImage and Arch (`PKGBUILD`)**: File capabilities do not work on AppImage (`nosuid` FUSE mount) and are not set on Arch's system `node` binary. On those installs, lower `ptrace_scope` to `0` (see [Troubleshooting §2](/docs/troubleshooting/)):
  ```bash
  echo 0 | sudo tee /proc/sys/kernel/yama/ptrace_scope
  ```
  To make it persistent across reboots, set `kernel.yama.ptrace_scope = 0` in `/etc/sysctl.d/10-ptrace.conf` and run `sudo sysctl --system`.

Run `opadctl setup` to check your exact `ptrace_scope` and capability status.

## Windows Setup

On Windows 10 and 11, `tosu.exe` works out of the box once `opad-daemon` is running and `osu!` is open. If telemetry never appears, check whether antivirus software quarantined `%LOCALAPPDATA%\Programs\opad\tosu\tosu.exe` (see [Troubleshooting §4](/docs/troubleshooting/)).

## Using Your Own `tosu` Binary

Under LGPL-3.0 you can replace the bundled `tosu` at any time:
- In `opad-gui`: open **Settings** -> **ℹ About & tosu** and click **Browse external tosu...** (click **Use bundled** to revert).
- Or set the `OPAD_TOSU_PATH` environment variable to your `tosu` executable path, or run your own `tosu` on port `24050` before starting `opad-daemon`.

## How to check

1. In `opad-gui`, open **Settings** -> **ℹ About & tosu** and confirm **Status:** shows **Connected (streaming telemetry)** (and check **Binary source:**).
2. Or run `opadctl status` and confirm `tosu (osu!)` is connected.
3. Start a beatmap in `osu!`: the pad LCD switches to the playing layout with live map stats.

## What to do if it did not work

- **Linux `tosu` connects but shows empty stats**: Run `opadctl setup` or open **Diagnostics** in `opad-gui` and follow the Yama `ptrace_scope` instructions in [Troubleshooting §2](/docs/troubleshooting/).
- **Check `tosu` logs**: Run `opadctl monitor --source tosu` or inspect `<state_dir>/tosu.log`.
