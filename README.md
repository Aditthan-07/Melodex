<div align="center">

# 🎧 Melodex

### A High-Fidelity 3D Vinyl Turntable Music Player

*A richly-detailed, physically-simulated turntable rendered entirely in the browser.*

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

</div>

---

## Overview

**Melodex** is a browser-based music player that recreates the experience of a physical vinyl turntable in interactive 3D. Built with **React**, **TypeScript**, and **Three.js**, it lets you load your own local audio library and play it through a turntable you can actually touch — drag the tonearm, flip the cueing lever, ride the pitch fader, and hear authentic vinyl crackle, all simulated client-side with the Web Audio API.

No servers. No uploads. No preloaded samples — Melodex only plays audio you load from your own machine.

<!--
## Preview

![Melodex Screenshot](./docs/screenshot.png)
-->

---

## Table of Contents

- [Features](#features)
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
| 🖱️ **Tonearm Dragging** | Physically grab and reposition the headshell to cue any point in the song |
| 🪛 **Cueing Lever** | Click the 3D lever to drop or lift the stylus needle |
| ⏯️ **Deck Controls** | Click directly on the 3D deck to toggle playback or switch between 33⅓ / 45 RPM |
| 🎚️ **Pitch Fader** | Drag the plinth slider to pitch-shift playback ±8% |
| 📻 **Vinyl Crackle** | Atmospheric surface noise via the Web Audio API, fully adjustable |
| ⚙️ **Motor Inertia** | Platter realistically accelerates and decelerates; pitch drops as the motor slows |
| 📂 **Local Folder Loading** | Native `showDirectoryPicker` API with a `webkitdirectory` fallback for all browsers |
| 🔍 **Searchable Shelf** | Filter your loaded library by title or artist in real time |
| 🎵 **Full Playback Controls** | Play/pause, skip, shuffle, repeat, volume, mute, and progress seeking |
| 🔒 **Privacy-First** | No preloaded samples, no server, no audio leaves your device |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| 3D Rendering | Three.js r184 + OrbitControls |
| Audio Engine | Web Audio API + HTML `<audio>` element |
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
git clone https://github.com/<your-username>/melodex.git
cd melodex
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

The optimized production build is written to the `dist/` directory.

---

## Usage Guide

### Loading Music

**Open Local Music Folder** *(recommended)*
Click **"Open Local Music Folder"** on the empty shelf panel. Your browser will prompt you to select a folder — all supported audio files inside (`mp3`, `wav`, `flac`, `m4a`, `ogg`, `aac`, `opus`) load into the shelf automatically.

> On Firefox and Safari, a fallback file picker opens instead — simply select all files within the folder manually.

**Choose Individual Files**
Click **"Choose Audio Files"** to select one or more audio files directly via the standard file dialog.

### Turntable Controls

| Interaction | Action |
|---|---|
| Drag the headshell | Cue the needle to any position on the record |
| Click the cueing lever | Toggle needle drop / lift |
| Click the large round button | Start / stop the motor |
| Click the smaller button | Toggle between 33 and 45 RPM |
| Drag the pitch fader | Adjust playback speed ±8% |
| Scroll / drag the scene | Orbit the 3D camera |

### Playback Bar

| Control | Function |
|---|---|
| ▶️ Play / Pause | Central amber button |
| ⏮ ⏭ Skip | Jump to previous or next track |
| 🔀 🔁 Shuffle / Repeat | Toggle icons flanking the skip buttons |
| ▬ Progress Bar | Click anywhere to seek |
| 🔊 Volume | Slider with mute toggle |
| 🎚️ RPM | Quick toggle between 33 and 45 |
| 📻 Crackle | Adjust vinyl surface noise intensity |
| 🎵 Pitch | Fine ±8% pitch adjustment (mirrors the 3D fader) |

---

## Project Structure

```
melodex/
├── src/
│   ├── components/
│   │   └── Turntable3D.tsx   # Three.js scene, orbit controls, interactivity
│   ├── utils/
│   │   └── audioEngine.ts    # Web Audio API engine (crackle, pitch, motor)
│   ├── App.tsx                # Main layout, state, file loading
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── index.css               # Tailwind + custom animations
│   ├── main.tsx                 # React entry point
│   └── vite-env.d.ts            # Vite type declarations
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

| Browser | Folder Picker | Audio Support |
|---|---|---|
| Chrome / Edge 86+ | Native `showDirectoryPicker` | ✅ Full |
| Firefox | Fallback `webkitdirectory` | ✅ Full |
| Safari 15.2+ | Fallback `webkitdirectory` | ✅ Full |

---

## Roadmap

- [ ] Album art extraction from audio metadata
- [ ] Persistent library across sessions (IndexedDB)
- [ ] Custom skins / turntable color themes
- [ ] Equalizer panel
- [ ] Crossfade between tracks

> Have an idea? Open an [issue](../../issues) or submit a pull request.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 🎶 and Three.js

</div>