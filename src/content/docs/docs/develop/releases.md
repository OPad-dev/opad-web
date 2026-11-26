---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/develop/releases.md
lastUpdated: 2026-11-24T22:19:20+01:00
title: Release Automation and Update Feeds
description: OPad release engineering using release-please, multi-platform artifact workflows, signed GitHub Pages update feeds, and opad-update security guardrails.
sidebar:
  order: 7
---

Because the desktop app, firmware, and bundled `tosu` update independently ([/AGENTS.md](https://github.com/OPad-dev/OPad/blob/main/AGENTS.md) §1.3), OPad runs decoupled release pipelines feeding a cryptographically signed update manifest.

## 1. Pipeline Overview

<pre class="mermaid">
flowchart TD
    Commit["Conventional Commit on main"] --&gt; RP["release-please.yml (Release PR &amp; Changelog)"]
    RP --&gt; Merge["Maintainer Merges Release PR"]
    Merge --&gt; Tag["Component Tag (vX.Y.Z or firmware-vX.Y.Z)"]
    Tag --&gt; AppBuild["release-app.yml (Linux zigbuild, Windows MSVC, Inno Setup)"]
    Tag --&gt; FWBuild["release-firmware.yml (ESP-IDF v5.5.2)"]
    AppBuild --&gt; Upload["publish_release.sh (assets)"]
    FWBuild --&gt; FWUpload["publish_release.sh (assets)"]
    Upload --&gt; StageFeed["update-feed.yml (deploy: false, signed artifact)"]
    StageFeed --&gt; Lab["lab-install.yml (feed: true, VMs update from feed)"]
    Lab --&gt; DeployFeed["feed-deploy (GitHub Pages: updates.opad.dev)"]
    FWUpload --&gt; FWFeed["update-feed.yml (sign &amp; deploy to updates.opad.dev)"]
</pre>

## 2. Release Management (`release-please`)

Configured in [/release-please-config.json](https://github.com/OPad-dev/OPad/blob/main/release-please-config.json) and [/.github/workflows/release-please.yml](https://github.com/OPad-dev/OPad/blob/main/.github/workflows/release-please.yml):

- **Two `release-please` packages**:
  1. **Desktop App (`.`, component `app`)**: Excludes `firmware` and `hardware`; updates `desktop/Cargo.toml` and produces tags `vX.Y.Z` (or `vX.Y.Z-rc.N` while `prerelease: true`).
  2. **Firmware (`firmware`, component `firmware`)**: Updates `firmware/CMakeLists.txt` and produces tags `firmware-vX.Y.Z`.
  (Bundled `tosu` is version-pinned separately in [/Makefile](https://github.com/OPad-dev/OPad/blob/main/Makefile) at `v4.26.2`.)
- **`Cargo.lock` sync**: `release-please.yml` runs a `lockfile` job executing `cargo update -w` whenever Release Please updates the app release PR so `--locked` builds remain valid.

## 3. Artifact Builders & Publication

- **Desktop ([/.github/workflows/release-app.yml](https://github.com/OPad-dev/OPad/blob/main/.github/workflows/release-app.yml))**: Compiles Linux x86_64 binaries via `cargo-zigbuild` (glibc 2.31), Windows x86_64 binaries via MSVC, and packages `.deb`, `.rpm`, AppImage, and `opad-setup.exe`.
- **Firmware ([/.github/workflows/release-firmware.yml](https://github.com/OPad-dev/OPad/blob/main/.github/workflows/release-firmware.yml))**: Compiles in `espressif/idf:v5.5.2`, publishing the OTA binary and full recovery artifacts.
- **Publication ([/scripts/release/publish_release.sh](https://github.com/OPad-dev/OPad/blob/main/scripts/release/publish_release.sh))**: Uploads the files to GitHub Releases and starts an app release's notes with which file to download ([/scripts/release/release_notes.sh](https://github.com/OPad-dev/OPad/blob/main/scripts/release/release_notes.sh)). There is no `SHA256SUMS`: GitHub shows each file's SHA-256. What only the lab and the AUR need (`FILES.sha256`, the `opad-bin` PKGBUILD and `.SRCINFO`) is the run's `release-extras-<tag>` artifact.

## 4. Signed Update Feeds (`opad-feed`)

[/.github/workflows/update-feed.yml](https://github.com/OPad-dev/OPad/blob/main/.github/workflows/update-feed.yml) runs `opad-feed` on every release, weekly cron, or manual dispatch to build and sign `stable.json` and `beta.json` for `https://updates.opad.dev/` (GitHub Pages), refreshing signatures before the 30-day feed expiry window. For app releases, [/.github/workflows/release-app.yml](https://github.com/OPad-dev/OPad/blob/main/.github/workflows/release-app.yml) first calls `update-feed.yml` with `deploy: false` (keeping the signed feeds as a `github-pages` artifact), runs [/.github/workflows/lab-install.yml](https://github.com/OPad-dev/OPad/blob/main/.github/workflows/lab-install.yml) with `feed: true` so the VMs upgrade from that signed feed, and only deploys the feed in `feed-deploy` (`actions/deploy-pages@v5`) once the lab passes.

## 5. Security Guardrails (`opad-update`)

Enforced in [/desktop/crates/opad-update/src/lib.rs](https://github.com/OPad-dev/OPad/blob/main/desktop/crates/opad-update/src/lib.rs), [/desktop/crates/opad-update/src/verify.rs](https://github.com/OPad-dev/OPad/blob/main/desktop/crates/opad-update/src/verify.rs), and [/desktop/crates/opad-update/src/origin.rs](https://github.com/OPad-dev/OPad/blob/main/desktop/crates/opad-update/src/origin.rs):

1. **Minisign (Ed25519) signature verification**: Signed feeds are checked against the compiled-in public key; missing or invalid signatures fail with `UpdateError::NoPublicKey` or `UpdateError::Signature`.
2. **SHA-256 hash-before-execute**: Every downloaded archive, installer, or firmware image is verified against the signed manifest's SHA-256 before execution or flashing.
3. **Atomic writes**: `write_atomic` writes to a temp file, `fsync`s, and atomically renames into place.
4. **Gameplay safety gate (`may_update_now`)**: Never applies app, `tosu`, or firmware updates during `Playing` or `Cooldown`.
5. **Install-origin policies**: `windows` runs the installer; `deb`/`rpm` delegate to `apt`/`dnf` via polkit (never swapping package-owned `tosu`); `appimage`/`user` replace user-owned files directly; `aur`/`source`/`unknown` notify only.
