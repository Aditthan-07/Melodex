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

export interface TurntableSettings {
  pitch: number;
  speed: 33 | 45;
  cueingLeverUp: boolean;
  crackleVolume: number;
  isGrabbingHeadshell: boolean;
  theme: TurntableTheme;
  eq: EQSettings;
}

export type VisualizerMode = 'spectrum' | 'vu';
