---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/reference/device-settings.md
lastUpdated: 2026-11-26T09:52:52+01:00
title: Device Settings Reference
description: Every setting the OPad firmware stores, with its wire field, type, valid range, default and NVS record.
sidebar:
  order: 3
---

The pad keeps its settings in NVS and reports them in every `HelloAck` and `ConfigAck` as a `ConfigPayload` (see [Serial Protocol Reference](/docs/reference/serial-protocol/)). The desktop app edits them with `SetConfig`.

A change applies to RAM at once. The NVS write happens only in `IDLE`: during `PLAYING` and `COOLDOWN` the record is marked dirty and written once the pad is idle again, so no flash write ever stalls a key press.

## NVS records

All settings live in the `opad_cfg` namespace. Firmware up to `1.0.0-rc` used `osupad_cfg`; at boot the firmware copies the old namespace into the new one once and never changes the old one, so a rolled-back firmware still finds its data.

| Key | C type | Holds |
|---|---|---|
| `cfg` | `device_config_data_t`, packed, `version` = `7` | Keys 1 and 2, debounce, display, key pins, owner ID, swipes |
| `cfg_ext` | `device_config_ext_t`, packed, `version` = `1` | Key 3's HID usage and the game keys |
| `he_cfg` | `he_config_record_t` | Hall Effect settings of keys 1 and 2 |
| `he_cfg3` | `he_config_record_t` | Hall Effect settings of key 3 (in `keys[0]`, copied to `keys[1]`) |

The `cfg` blob never grows past v7: settings added later go into `cfg_ext` or a record of their own, so firmware rolled back to an older version can still read `cfg`. Older `cfg` blobs (v1 to v6) are recognised by their length and load with defaults for the missing fields.

> [!NOTE]
> On the wire, `0` means "keep current" for every `ConfigPayload` field except `brightness`, `display_sleep_seconds` and the swipe modifiers, which are always applied as sent. `key3_hid_usage` and `game_keys` are `optional`: absent means keep current.

## Keys, debounce and display (`cfg`)

| Setting | Wire field | Range | Default |
|---|---|---|---|
| Key 1 HID usage | `key1_hid_usage` | `0x04`–`0xE7` | `0x1D` (`Z`) |
| Key 2 HID usage | `key2_hid_usage` | `0x04`–`0xE7` | `0x1B` (`X`) |
| Key 1 GPIO | `key1_gpio` | A pin from [Allowed key pins](#allowed-key-pins) | `14` (header P2 pin 11) |
| Key 2 GPIO | `key2_gpio` | A pin from [Allowed key pins](#allowed-key-pins), not Key 1's | `9` (header P2 pin 12) |
| Debounce lockout | `debounce_us` | `500`–`20000` µs | `5000` µs |
| Brightness | `brightness` | `0`–`100` % | `100` % |
| Display sleep | `display_sleep_seconds` | `0` (never) or `10`–`86400` s | `600` s |
| Gameplay refresh cap | `gameplay_display_hz` | `0` or `1`–`60` Hz on the pad; the app accepts `1`–`30` | `10` Hz |

All fields are `uint32_t` in the blob. The pad only stores and reports `gameplay_display_hz`; the daemon reads it to cap how often it sends screen data during a map.

The app's own sliders cover less than the pad accepts: brightness `10`–`100` %, display sleep `60`–`3600` s, refresh cap `1`–`30` Hz (see [GUI Reference](/docs/reference/gui/)).

When the pad boots with an MX input module and both key pins still at the hand-wired defaults (`14`, `9`), it moves them to the carrier's pins (`10`, `7`) and saves that. Pins someone chose are left alone.

The blob also holds the 16-byte owner ID (`owner_id`, all zero = unclaimed), written by `ClaimOwnership` and only in `IDLE`.

### Allowed key pins

A hand-wired key can use one of the 14 GPIOs in `KEY_GPIO_ALLOWED`:

`2`, `4`, `6`, `7`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `18`, `21`

Left out on purpose: `19`/`20` (USB D-/D+), `43`/`44` (UART0 console), `47`/`48` (touch and IMU I2C), `17` (`CAM_PWDN`, 10 kΩ pull-down) and `8` (module-ID ADC). A firmware built with `CONFIG_OPAD_BENCH_DEBUG_GPIO` also refuses that debug pin. Header positions are on the [Pinout Reference](/docs/reference/pinout/).

## Key 3 and game keys (`cfg_ext`)

| Setting | Wire field | C type | Range | Default |
|---|---|---|---|---|
| Key 3 HID usage | `key3_hid_usage` | `uint8_t` | `0` (sends nothing) or `0x04`–`0xE7` | `0x06` (`C`) |
| Game keys | `game_keys` | `uint8_t` | `1`–`6`: one or two of keys 1–3 | `0x03` (keys 1 and 2) |

`game_keys` is a bitmask, bit 0 = key 1, bit 1 = key 2, bit 2 = key 3. Only the game keys' presses count toward the total, the tap rate and map stats, and only they are sent as `KeyPress` events. Every key still keeps its own lifetime counter. `0` and `0x07` (all three) are refused: osu!standard plays with two keys.

## Touchscreen swipes (`cfg`)

| Direction | Action field | Key field | Modifiers field | Default action |
|---|---|---|---|---|
| Up | `swipe_up_action` | `swipe_up_key` | `swipe_up_modifiers` | `7` Volume up |
| Down | `swipe_down_action` | `swipe_down_key` | `swipe_down_modifiers` | `8` Volume down |
| Left | `swipe_left_action` | `swipe_left_key` | `swipe_left_modifiers` | `2` Previous track |
| Right | `swipe_right_action` | `swipe_right_key` | `swipe_right_modifiers` | `3` Next track |

| `SwipeAction` | Value | Effect |
|---|---|---|
| `SWIPE_ACTION_KEEP` | `0` | Wire only: keep the current action. Never stored. |
| `SWIPE_ACTION_NONE` | `1` | Nothing |
| `SWIPE_ACTION_PREV_TRACK` | `2` | Previous track |
| `SWIPE_ACTION_NEXT_TRACK` | `3` | Next track |
| `SWIPE_ACTION_PLAY_PAUSE` | `4` | Play / pause |
| `SWIPE_ACTION_MUTE` | `5` | Mute |
| `SWIPE_ACTION_KEY` | `6` | The direction's keyboard key, with its modifiers |
| `SWIPE_ACTION_VOLUME_UP` | `7` | Volume up: osu!'s while osu! is active, else the system's |
| `SWIPE_ACTION_VOLUME_DOWN` | `8` | Volume down, the same way |

- A key field is a HID usage in `0x04`–`0xE7`, or `0`. It must be non-zero when the action is `SWIPE_ACTION_KEY`.
- Modifiers are the HID modifier byte: `0x01` Ctrl, `0x02` Shift, `0x04` Alt, `0x08` GUI. They are stored in `swipe_mods[4]` in the order up, down, left, right.
- During a map (`PLAYING`) a `SWIPE_ACTION_KEY` swipe sends nothing, so a swipe never puts a key or modifier into the keyboard report mid-map.

## Hall Effect keys (`he_cfg`, `he_cfg3`)

Each record is a packed `he_config_record_t`: magic `0x48454346` (`"HECF"`), `version` `1`, `flags`, two `he_key_config_record_t`, and a CRC-32 (IEEE 802.3, polynomial `0xEDB88320`). Bit *k* of `flags` is key *k*'s `no_floor`; firmware that predates it ignores the field. A record that fails its magic, version, CRC or range check loads as factory defaults.

Depths and distances are in 0.1 % of the key's calibrated magnetic span: `1000` (`HE_PCT_FULL`) is a normal full press. That is a share of the magnetic signal, not of physical travel.

| Setting | Wire field (`HeKeySettings`) | Stored range | Default |
|---|---|---|---|
| Actuation point | `actuation` | `0`–`1000` | `500` (50.0 %) |
| Release hysteresis | `release_hyst` | `0`–`1000` | `100` (10.0 %) |
| Top reset | `top_reset` | `0`–`1000` | `100` (10.0 %) |
| Rapid trigger press | `rt_press` | `0`–`1000` | `150` (15.0 %) |
| Rapid trigger release | `rt_release` | `0`–`1000` | `150` (15.0 %) |
| Bottom dead zone | `bottom_dead_zone` (`optional`) | `0`–`1000`, `0` = off | `0` (off) |
| Rapid trigger mode | `rt_mode` | `HeRtMode` | Off |
| Allow below the noise floor | `allow_below_noise_floor` (`optional`) | `bool` | `false` |

The five travel fields are `uint16_t` in the record; on the wire `0` means keep current, so the app sends `1`–`1000`. The defaults are provisional (`docs/specs/v2-hall-effect-decisions.md` D4).

| `HeRtMode` | Value | Stored as | Behaviour |
|---|---|---|---|
| `HE_RT_MODE_KEEP` | `0` | — | Wire only: keep the current mode |
| `HE_RT_MODE_OFF` | `1` | `rapid_trigger = 0`, `continuous = 0` | Fixed actuation and release hysteresis |
| `HE_RT_MODE_NORMAL` | `2` | `rapid_trigger = 1`, `continuous = 0` | Rapid trigger below the actuation point |
| `HE_RT_MODE_CONTINUOUS` | `3` | `rapid_trigger = 1`, `continuous = 1` | Rapid trigger up to the top reset depth |

### Noise floors

When the pad turns settings into raw thresholds (`he_params_build`), it holds every movement threshold (hysteresis, rapid trigger press and release) and the release clearance above rest at or above noise floors in raw counts. Where a setting maps below a floor, the floor is used and a `HE_PARAMS_*_RAISED` bit says so. The pad reports its floors in `HeCalibrationStatus` (`noise_floor_rest`, `noise_floor_movement`) so the app can show the real press point. `allow_below_noise_floor` drops a key's floors to 1 count, and the sensor's own noise can then press that key. Rapid trigger stays off until the key has a valid calibration.
