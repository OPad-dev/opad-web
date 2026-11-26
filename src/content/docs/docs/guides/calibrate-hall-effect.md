---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/guides/calibrate-hall-effect.md
lastUpdated: 2026-11-23T00:32:11+01:00
title: Calibrating Hall Effect Switches
description: How to calibrate magnetic switches on OPad (on the pad or in opad-gui) and tune actuation and rapid trigger settings.
sidebar:
  order: 4
---

Hall Effect magnetic switches measure the magnetic field of a magnet inside each switch stem instead of a metal contact leaf. Calibration records each key's resting reading and normal full-press reading so the pad knows its magnetic travel span. Under decision record D7, an uncalibrated Hall Effect pad is locked to its calibration screen: no keys are sent, touchscreen swipes are disabled, and touch only operates the calibration button until calibration completes.

## What you need

- An OPad with a Hall Effect module installed (V1 2-key or V3 3-key).
- A flat, steady desk so the switches do not move during rest capture.
- Optionally, the OPad desktop app (`opad-gui` and `opad-daemon`) for guided calibration and actuation/rapid-trigger tuning. Calibration also works directly on the pad without the app.

## Calibrating with the OPad app (recommended)

When an uncalibrated Hall Effect pad connects to a PC running `opad-daemon`, the pad screen shows **Keys not calibrated** / **Calibrate in the OPad app** / **on your PC**, and the daemon can open `opad-gui` on the **Hall Effect Calibration** page.

To recalibrate an already-calibrated pad, open `opad-gui` and click **Keys** -> **Recalibrate**, or **Settings** -> **⌨ Keypad** -> **Recalibrate Keys**. Calibration only starts while no map is playing (`IDLE` state) and no finger is touching the pad screen.

1. On the **Hall Effect Calibration** page in `opad-gui`, take your fingers off all keys and click **Start Calibration**.
2. **Step 1: Measuring Rest Position**: Keep your fingers off every key and do not touch the pad. The firmware waits 16 ms to settle (`REST_SETTLE_SAMPLES = 64` at 4 kHz), then averages 64 samples (another 16 ms) to record each key's resting level and verify it is steady and in range.
3. **Step 2: Press Key 1 (5 Times)**: Press Key 1 firmly all the way to the bottom and let it come fully back up, 5 times slowly. Each completed press fills one of the 5 numbered boxes on both `opad-gui` and the pad display. There is no walk-away timeout — take your time.
4. **Step 3: Press Key 2 (5 Times)**: Repeat 5 full, consistent presses and full releases on Key 2.
5. **Step 4: Press Key 3 (5 Times)** (V3 3-key Hall Effect module only): Repeat 5 full presses and releases on Key 3.
6. Once the last key's 5th press completes, the pad validates the span and peak consistency (using the median of the 5 peaks as the full-press reading) and writes the calibration record to NVS (`opad_cal` on V1, `opad_cal3` on V3). The pad displays **Done!** / **Your keys are ready** for 1 second and immediately unlocks the keys.

Click **Cancel** in `opad-gui` at any time during capture to abort; a recalibration restores the previous saved calibration, while an uncalibrated pad stays locked.

## Calibrating directly on the pad (no app)

If no capable OPad app is connected, the pad waits 5 seconds after boot (**Looking for the OPad app...**), then displays **For the best setup, get the app:** along with a **Calibrate here** button on the touchscreen.

1. Tap **Calibrate here** on the touchscreen and immediately take your hands off the keys.
2. When **Calibrating** / **Take your fingers off both keys** (or **Take your fingers off all keys** on V3) finishes, follow the on-screen prompts: **Press key 1 all the way, 5 times** (**Let it come fully up each time**), then Key 2 (and Key 3 on V3). Five boxes (`1`–`5`) turn green as each press is accepted.
3. When all keys pass validation, the pad shows **Done!** / **Your keys are ready** for 1 second and switches to normal operation.

## Tuning actuation and rapid trigger in opad-gui

After calibration, open `opad-gui` and click **Keys** in the sidebar. All depth and sensitivity sliders use a percentage of each key's calibrated magnetic span (never fixed millimeters, per decision record D3), adjusted in `0.5 %` steps (`step(5)` in `0.1 %` units).

1. **Link or split keys**: By default, edits apply to all keys together (**Both keys** or **All keys**). Toggle **Set keys separately** at the top to configure Key 1, Key 2 (and Key 3 on V3) independently. Switching it off copies Key 1's settings to the other keys.
2. **Basic controls**:
   - **ACTUATION POINT**: How deep the key must move before pressing (up to `95.0 %`; the lower bound is raised automatically to clear the sensor noise floor unless overridden in **Advanced**).
   - **Rapid trigger**: Toggle on to re-press as soon as the key moves back down and release as soon as it moves up.
   - **SENSITIVITY** (shown when **Rapid trigger** is on and **Advanced** is hidden): Sets both press and release movement distance together (`1.0 %`–`50.0 %`).
   - **Continuous** (shown when **Rapid trigger** is on): Keeps rapid trigger active all the way up until the key rises above the top reset point.
3. **Advanced controls**: Click **Advanced** (toggles to **Hide advanced**) to expose:
   - **PRESS SENSITIVITY** (`1.0 %`–`50.0 %`) and **RELEASE SENSITIVITY** (`1.0 %`–`50.0 %`) separately when **Rapid trigger** is on.
   - **RELEASE POINT** (`1.0 %`–`50.0 %`): Hysteresis above the actuation point used when **Rapid trigger** is off.
   - **TOP RESET** (`1.0 %`–`50.0 %`, shown when **Continuous** is on): Depth above which continuous rapid trigger resets.
   - **BOTTOM DEAD ZONE** (`0.0 %`–`30.0 %`, `0 = off`): Ignores extra movement close to full bottom-out so pressing harder into the housing does not shift the peak.
   - **Allow below the noise floor** (when supported by firmware): Uses settings down to `1.0 %` without raising them to the sensor noise floor; sensor noise may then trigger accidental presses.
4. **Live switch view**: Press each key and watch the live cut-away switch and travel gauge (`rest`, `press`, `release`/`reset`, `dead zone`, `full`). `opad-gui` polls `GetHeLive` at ~50 Hz and smooths the drawn stem for readability, snapping directly to the real depth on press/release; the pad itself decides presses on raw readings. The live view pauses while playing a map.
5. Click **Save to pad** to write the settings to the pad (or **Revert** to discard unsaved edits).

## How to check

- On the pad, the red **Keys not calibrated** lock screen is gone and normal key presses type your configured keys (`Z`, `X`, and `C` on 3-key V3).
- In `opad-gui` **Keys**, pressing each switch smoothly moves the cut-away stem from `0 %` (`rest`) to `100 %` (`full`) and toggles the status label between **Released** and **Pressed**.
- From a terminal, `opadctl status` shows every active Hall Effect key as calibrated with its `rest..full` raw ADC range.

## What to do if it did not work

If validation fails, the pad shows **Calibration failed** with the specific reason for 2 seconds (and a **Try again** button when running standalone, or **Try again in the OPad app** when connected to the app):

- **Keep both keys still while resting** (`HE_CAL_ERR_REST_NOT_STILL`): A key moved or vibrated during rest capture. Place the pad on a steady surface, keep fingers off all keys, and retry.
- **A key was pressed while resting** (`HE_CAL_ERR_REST_PRESSED`): A key was partially held during Step 1 and released higher during Step 2. Start again with all keys completely released.
- **Sensor reading looks wrong** (`HE_CAL_ERR_REST_OUT_OF_RANGE`) or **The key didn't register** (`HE_CAL_ERR_SIGNAL_NOT_RISING`): Check that magnetic (Hall Effect) switches are seated properly and, on V3, run `opadctl board-test --magnet` or **Diagnostics** -> **🔧 PCB Test** to check the cable and sensors.
- **Press each key all the way down** (`HE_CAL_ERR_SPAN_TOO_SMALL`) or **Press the same way every time** (`HE_CAL_ERR_PEAKS_INCONSISTENT`): Bottom out each switch fully and consistently on all 5 presses, letting the stem return completely to rest between presses.
- **Press exactly 5 times** (`HE_CAL_ERR_TOO_FEW_PEAKS` / `HE_CAL_ERR_TOO_MANY_PEAKS`): Make 5 clean, distinct full presses without double-bouncing mid-press.
- **The OPad app disconnected** or **Could not save calibration**: Reconnect the USB cable and retry while no map is running (`IDLE`).
