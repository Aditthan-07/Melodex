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

## 🤝 Contributing & License

Contributions, bug reports, and ideas are warmly welcome. Feel free to open an issue or submit a pull request!

This project is licensed under the [MIT License](LICENSE).

<div align="center">
  <br/>
  Crafted with 🖤 by <a href="https://github.com/Aditthan-07"><b>Aditthan-07</b></a>
</div>