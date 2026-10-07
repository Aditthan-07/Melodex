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

```bash
git clone https://github.com/Aditthan-07/Melodex.git
cd Melodex
npm install
npm run dev
```

Open [`http://localhost:5173`](http://localhost:5173) in your browser.

> **Supported Formats:** Load `.mp3`, `.flac`, `.wav`, `.m4a`, `.ogg`, or `.aac` files via folder select, drag-and-drop, or click **"Spin Demo Vinyl"** for procedural lo-fi jazz.

---

## ⌨️ Keyboard Shortcuts

| Key | Action | Key | Action |
| :---: | :--- | :---: | :--- |
| <kbd>Space</kbd> | Play / Pause Motor | <kbd>C</kbd> | Cueing Lever (Drop / Lift) |
| <kbd>3</kbd> / <kbd>4</kbd> | 33⅓ / 45 RPM Speed | <kbd>←</kbd> / <kbd>→</kbd> | Seek (±5s) |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Volume Up / Down | <kbd>M</kbd> | Mute / Unmute |
| <kbd>E</kbd> | Equalizer & Phono FX | <kbd>V</kbd> | Cycle Visualizers |
| <kbd>S</kbd> / <kbd>R</kbd> | Shuffle / Repeat | <kbd>?</kbd> | All Shortcuts Modal |

*Tip: You can also drag the tonearm headshell directly on the 3D record to cue grooves.*

---

## 🛠️ Built With

- **Framework:** React 19 & TypeScript (bundled with Vite)
- **3D Graphics:** Three.js (r184)
- **Audio DSP:** Web Audio API (`BiquadFilter`, `WaveShaper`, `Analyser`)
- **Styling & UI:** Tailwind CSS v3 & Lucide React icons

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