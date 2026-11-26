---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/guides/touchscreen-and-swipes.md
lastUpdated: 2026-11-23T00:32:11+01:00
title: Using the Touchscreen and Swipes
description: How to use the touchscreen third button for in-game Quick Retry and configure directional swipe actions for volume control, media, and shortcuts.
sidebar:
  order: 2
---

OPad's 2.0-inch capacitive touchscreen acts as **the third button** (AGENTS.md §1.4). During an osu! map, a resting finger sends Quick Retry (`` ` ``) while swipes never trigger Quick Retry; outside a map, taps do nothing and directional swipes run configurable actions. Without a host or without `tosu`, every touch is Quick Retry.

## What you need

- Your OPad connected to your PC. For context-aware swipes (in-map vs. menu detection and osu! volume targeting), `opad-daemon` and `tosu` must be running; without them, every touch sends Quick Retry and swipes are off.
- `opad-gui` installed if you want to customize swipe actions.

## In-Game Behavior: Quick Retry

While playing an osu! map (`TOUCH_MODE_PLAY`):

- **Resting Finger**: Place and hold your finger on the touchscreen. The pad watches movement for 60 ms (`PLAY_RETRY_STILL_US`); if the finger stays within 12 pixels (`PLAY_RETRY_STILL_PX`), or stays down for 250 ms (`PLAY_SWIPE_WINDOW_US`) without becoming a swipe, the pad holds Quick Retry (`` ` ``) until you lift your finger. A brief tap that lifts without swiping also sends a Quick Retry press-and-release.
- **Swipe Protection**: Starting a swipe cancels Quick Retry for that touch so swiping to adjust volume or skip a track never restarts your map.
- **No Mid-Map Keyboard Modifiers or Overlays**: During a map, keyboard-key swipes (`osu!` shortcuts and `Other key`) are not sent, volume swipes never press Alt, and no swipe overlay is drawn on the pad's LCD.

## Out-of-Game Behavior: Directional Swipes

Outside a map (`TOUCH_MODE_MENU`), taps send nothing and directional swipes trigger the configured actions:

| Swipe Direction | Default Action | Behavior |
|---|---|---|
| **Swipe Up** (`↑ SWIPE UP`) | `Volume up` | Steps osu! volume when osu! is active (foreground window on Windows, or osu!lazer running on Linux); steps system volume otherwise. Repeats every 30 pixels along a long drag. |
| **Swipe Down** (`↓ SWIPE DOWN`) | `Volume down` | Steps osu! volume when osu! is active; steps system volume otherwise. Repeats every 30 pixels along a long drag. |
| **Swipe Left** (`← SWIPE LEFT`) | `Previous track` | Sends USB HID Consumer Control Previous Track once per swipe. |
| **Swipe Right** (`SWIPE RIGHT →`) | `Next track` | Sends USB HID Consumer Control Next Track once per swipe. |

A swipe requires moving at least **30 pixels** (`GESTURE_SWIPE_PX = 30`) with one axis leading by at least a 1.5:1 ratio (`2 * |dy| >= 3 * |dx|` for vertical, `2 * |dx| >= 3 * |dy|` for horizontal).

> [!NOTE]
> On an uncalibrated Hall Effect pad, the touchscreen is locked to the on-screen calibration button, swipes are off, and no keys are sent until calibration finishes.

## Configuring Custom Swipe Actions

Swipe actions are configured in `opad-gui`:

1. Connect your OPad, open `opad-gui`, select **Settings** in the sidebar, and make sure the **⌨ Keypad** tab is selected.
2. Scroll to the **Touchscreen swipes** card. Each direction has its own dropdown: **↑ SWIPE UP**, **↓ SWIPE DOWN**, **← SWIPE LEFT**, and **SWIPE RIGHT →**.
3. Choose an action from the dropdown:
   - **Media / Volume / Off**: `Nothing`, `Volume up`, `Volume down`, `Previous track`, `Next track`, `Play / pause`, `Mute`.
   - **Named osu! shortcuts**: Built-in osu! and osu!lazer shortcuts (such as `osu!: Random beatmap (F2)`, `osu!: Mod select (F1)`, `osu!: Chat (F8)`, `osu!: Social / extended chat (F9)`, `osu!: Settings (Ctrl+O)`, `osu!: Screenshot (F12)`, and on Windows also `osu! stable: Boss key (hide osu!) (Insert)` and `osu! stable: Reload skin (Ctrl+Alt+Shift+S)`).
   - **`Other key (F13-F24)…`**: Reveals a second dropdown (`Choose a key`) listing free function keys that do not clash with osu! or system shortcuts — **F14–F19 on Linux** (skipping F13, F20–F23, and F24) and **F13–F23 on Windows** (skipping F24, which the pad reserves for Windows Alt-menu suppression).
4. Click **Save settings**. The daemon saves the configuration and sends `SetConfig` to the pad.

## How to check it worked

Run `opadctl status` and check the `Swipes:` line, which prints the configured action for all four directions (`up`, `down`, `left`, `right`). Then swipe on the pad outside a map and verify the feedback badge on the LCD and the action on your PC.

## What to do if it did not work

- If every touch acts as Quick Retry and swipes do not run, check that `opad-daemon` and `tosu` are connected (`opadctl status` shows `tosu (osu!): Active`). See [Using with tosu](/docs/guides/use-with-tosu/) and [Troubleshooting](/docs/troubleshooting/).
- If volume swipes change system volume instead of osu! volume, verify osu! is the foreground window (Windows) or osu!lazer is running (Linux).
