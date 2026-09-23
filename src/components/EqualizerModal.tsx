import React from 'react';
import { Sliders, X, RotateCcw, Flame, Waves } from 'lucide-react';
import { EQSettings, AnalogFXSettings } from '../types';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eq: EQSettings;
  onChange: (eq: EQSettings) => void;
  analogFX: AnalogFXSettings;
  onAnalogFXChange: (fx: AnalogFXSettings) => void;
}

interface EQPreset {
  name: string;
  label: string;
  settings: EQSettings;
}

const PRESETS: EQPreset[] = [
  { name: 'flat', label: 'Flat', settings: { bass: 0, mid: 0, treble: 0 } },
  { name: 'warm', label: 'Warm Vinyl', settings: { bass: 3.5, mid: 1.0, treble: -2.0 } },
  { name: 'bass', label: 'Bass Punch', settings: { bass: 6.0, mid: 0.5, treble: 1.5 } },
  { name: 'vocal', label: 'Vocal Clarity', settings: { bass: -1.5, mid: 4.0, treble: 2.5 } },
  { name: 'acoustic', label: 'Acoustic / Jazz', settings: { bass: 2.0, mid: 2.5, treble: 3.0 } },
];

interface AnalogPreset {
  name: string;
  label: string;
  settings: AnalogFXSettings;
}

const ANALOG_PRESETS: AnalogPreset[] = [
  { name: 'clean', label: 'Pristine Digital', settings: { warmth: 0, flutter: 0 } },
  { name: 'vinyl', label: 'Vintage Vinyl', settings: { warmth: 0.35, flutter: 0.25 } },
  { name: 'tube', label: 'Warm Tube Amp', settings: { warmth: 0.65, flutter: 0.1 } },
  { name: 'lofi', label: 'Worn Tape / Lo-Fi', settings: { warmth: 0.55, flutter: 0.6 } },
];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  eq,
  onChange,
  analogFX,
  onAnalogFXChange,
}) => {
  if (!isOpen) return null;

  const handleSliderChange = (band: keyof EQSettings, val: number) => {
    onChange({
      ...eq,
      [band]: val,
    });
  };

  const handleReset = () => {
    onChange({ bass: 0, mid: 0, treble: 0 });
    onAnalogFXChange({ warmth: 0, flutter: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-gradient-to-b from-[#141318] to-[#0a0a0d] border border-zinc-800 rounded-2xl shadow-2xl p-5 text-zinc-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 font-serif tracking-wide">Audiophile Sound Console</h2>
              <p className="text-[10px] text-zinc-500 font-mono">Biquad EQ &amp; Analog Warmth FX</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Reset all EQ and Analog FX to flat"
              className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini EQ Response Curve */}
        <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-3 mb-4">
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 mb-1.5">
            <span>100 Hz (Low)</span>
            <span>1 kHz (Mid)</span>
            <span>8 kHz (High)</span>
          </div>
          <div className="h-12 w-full relative flex items-center">
            {/* Center zero line */}
            <div className="absolute w-full h-[1px] bg-zinc-800" />
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 60">
              <path
                d={`M 0,${30 - (eq.bass / 12) * 24} Q 150,${30 - (eq.mid / 12) * 24} 300,${
                  30 - (eq.treble / 12) * 24
                }`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
            </svg>
          </div>
        </div>

        {/* Faders */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Bass */}
          <div className="flex flex-col items-center bg-zinc-950/50 border border-zinc-900/90 rounded-xl p-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-0.5">
              Bass
            </span>
            <span className="text-[11px] font-mono text-zinc-400 mb-2">
              {eq.bass > 0 ? `+${eq.bass.toFixed(1)}` : eq.bass.toFixed(1)} dB
            </span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eq.bass}
              onChange={(e) => handleSliderChange('bass', parseFloat(e.target.value))}
              className="w-20 accent-amber-500 -rotate-90 my-7 cursor-pointer"
            />
            <span className="text-[9px] font-mono text-zinc-600 mt-1">100 Hz</span>
          </div>

          {/* Mid */}
          <div className="flex flex-col items-center bg-zinc-950/50 border border-zinc-900/90 rounded-xl p-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-0.5">
              Mid
            </span>
            <span className="text-[11px] font-mono text-zinc-400 mb-2">
              {eq.mid > 0 ? `+${eq.mid.toFixed(1)}` : eq.mid.toFixed(1)} dB
            </span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eq.mid}
              onChange={(e) => handleSliderChange('mid', parseFloat(e.target.value))}
              className="w-20 accent-amber-500 -rotate-90 my-7 cursor-pointer"
            />
            <span className="text-[9px] font-mono text-zinc-600 mt-1">1 kHz</span>
          </div>

          {/* Treble */}
          <div className="flex flex-col items-center bg-zinc-950/50 border border-zinc-900/90 rounded-xl p-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-0.5">
              Treble
            </span>
            <span className="text-[11px] font-mono text-zinc-400 mb-2">
              {eq.treble > 0 ? `+${eq.treble.toFixed(1)}` : eq.treble.toFixed(1)} dB
            </span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eq.treble}
              onChange={(e) => handleSliderChange('treble', parseFloat(e.target.value))}
              className="w-20 accent-amber-500 -rotate-90 my-7 cursor-pointer"
            />
            <span className="text-[9px] font-mono text-zinc-600 mt-1">8 kHz</span>
          </div>
        </div>

        {/* Tone Presets */}
        <div className="mb-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
            Tone Presets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => {
              const isActive =
                eq.bass === preset.settings.bass &&
                eq.mid === preset.settings.mid &&
                eq.treble === preset.settings.treble;
              return (
                <button
                  key={preset.name}
                  onClick={() => onChange(preset.settings)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Analog Warmth & Drift Section */}
        <div className="pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-orange-400" />
              Analog Character &amp; Drift
            </span>
            <span className="text-[9px] font-mono text-zinc-600">DSP Harmonics</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Tube Warmth */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-2.5 rounded-xl">
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" /> Tube Warmth
                </span>
                <span className="text-amber-400 font-bold">{Math.round(analogFX.warmth * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={analogFX.warmth}
                onChange={(e) => onAnalogFXChange({ ...analogFX, warmth: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[9px] text-zinc-600 font-mono block mt-1">Soft Saturation</span>
            </div>

            {/* Wow & Flutter */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-2.5 rounded-xl">
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Waves className="w-3 h-3 text-sky-400" /> Wow &amp; Flutter
                </span>
                <span className="text-sky-400 font-bold">{Math.round(analogFX.flutter * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={analogFX.flutter}
                onChange={(e) => onAnalogFXChange({ ...analogFX, flutter: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[9px] text-zinc-600 font-mono block mt-1">Belt Speed Drift</span>
            </div>
          </div>

          {/* Analog Presets */}
          <div className="flex flex-wrap gap-1.5">
            {ANALOG_PRESETS.map((preset) => {
              const isActive =
                Math.abs(analogFX.warmth - preset.settings.warmth) < 0.05 &&
                Math.abs(analogFX.flutter - preset.settings.flutter) < 0.05;
              return (
                <button
                  key={preset.name}
                  onClick={() => onAnalogFXChange(preset.settings)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
