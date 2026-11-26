# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Astro + Starlight (chosen earlier in this repo; the user delegated the rest). Static site, built locally for now; it will move to GitHub later. The documentation is not written here: it is synced from the OPad repository (`docs/`, branch `docs/overhaul`, local worktree `~/Documents/OPad-docs`).

## Users
- **osu! players who don't have a pad yet.** The site has to make them want one: what it is, why it is different, what it looks like in use.
- **People who want to build one now.** Comfortable wiring two switches to a dev board, or assembling the V3 PCBs. They need the parts list and the wiring guide.
- **People who already own one.** They come for the desktop app download, firmware updates and the documentation.

## Product Purpose
OPad is a three-key osu! keypad built on the Waveshare ESP32-S3-Touch-LCD-2 (osu! plays with two keys; the third is there for play style). It is a plain 1000 Hz USB HID keyboard that works with nothing installed, on Linux and Windows 10/11. Its 2" touchscreen is a fourth button (Quick Retry during a map, swipes for volume and tracks outside one) and, with the optional desktop app and tosu, shows live play data (PP, accuracy, combo, KPS…) in layouts the user designs.

Success for the site: a visitor understands what OPad is in one screen, players want one, builders reach the build guide, owners reach the download and docs.

## Positioning
- **Sell to players, not engineers.** It is a three-key osu! keypad (Z, X, C) with a touchscreen that shows your play live. The landing speaks in what the player sees and gets: live PP/accuracy/combo, touch to retry, plug and play, magnetic switches with Rapid Trigger, every press counted. No internals (cores, USB endpoints, debounce, polling, latency engineering): that depth lives in the docs.
- **A keyboard first.** It types with no driver and no software. The app only adds features.
- **The screen is part of the instrument**: live gameplay stats on the pad, a designer for the Idle and Playing screens, and a touch Quick Retry.
- **Can't be bricked by an update**: two firmware slots, automatic rollback, no BOOT or RESET button ever.
- **Every key comes from a finger**: no macros, auto-tap or host-injected keys, not even as an option.
- Open source: software GPL-3.0-or-later, hardware CERN-OHL-S-2.0.

## Operating Context
Competitive osu! / osu!lazer on a desk next to the keyboard and tablet/mouse. tosu observes the game and feeds the daemon over WebSocket. Desktop app: `opad-daemon`, `opad-gui` (Rust/iced) and `opadctl`. Builds: hand-wired MX switches, or the OPad V3 carrier with MX or Hall Effect modules (calibration + Rapid Trigger), three keys on V3.

## Capabilities and Constraints
- **Availability:** nobody can buy an OPad today. A **Kickstarter is planned**, with no date, price or link yet. Until then the only way to get one is to build it from the open-source files. Never show a price, date, backer count or a Kickstarter link that does not exist.
- Downloads: GitHub Releases (`https://github.com/OPad-dev/OPad/releases`): Windows installer, .deb, .rpm, Arch package, AppImage.
- Repository: `https://github.com/OPad-dev/OPad`.
- Firmware screen is 320×240 (ST7789). Default Idle and Playing layouts live in `firmware/main/ui/core/ui_defaults.c` and are the source of truth for any depiction of the screen.

## Brand Commitments
- The site uses **the app's colors** (user requirement): `desktop/gui/src/theme.rs`. Background #0E0E16, surface #13131E, card #1B1B28, card hover #24243A, border #2A2A3C, pink #FF66AA (hover #FF85BD), white, muted #8C8CA6, green #44DD88, red #FF5566, off #3A3A4C, cyan #66CCFF, yellow #FFCC33.
- The app's typeface is **Montserrat** (Medium and Bold).
- The logo in `docs/assets/` is explicitly a placeholder (violet keycap with an "O" ring); it is not a binding brand asset.
- Voice of the docs: plain, exact, technical, never hype.

## Evidence on Hand
- Documentation (EN + ES): `~/Documents/OPad-docs/docs`.
- CAD renders of the case and PCB renders: `hardware/3d/custom_case/*`, `hardware/pcb/*/production/*.png` (CAD-style, white backgrounds).
- Never name hardware revisions (V1, V1.1, V3) on the landing. The boards and case are internally V3, but the finished product will be sold as OPad V1; revision names live only in the docs.
- No product photos, no measured latency figures published for marketing, no testimonials, no user counts. Do not fabricate any of them.

## Product Principles
1. Player benefits in plain words. Never explain how it works underneath on the landing; link the docs for that.
2. Show the real device: the screen depicted is the firmware's own layout.
3. Honest availability: build it today, Kickstarter later, no invented dates or prices.
4. A keyboard first, software optional.

## Accessibility & Inclusion
WCAG 2.2 AA. Reduced motion respected. Bilingual site: English at `/`, Spanish at `/es/`.
