import { Track, EQSettings } from '../types';

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private audio: HTMLAudioElement;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private crackleNode: ScriptProcessorNode | null = null;
  private crackleGain: GainNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentTrack: Track | null = null;
  private activePitch = 0;
  private motorSpeedFactor = 0;

  public onTimeUpdate: ((current: number, total: number) => void) | null = null;
  public onEnded: (() => void) | null = null;

  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdate?.(this.audio.currentTime, this.audio.duration || 0);
    });
    this.audio.addEventListener('ended', () => {
      this.onEnded?.();
    });
    this.audio.addEventListener('loadedmetadata', () => {
      this.onTimeUpdate?.(0, this.audio.duration || 0);
    });
  }

  private initAudioContext() {
    if (this.audioCtx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioContextClass();

    // Create 3-band EQ filters
    this.bassFilter = this.audioCtx.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = 100;
    this.bassFilter.gain.value = 0;

    this.midFilter = this.audioCtx.createBiquadFilter();
    this.midFilter.type = 'peaking';
    this.midFilter.frequency.value = 1000;
    this.midFilter.Q.value = 1.0;
    this.midFilter.gain.value = 0;

    this.trebleFilter = this.audioCtx.createBiquadFilter();
    this.trebleFilter.type = 'highshelf';
    this.trebleFilter.frequency.value = 8000;
    this.trebleFilter.gain.value = 0;

    // Master gain
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0.8;

    // Real-time Analyser for visualizer & VU meters
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.82;

    // Connect source if not connected yet
    try {
      if (!this.sourceNode) {
        this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.bassFilter);
        this.bassFilter.connect(this.midFilter);
        this.midFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.masterGain);
      }
    } catch (e) {
      console.warn('MediaElementAudioSourceNode initialization error:', e);
    }

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    this.setupCrackle();
  }

  private setupCrackle() {
    if (!this.audioCtx || !this.masterGain) return;
    const bufferSize = 4096;
    const node = this.audioCtx.createScriptProcessor(bufferSize, 0, 1);
    let lastNoise = 0;

    node.onaudioprocess = (e) => {
      const out = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const rumble = (Math.random() - 0.5) * 0.012;
        const hiss = (Math.random() - 0.5) * 0.004;
        let pop = 0;
        const spinF = Math.max(0.1, this.motorSpeedFactor);
        if (Math.random() < 0.00028 * spinF) {
          pop = (Math.random() > 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.3);
        }
        lastNoise = lastNoise * 0.93 + pop;
        out[i] = (rumble * 0.4 + hiss * 0.1 + lastNoise * 0.5) * spinF;
      }
    };

    const bp = this.audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900;
    bp.Q.value = 0.6;

    this.crackleGain = this.audioCtx.createGain();
    this.crackleGain.gain.value = 0.25;

    node.connect(bp);
    bp.connect(this.crackleGain);
    this.crackleGain.connect(this.masterGain);
    this.crackleNode = node;
  }

  public setCrackleVolume(value: number) {
    if (!this.audioCtx) this.initAudioContext();
    if (this.crackleGain && this.audioCtx) {
      this.crackleGain.gain.setValueAtTime(value * 0.55, this.audioCtx.currentTime);
    }
  }

  public setEQ(eq: EQSettings) {
    if (!this.audioCtx) this.initAudioContext();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    if (this.bassFilter) this.bassFilter.gain.setValueAtTime(eq.bass, t);
    if (this.midFilter) this.midFilter.gain.setValueAtTime(eq.mid, t);
    if (this.trebleFilter) this.trebleFilter.gain.setValueAtTime(eq.treble, t);
  }

  public getVisualizerData(freqArray: Uint8Array<ArrayBuffer>, waveArray?: Uint8Array<ArrayBuffer>): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(freqArray);
      if (waveArray) {
        this.analyser.getByteTimeDomainData(waveArray);
      }
    }
  }

  public async setTrack(track: Track) {
    this.initAudioContext();
    if (this.audioCtx?.state === 'suspended') await this.audioCtx.resume();
    this.currentTrack = track;
    if (track.url) {
      this.audio.src = track.url;
      this.audio.load();
    }
    this.updatePlaybackRate();
  }

  public setMotorSpeed(factor: number) {
    this.motorSpeedFactor = factor;
    this.updatePlaybackRate();
  }

  public setPitch(pitch: number) {
    this.activePitch = pitch;
    this.updatePlaybackRate();
  }

  public setSpeedMode(mode: 33 | 45) {
    if (mode === 45) {
      // speed adjustment if needed
    }
    this.updatePlaybackRate();
  }

  private updatePlaybackRate() {
    const faderFactor = 1.0 + this.activePitch / 100;
    const finalRate = faderFactor * Math.max(0.04, this.motorSpeedFactor);
    try {
      if (isFinite(finalRate) && finalRate > 0) {
        this.audio.playbackRate = finalRate;
      }
    } catch (err) {
      console.debug('Playback rate adjustment notice:', err);
    }
  }

  public play() {
    this.initAudioContext();
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume().catch((err) => console.debug('AudioContext resume:', err));
    }
    if (this.currentTrack) {
      this.audio.play().catch((err) => console.debug('Audio play:', err));
    }
  }

  public pause() {
    this.audio.pause();
  }

  public seek(pct: number) {
    if (this.audio.duration && isFinite(this.audio.duration)) {
      this.audio.currentTime = (pct / 100) * this.audio.duration;
    }
  }

  public setVolume(vol: number) {
    const safeVol = Math.max(0, Math.min(1, vol));
    this.audio.volume = safeVol;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(safeVol, this.audioCtx.currentTime);
    }
  }

  public getCurrentTime() {
    return this.audio.currentTime;
  }

  public getDuration() {
    return this.audio.duration || 0;
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  public destroy() {
    if (this.crackleNode) {
      this.crackleNode.disconnect();
      this.crackleNode = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

export const audioEngine = new AudioEngine();
