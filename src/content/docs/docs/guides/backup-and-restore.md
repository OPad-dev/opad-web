---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/guides/backup-and-restore.md
lastUpdated: 2026-11-26T09:52:52+01:00
title: Backup and Restore
description: Export your OPad settings and lifetime counters to a JSON file, restore them with a preview first, and find the automatic backups the daemon writes after each session.
sidebar:
  order: 7
---

A backup is a JSON file with your pad's settings and lifetime key counters. Make one by hand with `opadctl` or the app, or use the ones the daemon writes by itself after every play session. Keep one somewhere safe: it is what brings your counts back if a pad is lost, replaced or erased.

## What you need

- The desktop app installed, with the daemon running. Restoring onto the pad also needs it connected.
- No map running. Backups are disabled during a map and its 5-second cooldown.

## What a backup contains

| Part | Contents |
|---|---|
| `device` | the pad's `device_id`, `board_profile` (`waveshare_esp32s3_touch_lcd_2`) and `counter_generation` |
| `stats` | `lifetime_key1`, `lifetime_key2`, and `lifetime_key3` on a three-key pad when its count is known |
| `config` | key codes (`key1`, `key2`, and on a three-key pad `key3` and `game_keys`), `debounce_us`, `brightness`, `display_sleep_seconds`, `gameplay_display_hz`, `key1_gpio`, `key2_gpio`, the four swipe actions with their keys, and `result_animations` |

Screen layouts are not in it: export those from the Designer (see [Customizing the screen layout](/docs/guides/customize-screen-layout/#export-and-import-a-layout)).

## Export a backup

**Terminal:**

```bash
opadctl export opad-backup.json
```

**App:**

1. Open the **Device** page.
2. In the **Backup & Restore** card, click **Export backup**.
3. Choose where to save the file.

## Restore a backup

Restoring always shows you what will change before it changes anything.

**Terminal:**

```bash
opadctl import opad-backup.json
```

`opadctl` first asks the daemon to check the file and prints a comparison: current against incoming counts (Key 1, Key 2, and Key 3 if present), whether the backup's `device_id` matches the connected pad, and a warning if any count would go down. Answer `y` to apply it. To skip the question in a script, add `--yes`: `opadctl import --yes opad-backup.json`.

**App:**

1. On the **Device** page, in **Backup & Restore**, click **Import backup** and choose the file.
2. Check the preview: current against incoming counts and whether the pad matches. If any count would go down, tick **I understand this replaces my counters with lower values**.
3. Click **Apply Backup**.

When you apply it, the daemon raises the counter generation so the restored counts win over older copies, saves everything to its database, and sends the settings and counts to the pad, which saves them once it is idle. Your local tosu address is kept. See [Recovery §5](/docs/recovery/#5-backup-restore-and-reset) for the exact rules.

## Automatic backups

You do not have to do anything for these:

- **When:** 20 seconds after a play session ends and the pad is idle again. Disk writes never happen during play. Starting another map within those 20 seconds cancels that backup; the next session makes a new one.
- **Where:** `~/.local/share/opad/backups/` on Linux (or `$XDG_DATA_HOME/opad/backups/`), `%APPDATA%\opad\backups\` on Windows, named `opad-backup-<YYYYMMDDTHHMMSSZ>.json`.
- **How many:** the 10 newest. Older ones are deleted; files with any other name in that folder are left alone.
- **Last one:** `Last Backup:` in `opadctl status`.

Restore one like any other backup.

> [!WARNING]
> Uninstalling the desktop app deletes this folder, automatic backups included. Copy a backup somewhere else first if you want to keep it. See [Uninstalling](/docs/guides/uninstall/).

## Check that it worked

- Run `opadctl status` and check the key counts and settings.
- In the app, the **Device** page's **Counter Reconciliation State** shows **✓ SYNCHRONIZED** when the PC and the pad agree.

## If it did not work

- **The buttons are greyed out, or the daemon refuses:** leave the map and wait 5 seconds for the cooldown to end. A pending "this pad belongs to another install" or "new pad" question also blocks restoring until you answer it.
- **The file is rejected:** a valid backup has `"format_version": 1`, `"board_profile": "waveshare_esp32s3_touch_lcd_2"`, settings within their ranges, and an `exported_at` no more than a day in the future.
