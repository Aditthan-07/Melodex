import React, { useRef, useEffect, useState } from 'react';
import { Activity, BarChart3, Waves } from 'lucide-react';
import { VisualizerMode } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
  mode?: VisualizerMode;
  onModeChange?: (mode: VisualizerMode) => void;
}

interface MeterState {
  leftVal: number;
  rightVal: number;
  peaks: number[];
}

function drawSingleVU(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  level: number,
  label: string
) {
  // Meter enclosure background
  ctx.fillStyle = '#0d0d10';
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Scale arc
  const pivotX = x + w / 2;
  const pivotY = y + h + 8;
  const radius = Math.min(w * 0.75, h * 1.3);

  const startAngle = Math.PI * 1.25;
  const endAngle = Math.PI * 1.75;

  // Draw arc ticks
  ctx.strokeStyle = '#52525b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, radius, startAngle, endAngle);
  ctx.stroke();

  // Red zone (> 0dB)
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, radius, Math.PI * 1.63, endAngle);
  ctx.stroke();

  // Needle calculation
  const clamped = Math.max(0, Math.min(1.15, level));
  const needleAngle = startAngle + (endAngle - startAngle) * Math.min(1, clamped);

  const needleTipX = pivotX + Math.cos(needleAngle) * (radius - 4);
  const needleTipY = pivotY + Math.sin(needleAngle) * (radius - 4);

  // Needle shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pivotX + 1, pivotY + 1);
  ctx.lineTo(needleTipX + 1, needleTipY + 1);
  ctx.stroke();

  // Needle line
  ctx.strokeStyle = clamped > 0.95 ? '#ef4444' : '#f59e0b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(needleTipX, needleTipY);
  ctx.stroke();

  // Pivot cap
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.arc(pivotX, pivotY - 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Channel label & VU text
  ctx.fillStyle = '#71717a';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + 11);

  // Peak LED
  const isPeak = clamped > 0.95;
  ctx.fillStyle = isPeak ? '#ef4444' : '#3f3f46';
  ctx.beginPath();
  ctx.arc(x + w - 10, y + 9, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  freq: Uint8Array,
  peaks: number[]
) {
  const barCount = 28;
  const gap = 3;
  const totalGap = gap * (barCount - 1);
  const barWidth = Math.max(3, (w - totalGap - 8) / barCount);
  const startX = 4;

  for (let i = 0; i < barCount; i++) {
    const dataIdx = Math.min(63, Math.floor(Math.pow(i / barCount, 1.4) * 56));
    const val = freq[dataIdx] || 0;
    const norm = val / 255;
    const barHeight = Math.max(2, norm * (h - 10));

    const x = startX + i * (barWidth + gap);
    const y = h - barHeight - 4;

    if (norm > peaks[i]) {
      peaks[i] = norm;
    } else {
      peaks[i] = Math.max(0, peaks[i] - 0.015);
    }

    const grad = ctx.createLinearGradient(0, h, 0, 0);
    grad.addColorStop(0, 'rgba(180, 83, 9, 0.4)');
    grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.85)');
    grad.addColorStop(1, 'rgba(253, 230, 138, 0.95)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
    ctx.fill();

    const peakY = h - peaks[i] * (h - 10) - 4;
    ctx.fillStyle = peaks[i] > 0.85 ? '#ef4444' : '#fef08a';
    ctx.fillRect(x, Math.max(2, peakY), barWidth, 1.5);
  }
}

function drawAnalogVUMeters(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  freq: Uint8Array,
  active: boolean,
  meter: MeterState
) {
  let sumL = 0;
  let sumR = 0;
  const half = Math.floor(freq.length / 2);

  for (let i = 0; i < half; i++) {
    sumL += (freq[i] / 255) ** 2;
    sumR += (freq[half + i] / 255) ** 2;
  }

  const targetL = active ? Math.sqrt(sumL / half) * 1.35 : 0;
  const targetR = active ? Math.sqrt(sumR / half) * 1.35 : 0;

  meter.leftVal += (targetL - meter.leftVal) * (targetL > meter.leftVal ? 0.35 : 0.12);
  meter.rightVal += (targetR - meter.rightVal) * (targetR > meter.rightVal ? 0.35 : 0.12);

  const meterW = (w - 14) / 2;
  drawSingleVU(ctx, 4, 3, meterW, h - 6, meter.leftVal, 'CH-1 (L)');
  drawSingleVU(ctx, 4 + meterW + 6, 3, meterW, h - 6, meter.rightVal, 'CH-2 (R)');
}

function drawOscilloscope(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  wave: Uint8Array,
  active: boolean
) {
  // 1. CRT Enclosure Bezel & Screen Base
  ctx.fillStyle = '#050c08';
  ctx.strokeStyle = '#132e1e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(3, 2, w - 6, h - 4, 5);
  ctx.fill();
  ctx.stroke();

  const innerX = 5;
  const innerY = 4;
  const innerW = w - 10;
  const innerH = h - 8;
  const midY = innerY + innerH / 2;
  const midX = innerX + innerW / 2;

  // 2. Phosphor Graticule Reticle (divisions)
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.lineWidth = 0.75;

  // Horizontal graticule divisions
  for (let div = 1; div < 4; div++) {
    const y = innerY + (innerH * div) / 4;
    ctx.beginPath();
    ctx.moveTo(innerX, y);
    ctx.lineTo(innerX + innerW, y);
    ctx.stroke();
  }

  // Vertical graticule divisions
  for (let div = 1; div < 6; div++) {
    const x = innerX + (innerW * div) / 6;
    ctx.beginPath();
    ctx.moveTo(x, innerY);
    ctx.lineTo(x, innerY + innerH);
    ctx.stroke();
  }

  // Center Crosshair Axis with Division Sub-ticks
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.28)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(innerX, midY);
  ctx.lineTo(innerX + innerW, midY);
  ctx.stroke();

  // Baseline tick marks (every 12px along center line)
  ctx.beginPath();
  for (let x = innerX; x <= innerX + innerW; x += 12) {
    ctx.moveTo(x, midY - 1.5);
    ctx.lineTo(x, midY + 1.5);
  }
  for (let y = innerY; y <= innerY + innerH; y += 6) {
    ctx.moveTo(midX - 1.5, y);
    ctx.lineTo(midX + 1.5, y);
  }
  ctx.stroke();

  // 3. Trigger / Zero-Crossing Detection for Waveform Stabilization
  let startIndex = 0;
  if (active && wave.length > 0) {
    // Find rising edge crossing 128 (center zero-line)
    const searchLimit = Math.min(48, Math.floor(wave.length / 2));
    for (let i = 0; i < searchLimit - 1; i++) {
      if (wave[i] < 128 && wave[i + 1] >= 128) {
        startIndex = i;
        break;
      }
    }
  }

  const available = wave.length - startIndex;
  const step = Math.max(1, available / innerW);

  // 4. Waveform Path Construction
  const path = new Path2D();
  if (active && available > 1) {
    for (let x = 0; x < innerW; x++) {
      const idx = Math.min(wave.length - 1, startIndex + Math.floor(x * step));
      const val = wave[idx] ?? 128;
      const normalized = (val - 128) / 128; // -1 to +1
      const y = Math.max(innerY + 1, Math.min(innerY + innerH - 1, midY - normalized * (innerH * 0.44)));
      if (x === 0) {
        path.moveTo(innerX + x, y);
      } else {
        path.lineTo(innerX + x, y);
      }
    }
  } else {
    // Idle state: Subtle micro-drift line simulating phono cartridge noise floor
    const t = performance.now() * 0.002;
    for (let x = 0; x < innerW; x++) {
      const drift = Math.sin(t + x * 0.1) * 0.6;
      const y = midY + drift;
      if (x === 0) path.moveTo(innerX + x, y);
      else path.lineTo(innerX + x, y);
    }
  }

  // 5. Cathode Ray Tube Phosphor Beam Rendering
  // Pass 1: Phosphor Bloom (Aura)
  ctx.save();
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 5;
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(path);
  ctx.restore();

  // Pass 2: Sharp Core Electron Beam
  ctx.save();
  ctx.strokeStyle = active ? '#d1fae5' : '#6ee7b7';
  ctx.lineWidth = 1.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(path);
  ctx.restore();

  // 6. Vintage Graticule Legend
  ctx.fillStyle = 'rgba(52, 211, 153, 0.6)';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('OSC 10ms', innerX + 4, innerY + 8);

  ctx.textAlign = 'right';
  ctx.fillText(active ? 'TRIG LOCK' : 'GND 0V', innerX + innerW - 4, innerY + 8);
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  className = '',
  mode: controlledMode,
  onModeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalMode, setInternalMode] = useState<VisualizerMode>(() => {
    try {
      const saved = localStorage.getItem('melodex_visualizer_mode');
      if (saved === 'spectrum' || saved === 'vu' || saved === 'oscilloscope') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'spectrum';
  });

  const activeMode = controlledMode ?? internalMode;

  const handleModeSelect = (newMode: VisualizerMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
    try {
      localStorage.setItem('melodex_visualizer_mode', newMode);
    } catch {
      // ignore
    }
  };

  const cycleMode = () => {
    const modes: VisualizerMode[] = ['spectrum', 'vu', 'oscilloscope'];
    const nextIdx = (modes.indexOf(activeMode) + 1) % modes.length;
    handleModeSelect(modes[nextIdx]);
  };

  const animFrameRef = useRef<number>(0);

  const meterRef = useRef<MeterState>({
    leftVal: 0,
    rightVal: 0,
    peaks: new Array(32).fill(0),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const freqArray = new Uint8Array(64);
    const waveArray = new Uint8Array(128);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        audioEngine.getVisualizerData(freqArray, waveArray);
      } else {
        for (let i = 0; i < freqArray.length; i++) {
          freqArray[i] = Math.max(0, Math.floor(freqArray[i] * 0.9));
        }
      }

      if (activeMode === 'spectrum') {
        drawSpectrum(ctx, width, height, freqArray, meterRef.current.peaks);
      } else if (activeMode === 'vu') {
        drawAnalogVUMeters(ctx, width, height, freqArray, isPlaying, meterRef.current);
      } else {
        drawOscilloscope(ctx, width, height, waveArray, isPlaying);
      }

      ctx.restore();
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, activeMode]);

  return (
    <div className={`relative flex items-center bg-zinc-950/70 border border-zinc-900 rounded-xl px-2.5 py-1.5 ${className}`}>
      <div className="flex items-center gap-1.5 mr-2">
        <button
          onClick={() => handleModeSelect('spectrum')}
          title="Spectrum Analyzer"
          className={`p-1 rounded cursor-pointer transition-colors ${
            activeMode === 'spectrum' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-600 hover:text-zinc-300'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleModeSelect('vu')}
          title="Analog Stereo VU Meter"
          className={`p-1 rounded cursor-pointer transition-colors ${
            activeMode === 'vu' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-600 hover:text-zinc-300'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleModeSelect('oscilloscope')}
          title="Retro CRT Oscilloscope (Press V to toggle)"
          className={`p-1 rounded cursor-pointer transition-colors ${
            activeMode === 'oscilloscope' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-600 hover:text-zinc-300'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-36 sm:w-44 h-9 block cursor-pointer"
        onClick={cycleMode}
        title="Click to toggle visualizer style (Spectrum / VU / Oscilloscope) [V]"
      />
    </div>
  );
};
