<div align="center">

# 🎧 Melodex

### High-Fidelity 3D Vinyl Turntable & Audio Player

*An interactive, physically-modeled vinyl listening experience running 100% client-side in your browser.*

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-r184-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"><img src="https://img.shields.io/badge/Web_Audio_API-DSP-FF4081?style=for-the-badge&logo=soundcharts&logoColor=white" alt="Web Audio API" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge" alt="MIT License" /></a>
</p>

<p align="center">
  <b>🔒 100% Client-Side & Private</b> &nbsp;•&nbsp;
  <b>📁 Zero Uploads / Local First</b> &nbsp;•&nbsp;
  <b>🎛️ Physical 3D Simulation</b> &nbsp;•&nbsp;
  <b>🎷 Built-in Lo-Fi Generator</b>
</p>

</div>

---

## 🌟 At a Glance

**Melodex** bridges tactile vintage analog hardware with cutting-edge web graphics and digital signal processing. Drop your personal audio library directly onto a 3D direct-drive turntable: cue the needle with natural inertia, sculpt your acoustic profile with parametric EQ, simulate tube harmonic saturation, and inspect high-resolution gatefold vinyl sleeves — with zero cloud latency and complete data privacy.

> **Instant Preview:** Don't have local music files handy? Melodex includes a built-in **procedural Lo-Fi Jazz vinyl synthesis engine** so you can start spinning records the moment you launch the app.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
  - [1. Physical 3D Turntable Simulation](#1--physical-3d-turntable-simulation)
  - [2. Audiophile Phono DSP Sound Engine](#2--audiophile-phono-dsp-sound-engine)
  - [3. Precision Real-Time Visualizer Console](#3--precision-real-time-visualizer-console)
  - [4. Vinyl Wax, Gatefold & Crate Management](#4--vinyl-wax-gatefold--crate-management)
- [Quick Start](#-quick-start)
- [Interactive Controls & Shortcuts](#-interactive-controls--shortcuts)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎛️ Core Features

### 1. 🎚️ Physical 3D Turntable Simulation
* **Tactile Mechanical Deck** — Orbit around a physically modeled turntable with platter, responsive S-curve tonearm, headshell with needle drag-cueing, and animated cueing lever.
* **Realistic Motor Dynamics** — Platter acceleration curves with authentic pitch-drop on spindown, or switch instantly to electromagnetic braking (`INST`).
* **Multi-Range Pitch Fader** — Switch between standard `±8%`, `±16%`, and `±50% Ultra-Pitch` ranges with live strobe rim feedback.
* **Quartz Pitch Lock** — Technics SL-1200 style quartz lock instantly snaps playback pitch to exact `0.0%` with green status indicator.
* **Speed Select** — Authentic 33⅓ and 45 RPM rotation controls with synchronized Web Audio playback resampling.

### 2. 🔊 Audiophile Phono DSP Sound Engine
* **3-Band Parametric EQ** — Precision Web Audio Biquad filters for Bass (100 Hz), Mid (1 kHz), and Treble (8 kHz) with curve response and acoustic presets.
* **Analog Warmth & Drive** — Harmonic tube amplifier saturation via custom `WaveShaperNode` soft-clipping alongside subtle wow & flutter pitch drift.
* **Surface Noise & Subsonic Rumble** — Dial in authentic atmospheric vinyl crackle, backed by a **25 Hz Subsonic Rumble Filter** to eliminate ultra-low tonearm flutter.
* **Spatial Phono & Mono Pressing** — Continuous L/R balance with center-detent snap, plus dedicated Mono Summing essential for vintage mono pressings.
* **Audiophile Sleep Timer** — Configurable timer (15–60 min or End of Record) featuring authentic runout groove fade and tonearm auto-return.

### 3. 📊 Precision Real-Time Visualizer Console
* **Analog VU Meters** — Dual needle ballistics monitoring stereo channel levels with vintage warm backlighting.
* **28-Band Spectrum Analyzer** — Crisp real-time frequency distribution with smooth decay.
* **Phosphor CRT Oscilloscope** — Retro vector waveform scope with trigger stabilization and authentic green glow.

### 4. 🎨 Vinyl Wax, Gatefold & Crate Management
* **4 Wax Formulations** — Switch between `Classic Black`, `Translucent Amber`, `Deep Ruby Red`, and `Electric Cyan Neon` with dynamic PBR shader materials.
* **4 Deck Finishes** — Customize the turntable chassis with `Classic Obsidian`, `Walnut Wood`, `Silver Technics`, and `Midnight Neon`.
* **12" Gatefold Sleeve Inspector** — Full-screen interactive vinyl jacket with technical audio specs (format, size, duration, spin count), custom artwork uploader, and image export.
* **Dynamic Center Label** — Client-side ID3v2/FLAC metadata parser extracts album art and maps it directly onto the spinning 3D record.
* **Crate Portability** — Star favorites, track spin counts, filter library views, and export/import your entire collection via portable `.json` crates.
* **Procedural Lo-Fi Generator** — Instant browser synthesis of original lo-fi jazz vinyl records (*Midnight Groove* and *Analog Nostalgia*) with zero external dependencies.

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
| <kbd>V</kbd> | Cycle audio visualizer mode (Spectrum / VU / CRT Oscilloscope) |
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
- [x] Retro phosphor CRT oscilloscope visualizer with trigger stabilization
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