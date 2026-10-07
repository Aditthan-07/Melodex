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

## 🚀 Quick Start

### Prerequisites
* **Node.js** v18+ & **npm** v9+ (or `pnpm` / `bun`)
* Modern Chromium, Firefox, or Safari browser with WebGL & Web Audio API support

### Installation & Local Dev

```bash
# Clone the repository
git clone https://github.com/Aditthan-07/Melodex.git
cd Melodex

# Install dependencies
npm install

# Launch development server
npm run dev
```

Visit [`http://localhost:5173`](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build    # Compiles type-checked, minified bundle to dist/
npm run preview  # Previews production build locally
```

---

## 🎮 Interactive Controls & Keyboard Matrix

Melodex combines intuitive mouse/touch 3D interactions with tactile keyboard shortcuts for a genuine physical deck feel:

| Feature / Action | Physical Deck Interaction | Keyboard Shortcut |
| :--- | :--- | :---: |
| **Platter Motor** | Click circular START / STOP button | <kbd>Space</kbd> |
| **Tonearm Needle** | Click & drag headshell to cue any groove point | — |
| **Cueing Lever** | Click miniature mechanical lever to drop / lift needle | <kbd>C</kbd> |
| **Speed Mode** | Toggle 33⅓ / 45 RPM speed selector buttons | <kbd>3</kbd> / <kbd>4</kbd> |
| **Groove Scrubber** | Hover & click micro-groove timeline scrubber | <kbd>←</kbd> / <kbd>→</kbd> (±5s) |
| **Master Volume** | Rotate master volume dial | <kbd>↑</kbd> / <kbd>↓</kbd> (±5%) |
| **Audio Mute** | Click speaker icon | <kbd>M</kbd> |
| **Pitch & Tempo** | Drag pitch slider (`±8%`, `±16%`, `±50%` ranges) | — |
| **Quartz Lock** | Click pitch badge to snap instantly to 0.0% | — |
| **Motor Brake Mode** | Click BRAKE button (`INERTIA` slow roll vs `INST` brake) | — |
| **Tone Equalizer & FX** | Open sound console modal | <kbd>E</kbd> |
| **Cycle Visualizers** | Switch between Stereo VU, Spectrum, and CRT Scope | <kbd>V</kbd> |
| **Playback Modes** | Toggle shuffle or repeat in shelf header | <kbd>S</kbd> / <kbd>R</kbd> |
| **Shortcuts Sheet** | Click help icon in navigation bar | <kbd>?</kbd> |
| **3D Camera Orbit** | Left-click drag to orbit, right-click to pan, scroll to zoom | — |

---

## 🎵 Supported Audio & Ingestion

Melodex processes all audio locally with zero network upload or cloud storage:

<p align="center">
  <img src="https://img.shields.io/badge/MP3-Lossy-3b82f6?style=flat-square" alt="MP3" />
  <img src="https://img.shields.io/badge/FLAC-Lossless-10b981?style=flat-square" alt="FLAC" />
  <img src="https://img.shields.io/badge/WAV-PCM-6366f1?style=flat-square" alt="WAV" />
  <img src="https://img.shields.io/badge/M4A%20/%20AAC-MPEG4-ec4899?style=flat-square" alt="M4A" />
  <img src="https://img.shields.io/badge/OGG%20/%20OPUS-Vorbis-8b5cf6?style=flat-square" alt="OGG" />
</p>

* 📂 **Local Directory Picker** — Click *"Open Local Music Folder"* to scan your music library recursively via the File System Access API (with seamless `webkitdirectory` fallback).
* 📥 **Viewport Drag & Drop** — Drag audio files directly from Finder / File Explorer onto the 3D turntable deck.
* 🎷 **Procedural Synthesis** — Click *"Spin Demo Vinyl"* to synthesize lo-fi jazz records on-demand without any audio files.

---

## 🛠️ Tech Stack

| Layer | Technologies & Libraries | Purpose |
| :--- | :--- | :--- |
| **Core Architecture** | React 19, TypeScript 5, Vite 8 | Reactive component tree, strict type safety, fast HMR |
| **3D Graphics Engine** | Three.js r184, OrbitControls | PBR materials, custom mesh geometries, dynamic canvas textures |
| **Audio DSP Graph** | Web Audio API, HTML5 Audio | BiquadFilter EQ, WaveShaper saturation, AnalyserNode visualizers |
| **Metadata Parsing** | Custom Tag Reader (`tagReader.ts`) | Zero-dependency ID3v2 & FLAC metadata and picture extractor |
| **Styling & Icons** | Tailwind CSS v3, Lucide React | Modern dark-mode UI, custom animations, clean vector iconography |
| **Typography** | Playfair Display, Inter, JetBrains Mono | Vintage analog typography paired with crisp technical metrics |

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