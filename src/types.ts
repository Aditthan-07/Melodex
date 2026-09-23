export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  file?: File;
  isDemo?: boolean;
}

export type PlaybackState = 'stopped' | 'playing' | 'paused';

export type TurntableTheme = 'obsidian' | 'walnut' | 'silver' | 'neon';

export interface EQSettings {
  bass: number;    // -12 to +12 dB
  mid: number;     // -12 to +12 dB
  treble: number;  // -12 to +12 dB
}

export interface AnalogFXSettings {
  warmth: number;    // 0 to 1 (tube drive / saturation)
  flutter: number;   // 0 to 1 (wow & flutter)
}

export interface TurntableSettings {
  pitch: number;
  speed: 33 | 45;
  cueingLeverUp: boolean;
  crackleVolume: number;
  isGrabbingHeadshell: boolean;
  theme: TurntableTheme;
  eq: EQSettings;
  analogFX: AnalogFXSettings;
}

export type VisualizerMode = 'spectrum' | 'vu';
