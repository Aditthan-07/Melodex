<div align="center">

# 🎧 Melodex

**A high-fidelity 3D vinyl turntable music player rendered in the browser.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Web Audio](https://img.shields.io/badge/Web_Audio-API-FF4081)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

<br/>

Melodex brings physical vinyl listening to the web. Load your local audio files or generate procedural lo-fi jazz vinyl directly in your browser with interactive 3D tonearm controls, real-time visualizers, and authentic analog sound effects.

</div>

---



## ✨ Features

- **3D Interactive Turntable** — Orbit camera, drag-to-cue tonearm, mechanical cueing lever, and 33⅓ / 45 RPM playback.
- **Pitch & Motor Dynamics** — Multi-range pitch fader (±8%, ±16%, ±50%), instant 0.0% quartz lock, and inertial spin-down vs instant braking.
- **Analog Sound Engine** — 3-band EQ, tube saturation, wow & flutter, atmospheric vinyl crackle, and stereo balance / mono summing.
- **Real-Time Visualizers** — Dual analog VU meters, 28-band spectrum analyzer, and retro phosphor CRT oscilloscope.
- **Custom Wax & Aesthetics** — 4 vinyl wax colors, 4 chassis finishes, 12" gatefold jacket inspector, and procedural lo-fi jazz demo generator.
- **Private & Local-First** — Pure client-side playback, ID3/FLAC metadata extraction, zero server uploads, and JSON crate export/import.

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

## 📂 Project Architecture

```
melodex/
├── src/
│   ├── components/
│   │   ├── Turntable3D.tsx       # Three.js 3D deck, interactive tonearm & vinyl mesh
│   │   ├── AudioVisualizer.tsx   # Dual analog VU meters, spectrum & CRT oscilloscope
│   │   ├── EqualizerModal.tsx    # 3-band parametric EQ, tube saturation & stereo console
│   │   ├── SleepTimerModal.tsx   # Runout groove fade & mechanical tonearm auto-return
│   │   ├── VinylJacketModal.tsx  # 12" Gatefold sleeve viewer & audio metadata inspector
│   │   └── ShortcutsModal.tsx    # Interactive keyboard shortcuts overlay
│   ├── utils/
│   │   ├── audioEngine.ts        # Modular Web Audio DSP node graph & signal routing
│   │   ├── tagReader.ts          # Zero-dependency ID3v2/FLAC tag & album artwork extractor
│   │   └── demoGenerator.ts      # Procedural lo-fi jazz synthesis engine
│   ├── App.tsx                   # Master layout, shelf filter state & groove scrubber
│   ├── types.ts                  # Central TypeScript domain interfaces
│   └── main.tsx                  # Application entry point
├── public/                       # Static branding & vector icon assets
├── index.html                    # Root HTML document with preloaded analog fonts
└── vite.config.ts                # Build configuration & Vite plugins
```

---

## 🌐 Browser Compatibility

Melodex relies on modern web standards (WebGL 2.0, Web Audio API, and File System Access API):

| Browser | Platform | 3D Engine & Audio DSP | Local Directory Scan | Drag & Drop |
| :--- | :--- | :---: | :---: | :---: |
| **Google Chrome / Chromium** | Desktop (v86+) | ✅ Full | ✅ Native `showDirectoryPicker` | ✅ Full |
| **Microsoft Edge** | Desktop (v86+) | ✅ Full | ✅ Native `showDirectoryPicker` | ✅ Full |
| **Mozilla Firefox** | Desktop (v90+) | ✅ Full | ✅ Fallback `webkitdirectory` | ✅ Full |
| **Apple Safari** | macOS (v15.2+) | ✅ Full | ✅ Fallback `webkitdirectory` | ✅ Full |

---

## 🗺️ Roadmap & Vision

### Shipped Milestones
* **v1.0 — Core Deck Simulation**: 3D platter, S-curve tonearm, needle cueing, procedural Lo-Fi demo engine, and local folder ingestion.
* **v1.2 — Phono DSP Suite**: 3-band parametric EQ, tube amp saturation, wow & flutter, atmospheric vinyl crackle, and sleep timer.
* **v1.3 — Wax & Crate Portability**: 4 wax pressings, 4 deck chassis finishes, gatefold sleeve inspector, and JSON crate backups.
* **v1.4 — Precision Monitoring & Physics**: Phosphor CRT oscilloscope, Technics Quartz Pitch Lock (±8%, ±16%, ±50%), motor inertia vs instant brake, stereo panner, and 25Hz rumble filter.

### Future Horizon
- [ ] **Dual-Deck DJ Mode**: Two independent 3D turntables with crossfader, slipmats, and beatmatch pitch-bending.
- [ ] **Web MIDI Controller Mapping**: Plug-and-play mapping for physical DJ controllers and MIDI rotary encoders.
- [ ] **Custom Vinyl Label Styler**: In-app sticker designer and custom groove color grading.
- [ ] **Acoustic Convolver Room Reverb**: Simulated vinyl listening room impulses (living room, studio, jazz lounge).

---

## 🤝 Contributing

Contributions, feedback, and feature suggestions are warmly welcomed!

1. **Fork** the repository on GitHub.
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes with clear messages:
   ```bash
   git commit -m "feat(deck): add custom platter slipmat pattern"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** describing your additions and changes.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete details.

---

<div align="center">

Crafted with 🖤 by [**Aditthan-07**](https://github.com/Aditthan-07)

*Powered by Three.js & Web Audio API*

</div>