export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  file?: File;
}

export type PlaybackState = 'stopped' | 'playing' | 'paused';

export interface TurntableSettings {
  pitch: number;
  speed: 33 | 45;
  cueingLeverUp: boolean;
  crackleVolume: number;
  isGrabbingHeadshell: boolean;
}
