import { Track } from '../types';

/**
 * Encodes audio samples (Float32Array for Left and Right) into a standard 16-bit PCM WAV Blob.
 */
function encodeWav(left: Float32Array, right: Float32Array, sampleRate: number): Blob {
  const numChannels = 2;
  const numSamples = left.length;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Helper to write ASCII strings
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  /* RIFF chunk descriptor */
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  /* fmt sub-chunk */
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample

  /* data sub-chunk */
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write 16-bit interleaved PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Left channel
    const sL = Math.max(-1, Math.min(1, left[i]));
    view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
    offset += 2;

    // Right channel
    const sR = Math.max(-1, Math.min(1, right[i]));
    view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Generates a warm, synthesized lo-fi jazz vinyl track.
 */
function synthesizeLofiTrack(
  durationSeconds: number,
  bpm: number,
  chordProgression: number[][],
  bassProgression: number[]
): { left: Float32Array; right: Float32Array; duration: number } {
  const sampleRate = 44100;
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  const beatLength = (60 / bpm) * sampleRate;
  const barLength = beatLength * 4;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const currentBar = Math.floor(i / barLength);
    const barProgress = (i % barLength) / barLength;
    const chordIndex = currentBar % chordProgression.length;
    const chord = chordProgression[chordIndex];
    const bassFreq = bassProgression[chordIndex];

    let chordSample = 0;
    // Synthesize electric piano timbre with soft harmonics & tremolo
    const tremolo = 1 + 0.15 * Math.sin(2 * Math.PI * 4.5 * t);
    for (let c = 0; c < chord.length; c++) {
      const freq = chord[c];
      const phase = 2 * Math.PI * freq * t;
      // Fundamental + gentle 2nd and 3rd harmonics
      const noteWave =
        Math.sin(phase) * 0.6 +
        Math.sin(phase * 2) * 0.25 +
        Math.sin(phase * 3) * 0.1;
      chordSample += noteWave;
    }
    chordSample = (chordSample / chord.length) * tremolo;

    // Warm envelope decay per chord change
    const env = Math.exp(-barProgress * 2.2);
    chordSample *= env * 0.38;

    // Synthesize warm sub bass
    const bassPhase = 2 * Math.PI * bassFreq * t;
    const bassWave =
      (Math.sin(bassPhase) * 0.75 + Math.sin(bassPhase * 2) * 0.25) *
      Math.exp(-((i % beatLength) / beatLength) * 3.0) *
      0.45;

    // Subtle brushed vinyl percussion pulse (soft low-passed noise on 2 and 4 beats)
    const beatIndex = Math.floor((i % barLength) / beatLength);
    let snareNoise = 0;
    if (beatIndex === 1 || beatIndex === 3) {
      const beatProg = (i % beatLength) / beatLength;
      if (beatProg < 0.25) {
        snareNoise = (Math.random() - 0.5) * 0.18 * Math.exp(-beatProg * 18);
      }
    }

    // Soft master stereo panning
    const mix = chordSample + bassWave + snareNoise;
    left[i] = mix * 0.95 + chordSample * 0.08;
    right[i] = mix * 0.95 - chordSample * 0.08;
  }

  return { left, right, duration: durationSeconds };
}

/**
 * Creates 2 demo vintage vinyl tracks with procedural audio synthesis.
 */
export function generateDemoTracks(): Track[] {
  // Track 1: "Midnight Groove (Lo-Fi Jazz)"
  // Chords: Dm9 (D F A C E), G13 (G B F A E), Cmaj7 (C E G B), Am7 (A C E G)
  const chord1 = [
    [293.66, 349.23, 440.0, 523.25, 659.25], // Dm9
    [196.0, 246.94, 349.23, 440.0, 659.25],  // G13
    [261.63, 329.63, 392.0, 493.88],         // Cmaj7
    [220.0, 261.63, 329.63, 392.0],          // Am7
  ];
  const bass1 = [73.42, 49.0, 65.41, 55.0];

  const audio1 = synthesizeLofiTrack(42, 75, chord1, bass1);
  const blob1 = encodeWav(audio1.left, audio1.right, 44100);
  const url1 = URL.createObjectURL(blob1);

  // Track 2: "Analog Nostalgia (Vinyl Soul)"
  // Chords: Fmaj7, Em7, Dm7, Cmaj7
  const chord2 = [
    [349.23, 440.0, 523.25, 659.25], // Fmaj7
    [329.63, 392.0, 493.88, 587.33], // Em7
    [293.66, 349.23, 440.0, 523.25], // Dm7
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
  ];
  const bass2 = [87.31, 82.41, 73.42, 65.41];

  const audio2 = synthesizeLofiTrack(48, 80, chord2, bass2);
  const blob2 = encodeWav(audio2.left, audio2.right, 44100);
  const url2 = URL.createObjectURL(blob2);

  return [
    {
      id: 'demo_track_1',
      title: 'Midnight Groove',
      artist: 'Melodex Vinyl Ensemble',
      album: 'Lo-Fi Sessions Vol. 1',
      duration: audio1.duration,
      url: url1,
      isDemo: true,
    },
    {
      id: 'demo_track_2',
      title: 'Analog Nostalgia',
      artist: 'Melodex Vinyl Ensemble',
      album: 'Lo-Fi Sessions Vol. 1',
      duration: audio2.duration,
      url: url2,
      isDemo: true,
    },
  ];
}
