import { Track } from '../types';

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private audio: HTMLAudioElement;
  private crackleNode: ScriptProcessorNode | null = null;
  private crackleGain: GainNode | null = null;
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
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AC();
    this.setupCrackle();
  }

  private setupCrackle() {
    if (!this.audioCtx) return;
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
    this.crackleGain.connect(this.audioCtx.destination);
    this.crackleNode = node;
  }

  public setCrackleVolume(value: number) {
    if (!this.audioCtx) this.initAudioContext();
    if (this.crackleGain && this.audioCtx) {
      this.crackleGain.gain.setValueAtTime(value * 0.55, this.audioCtx.currentTime);
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
    this.updatePlaybackRate();
  }

  private updatePlaybackRate() {
    const faderFactor = 1.0 + this.activePitch / 100;
    const finalRate = faderFactor * Math.max(0.04, this.motorSpeedFactor);
    try {
      if (isFinite(finalRate) && finalRate > 0) {
        this.audio.playbackRate = finalRate;
      }
    } catch {}
  }

  public play() {
    this.initAudioContext();
    if (this.audioCtx?.state === 'suspended') this.audioCtx.resume();
    if (this.currentTrack) {
      this.audio.play().catch(() => {});
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
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }

  public getCurrentTime() {
    return this.audio.currentTime;
  }

  public getDuration() {
    return this.audio.duration || 0;
  }
}

export const audioEngine = new AudioEngine();
