# Melodex — 3D Vinyl Turntable Player

A high-fidelity, 3D interactive vinyl turntable music player built with React 18 + Vite and Three.js. Load your local music library and experience it through a richly-detailed, physically-simulated turntable rendered entirely in the browser.

---

## Features

- **Interactive 3D turntable** — platter, S-curve tonearm, headshell, vinyl record with groove texture, cueing lever, pitch fader, and start/stop buttons
- **Drag the tonearm** — physically grab and reposition the headshell to cue any point in the song
- **Cueing lever** — click the 3D lever to drop or lift the stylus needle
- **Start/Stop & Speed buttons** — click directly on the 3D deck controls to toggle playback and switch 33⅓ / 45 RPM
- **Pitch fader** — drag the slider on the plinth to pitch-shift playback ±8%
- **Vinyl crackle** — atmospheric surface noise via Web Audio API, fully adjustable
- **Motor inertia** — platter accelerates and decelerates realistically; pitch drops as the motor slows
- **Local folder loading** — showDirectoryPicker API with webkitdirectory fallback for all browsers
- **Searchable track shelf** — filter your loaded library by title or artist in real time
- **Playback controls** — play/pause, skip, shuffle, repeat, volume, mute, progress seeker
- **No preloaded samples** — plays only audio you load from your local system

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| 3D rendering | Three.js r184 + OrbitControls |
| Audio | Web Audio API + HTML audio element |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Fonts | Playfair Display, Inter, JetBrains Mono |

---

## Installation

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Steps

```bash
cd melodex
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Build for Production

```bash
npm run build
npm run preview
```

Output is written to `dist/`.

---

## Usage

### Loading Music

**Open Local Music Folder (recommended)**
Click "Open Local Music Folder" on the empty shelf panel. The browser prompts you to choose a folder. All audio files inside (mp3, wav, flac, m4a, ogg, aac, opus) load into the shelf automatically.

On Firefox and Safari, a fallback file picker opens — select all files in the folder manually.

**Choose Individual Files**
Click "Choose Audio Files" to pick one or more audio files via the standard file dialog.

### Turntable Controls

| Interaction | Action |
|---|---|
| Drag the headshell | Cue the needle to any position on the record |
| Click the cueing lever | Toggle needle drop / lift |
| Click the large round button | Start / Stop motor |
| Click the smaller button | Toggle 33 / 45 RPM |
| Drag the pitch fader | Adjust playback speed ±8% |
| Scroll / drag the scene | Orbit the 3D camera |

### Playback Bar

- Play / Pause — central amber button
- Skip — previous and next track buttons
- Shuffle / Repeat — toggle icons flanking the skip buttons
- Progress bar — click anywhere to seek
- Volume — slider with mute toggle
- RPM — quick toggle between 33 and 45
- Crackle — vinyl surface noise intensity
- Pitch — fine ±8% pitch adjustment (mirrors the 3D fader)

---

## Project Structure

```
melodex/
├── src/
│   ├── components/
│   │   └── Turntable3D.tsx   Three.js scene, orbit controls, interactivity
│   ├── utils/
│   │   └── audioEngine.ts    Web Audio API engine (crackle, pitch, motor)
│   ├── App.tsx               Main layout, state, file loading
│   ├── types.ts              Shared TypeScript interfaces
│   ├── index.css             Tailwind + custom animations
│   ├── main.tsx              React entry point
│   └── vite-env.d.ts         Vite type declarations
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Browser Compatibility

| Browser | Folder Picker | Audio |
|---|---|---|
| Chrome / Edge 86+ | Native showDirectoryPicker | Full |
| Firefox | Fallback webkitdirectory | Full |
| Safari 15.2+ | Fallback webkitdirectory | Full |

---

## PowerShell Quick-Start (Windows)

```powershell
cd melodex
npm install
npm run dev
```

The dev server runs on http://localhost:5173.

---

## License

MIT
