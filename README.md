<div align="center">

# 🎧 Melodex

### A High-Fidelity 3D Vinyl Turntable Music Player

*A richly-detailed, physically-simulated turntable rendered entirely in the browser.*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

</div>

---

## Overview

**Melodex** is a browser-based music player that recreates the experience of a physical vinyl turntable in interactive 3D. Built with **React**, **TypeScript**, and **Three.js**, it lets you load your own local audio library and play it through a turntable you can actually touch — drag the tonearm, flip the cueing lever, ride the pitch fader, monitor analog VU meters, tweak a 3-band parametric EQ, and hear authentic vinyl crackle, all simulated client-side with the Web Audio API.

No servers. No uploads. Fully client-side and privacy-first. If you don't have local audio on hand, use the built-in **procedural Lo-Fi Jazz demo vinyl** to start spinning right away!

---

## Table of Contents

- [Features](#features)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Build for Production](#build-for-production)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Browser Compatibility](#browser-compatibility)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Category | Details |
|---|---|
| 🎛️ **Interactive 3D Turntable** | Platter, S-curve tonearm, headshell, vinyl record with groove texture, cueing lever, pitch fader, and start/stop buttons |
| ⚡ **Multi-Range Pitch Fader** | Switch between **±8%**, **±16%**, and **±50% Ultra-Pitch** ranges with live platter strobe response |
| 🛑 **Motor Brake Mode** | Toggle between **Mechanical Inertia** (natural slow spin-down) and **Instant Electronic Brake** |
| 🎨 **Turntable Themes** | Switch between 4 custom finishes: **Classic Obsidian**, **Walnut Wood**, **Silver Technics**, and **Midnight Neon** |
| 💿 **Vinyl Wax Pressings** | Choose between 4 distinct wax formulas: **Classic Black**, **Translucent Amber**, **Deep Ruby Red**, and **Electric Cyan Neon** |
| 🔒 **Quartz Pitch Lock** | Technics SL-1200 style quartz lock instantly snaps playback pitch to exact 0.0% with green lock indicator |
| ⚖️ **Stereo Balance & Spatial Phono** | Continuous L/R balance with center-detent snap, plus **Mono Pressing Summing** for vintage mono pressings |
| 🛡️ **25Hz Subsonic Rumble Filter** | High-pass filter eliminating ultra-low turntable warp rumble and acoustic speaker feedback |
| 📖 **12" Gatefold Sleeve Inspector** | Full-screen interactive vinyl jacket with technical audio specs, custom cover art uploader, and artwork export |
| 📦 **Crate Export & Import** | Export your record collection and play history to portable `.json` crates, or restore previously saved vinyl crates |
| 🧹 **Crate Management** | Individual track ejection from the shelf and one-click crate clearing for fresh sessions |
| 📊 **Real-Time Visualizer** | Dual vintage analog stereo **VU meters** with peak LEDs and switchable **32-band real-time audio spectrum analyzer** |
| 🎚️ **3-Band Parametric EQ** | Web Audio Biquad filters for **Bass (100Hz)**, **Mid (1kHz)**, and **Treble (8kHz)** with curve response and acoustic presets |
| 🔥 **Analog Warmth & Drive** | Soft-clipping tube saturation (`WaveShaperNode`) and authentic Wow & Flutter pitch drift simulation |
| 🌙 **Turntable Sleep Timer** | Configurable sleep timer (15–60 min or End of Record) with authentic vinyl runout groove fade and tonearm auto-return |
| 🖼️ **ID3 Album Art & 3D Vinyl Label** | Client-side ID3v2/FLAC metadata parser rendering extracted album artwork directly on the spinning 3D vinyl record |
| ❤️ **Favorites & Play History** | Star favorite tracks, record listen counts (`Spun 4x`), and filter by **All**, **Favorites ❤️**, or **History 🕒** |
| 📍 **Interactive Groove Scrubber** | Micro-groove timeline scrubber with needle hover cues and physical record zones (Lead-in, Outer, Mid, Inner) |
| 🎷 **Procedural Vinyl Demos** | In-browser lo-fi jazz synthesis ("Midnight Groove" & "Analog Nostalgia") generates authentic WAV vinyl records on demand |
| 🖱️ **Tonearm Dragging** | Physically grab and reposition the headshell to cue any point in the song |
| 🪛 **Cueing Lever** | Click the 3D lever to drop or lift the stylus needle |
| 📥 **Drag & Drop Loading** | Drop audio files from your desktop directly onto the turntable window |
| ⌨️ **Keyboard Shortcut Suite** | Full physical deck control via `Space`, `Arrow` keys, `M`, `C`, `3/4`, `S`, `R`, `E`, and `?` |
| 📻 **Vinyl Crackle** | Atmospheric surface noise via the Web Audio API, fully adjustable |
| ⚙️ **Motor Inertia** | Platter realistically accelerates and decelerates; pitch drops naturally as the motor slows |
| 📂 **Local Folder Loading** | Native `showDirectoryPicker` API with a `webkitdirectory` fallback for all browsers |
| 🔍 **Searchable Shelf** | Filter your loaded library by title, artist, or album in real time |
| 💾 **Settings Persistence** | Saves your preferred theme, volume, crackle level, speed, EQ profile, and analog FX in `localStorage` |

---

## Keyboard Shortcuts

Press <kbd>?</kbd> anywhere in the app to display the interactive shortcuts sheet.

| Shortcut | Action |
|---|---|
| <kbd>Space</kbd> | Toggle motor and audio play / pause |
| <kbd>←</kbd> / <kbd>→</kbd> | Seek backward / forward 5 seconds |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Adjust volume up / down (5%) |
| <kbd>M</kbd> | Toggle mute / unmute |
| <kbd>C</kbd> | Toggle tonearm cueing lever (drop / lift needle) |
| <kbd>3</kbd> / <kbd>4</kbd> | Switch speed mode (33⅓ RPM / 45 RPM) |
| <kbd>S</kbd> | Toggle shuffle playback |
| <kbd>R</kbd> | Toggle repeat track |
| <kbd>E</kbd> | Open / close Tone Equalizer panel |
| <kbd>?</kbd> | Toggle Keyboard Shortcuts help modal |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| 3D Rendering | Three.js r184 + OrbitControls |
| Audio Engine | Web Audio API + HTML `<audio>` element (`BiquadFilterNode`, `AnalyserNode`, `ScriptProcessorNode`) |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Fonts | Playfair Display, Inter, JetBrains Mono |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
git clone https://github.com/Aditthan-07/Melodex.git
cd Melodex
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Build for Production

```bash
npm run build
npm run preview
```

The optimized production build is compiled to the `dist/` directory.

---

## Usage Guide

### Loading Music

1. **Spin Demo Vinyl (Lo-Fi Jazz)**
   Click **"Spin Demo Vinyl (Lo-Fi Jazz)"** on the empty shelf panel to instantly synthesize vintage lo-fi records directly in your browser.
2. **Open Local Music Folder** *(recommended)*
   Click **"Open Local Music Folder"** to select a music directory. Melodex parses all supported audio formats (`mp3`, `wav`, `flac`, `m4a`, `ogg`, `aac`, `opus`) automatically.
3. **Drag & Drop**
   Drag audio files from your desktop or file manager and drop them anywhere onto the player deck.
4. **Choose Individual Files**
   Click **"Choose Audio Files"** to pick specific audio tracks using your system dialog.

### Turntable Controls

| Interaction | Action |
|---|---|
| Drag the headshell | Cue the needle to any position on the record |
| Click the cueing lever | Toggle needle drop / lift |
| Click the large round button | Start / stop the motor |
| Click the smaller button | Toggle between 33 and 45 RPM |
| Drag the pitch fader | Adjust playback speed based on selected range |
| Click range buttons (±8% / ±16% / ±50%) | Switch pitch fader resolution |
| Click the BRAKE button | Toggle Instant Brake vs Mechanical Inertial Slow-Down |
| Click the pitch badge | Quartz Lock to 0.0% speed |
| Scroll / drag the scene | Orbit the 3D camera |

### Wax Pressing, Phono DSP & Crate Management

- **Vinyl Wax Pressings**: Select your wax formulation in the header bar (`Classic`, `Amber`, `Ruby`, `Neon`) to dynamically change the material transparency, gloss, and color of the 3D record.
- **Quartz Pitch Lock & Multi-Range Fader**: Toggle between `±8%`, `±16%`, and `±50%` ultra-pitch ranges. Click the pitch badge anytime to snap directly back to `0.0%` with green `LOCK` confirmation.
- **Motor Braking**: Switch between `INERTIA` (natural platter spin-down) and `INST` (immediate electromagnetic stopping).
- **Stereo Balance & Spatial Phono**: Open the EQ &amp; FX sound console to adjust continuous L/R stereo balance with center detent, toggle **Mono Pressing Summing** (essential for authentic vintage mono pressings), or engage the **25Hz Subsonic Rumble Filter** to eliminate tonearm warp flutter and acoustic room feedback.
- **12" Gatefold Sleeve Inspector**: Click any record cover thumbnail in the shelf or player bar to inspect a high-resolution gatefold vinyl jacket complete with technical audio payload specs (file format, file size, duration, spin count), custom artwork uploader, and image export.
- **Export & Import Crate**: Click **"Export"** in the Record Shelf header to save your collection, favorites, and play statistics to a `.json` backup. Use **"Import"** to restore.
- **Remove Tracks / Clear Shelf**: Hover over any track in the shelf to reveal the trash icon to eject it, or click **"Clear"** in the shelf header to empty the deck.

---

## Project Structure

```
melodex/
├── src/
│   ├── components/
│   │   ├── Turntable3D.tsx       # Three.js 3D turntable scene, vinyl label & interactive meshes
│   │   ├── AudioVisualizer.tsx   # Real-time stereo VU meter & spectrum analyzer
│   │   ├── EqualizerModal.tsx    # 3-band parametric EQ, Analog Warmth & Stereo Phono console
│   │   ├── SleepTimerModal.tsx   # Audiophile sleep timer & tonearm auto-return modal
│   │   ├── VinylJacketModal.tsx  # 12" Gatefold vinyl jacket sleeve & artwork inspector
│   │   └── ShortcutsModal.tsx    # Keyboard shortcuts reference overlay
│   ├── utils/
│   │   ├── audioEngine.ts        # Web Audio graph (EQ, tube drive, wow/flutter, analyser, crackle)
│   │   ├── tagReader.ts          # Zero-dependency ID3v2/FLAC tag & album art parser
│   │   └── demoGenerator.ts      # Procedural lo-fi jazz vinyl synthesis engine
│   ├── App.tsx                    # Main layout, shelf filters, groove timeline, state management
│   ├── types.ts                   # Shared TypeScript interfaces & models
│   ├── index.css                  # Tailwind + custom animations
│   ├── main.tsx                   # React entry point
│   └── vite-env.d.ts              # Vite type declarations
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Browser Compatibility

| Browser | Folder Picker | Web Audio & 3D | Drag & Drop |
|---|---|---|---|
| Chrome / Edge 86+ | Native `showDirectoryPicker` | ✅ Full | ✅ Full |
| Firefox | Fallback `webkitdirectory` | ✅ Full | ✅ Full |
| Safari 15.2+ | Fallback `webkitdirectory` | ✅ Full | ✅ Full |

---

## Roadmap

- [x] Real-time audio visualizer & analog VU meter
- [x] 3-band parametric equalizer panel & presets
- [x] Analog warmth suite (tube amp saturation & wow/flutter drift)
- [x] Custom turntable finishes (Obsidian, Walnut, Silver, Neon)
- [x] Procedural vintage vinyl demo synthesis
- [x] Viewport drag-and-drop audio loading
- [x] Keyboard shortcut navigation suite
- [x] Turntable sleep timer with vinyl runout fade & auto-return
- [x] Album art extraction from audio metadata (ID3v2 & FLAC)
- [x] Dynamic 3D spinning vinyl center label artwork
- [x] Interactive micro-groove timeline scrubber with needle hover cues
- [x] Customizable vinyl wax pressings (Classic Black, Amber, Ruby, Neon)
- [x] Technics-style Quartz Pitch Lock (0.0% snap indicator)
- [x] Multi-range pitch fader (±8%, ±16%, ±50% Ultra-pitch)
- [x] Dual-mode motor braking (mechanical inertia vs instant electronic brake)
- [x] Stereo balance panner, mono pressing summing, and 25Hz subsonic rumble filter
- [x] 12" Vinyl Gatefold Sleeve inspector modal with custom artwork upload
- [x] Vinyl crate export & import backup system (.json)
- [x] Granular shelf track removal and crate clearing
- [ ] Crossfade between multiple turntables (DJ mode)

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

<div align="center">

Made with 🎶, Three.js, and the Web Audio API

</div>