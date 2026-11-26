---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/guides/use-with-tosu.md
lastUpdated: 2026-11-26T09:52:52+01:00
title: Using OPad with tosu
description: How OPad uses tosu for live osu! data on the pad's screen, what to set up on Linux, how to use your own tosu, and how to check that it works.
sidebar:
  order: 6
---

[tosu](https://github.com/tosuapp/tosu) reads osu!'s memory and serves the current map and play over a local WebSocket. OPad bundles tosu v4.26.2 (LGPL-3.0) and uses it to:

- show map and play data on the pad's screen (title, stars, accuracy, PP, combo, UR, hit counts and more; see [Customizing the screen layout](/docs/guides/customize-screen-layout/));
- switch the pad to its **Playing** screen during a map;
- tell the touchscreen when you are in a map, so a resting finger is Quick Retry there and swipes work outside it (see [Touchscreen and swipes](/docs/guides/touchscreen-and-swipes/)).

Your keys never depend on tosu: the pad types the same with or without it.

## What you need

- The OPad desktop app installed, with the pad connected.
- osu! (stable or lazer) running.

There is nothing to start by hand: the daemon runs tosu for you.

## How it works

1. **The daemon starts tosu.** If nothing is listening on tosu's port (`127.0.0.1:24050`) yet, the daemon starts tosu, and restarts it if it exits (after 5 seconds, doubling up to 60). It turns off tosu's own self-updater and its habit of opening a browser dashboard. If you already run a tosu yourself, the daemon uses that one.
2. **The daemon reads tosu's data** from `ws://127.0.0.1:24050/websocket/v2`, and osu!'s own key counts from `/websocket/v2/precise`.
3. **The daemon sends the pad only what changed.** During a map it sends at the **GAMEPLAY REFRESH RATE** (1–30 Hz, default 10 Hz, in **Settings** → **🖥 Display & Game**), and outside a map twice a second.

The daemon looks for tosu in this order, and uses the first one it finds:

1. the file in the `OPAD_TOSU_PATH` environment variable;
2. `~/.local/opt/tosu/tosu` (`tosu.exe` on Windows);
3. `tosu` on your `PATH`;
4. the bundled copy.

So a tosu you installed yourself always wins over the bundled one.

## Linux: let tosu read osu!

On Linux, the Yama setting `ptrace_scope` stops one program reading another's memory whenever it is above 0, so tosu needs permission.

- **`.deb`, `.rpm` and the Arch release package** give the bundled tosu the `cap_sys_ptrace` capability when they install. Nothing to do.
- **The AppImage and the Arch package built from source** cannot carry that capability. There you lower `ptrace_scope` to 0 instead.

To see which case applies to you, run:

```bash
opadctl setup
```

It prints your `ptrace_scope` and the exact command that fixes it. [Troubleshooting §2](/docs/troubleshooting/#2-linux-tosu-cannot-read-osu-yama-ptrace_scope) explains both fixes.

## Windows

tosu works with no setup. If live data never shows up, check that your antivirus has not quarantined `%LOCALAPPDATA%\Programs\opad\tosu\tosu.exe`; see [Troubleshooting §4](/docs/troubleshooting/#4-windows-smartscreen-and-antivirus).

## Use your own tosu

tosu is LGPL-3.0, so you may replace the bundled copy with your own build. Pick the way that suits you:

- **Run your own tosu first.** When something already listens on port 24050, the daemon starts none and reads from yours.
- **Install it in `~/.local/opt/tosu/` or put it on your `PATH`.** The daemon prefers it over the bundled copy.
- **Set `OPAD_TOSU_PATH`** to your tosu executable in the daemon's environment.
- **In the app:** **Settings** → **ℹ About & tosu** → **Browse external tosu...** (and **Use bundled** to go back). The app remembers the file and uses it when it starts tosu or the daemon itself. A daemon that starts at login (systemd, or the Windows Run entry) does not see this choice; use one of the ways above for it.

## Check that it works

1. Run `opadctl status` and look for `tosu (osu!):      Active`.
2. Or open **Settings** → **ℹ About & tosu** in the app: **Status** should say **Connected (streaming telemetry)**, and **Binary source** says which tosu is in use.
3. Start a map in osu!. The pad switches to its Playing screen with live data.

## If it did not work

- **Linux: tosu is connected, but the pad shows no map data:** tosu cannot read osu!'s memory. Run `opadctl setup` and follow [Troubleshooting §2](/docs/troubleshooting/#2-linux-tosu-cannot-read-osu-yama-ptrace_scope).
- **tosu does not start, or keeps restarting:** read its log with `opadctl monitor --source tosu`, or open `tosu.log` (in `~/.local/state/opad/` on Linux, `%APPDATA%\opad\` on Windows).
