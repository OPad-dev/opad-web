---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/es/index.astro","src/components/Landing.astro"]
---

# Landing: OPad (`/` and `/es/`)

Mode: Persuade. Visitors: osu! players who don't own a pad (want one), builders (build one now), owners (download the app, docs). Nobody can buy one yet; Kickstarter planned, no date/price/link. Proof = the device's own behaviour (firmware layouts, latency design), never invented numbers.

User decisions: app colours (theme.rs) and Montserrat are binding; the rest delegated. Bilingual EN `/`, ES `/es/`. Structure chosen by me from the dealt roll (user delegated; no decision page).

## Direction contract

THESIS: The page plays a map. It opens on the pad's Idle screen and, as the visitor scrolls, the same pad switches to its Playing screen, section by section, like a map from first note to results. It refuses the hardware-landing default of a product photo hero plus a grid of feature cards.

OWN-WORLD: The app itself: #0E0E16 ground, #13131E/#1B1B28 surfaces with #2A2A3C 1px borders, 14px card radius, 10px control radius; osu! pink #FF66AA is the one accent (primary action, the pressed key, live figures); cyan/yellow/green only where the firmware uses them (difficulty, stars, status dots). Montserrat Medium/Bold. Key cards that swap pink↔dark while held are the component signature. No glow, no gradients.

STORY: Understand: a two-key osu! keypad that is just a keyboard, with a touchscreen that shows live play data and works as a third button. Believe: latency always wins (eager debounce, one endpoint per key, nothing else on the path), can't be bricked, every key comes from a finger, open source. Do: build one today (What you need), download the app if you own one, follow the Kickstarter (coming).

FIRST VIEWPORT: Left ~45%: headline, one-line lede, primary "Build one" (pink) + secondary "Read the docs", quiet availability line (Kickstarter coming, nothing sold yet). Right ~55%: the pad drawn in code at large scale: dark case, 320×240 screen rendering the firmware's Idle layout, two keycaps. Hint: press Z and X; the key cards and counters react exactly as on the device. Header: wordmark, Docs, Download, GitHub, EN/ES.

FORM: Map-play narrative (scroll = map progress; the pad's screen switches Idle → Playing; sections are the map), position 7 of 7 on my ordered list (dealt lead). seed:d47652d47bd14748. Signature interaction: real Z/X (or tap) presses drive the drawn pad's key cards, counters and KPS. Motion grammar: key card colour swap instant (as firmware), screen switch crossfade, scroll-linked map progress bar.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
