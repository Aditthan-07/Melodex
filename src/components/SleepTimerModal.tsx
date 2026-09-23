import React from 'react';
import { Moon, X, Clock, Check } from 'lucide-react';

export type SleepTimerOption = 0 | 15 | 30 | 45 | 60 | -1; // 0 = off, -1 = end of record

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimer: SleepTimerOption;
  remainingSeconds: number | null;
  onSelectOption: (option: SleepTimerOption) => void;
}

const TIMER_OPTIONS: { value: SleepTimerOption; label: string; desc: string }[] = [
  { value: 0, label: 'Off', desc: 'No automatic shut-off' },
  { value: -1, label: 'End of Record', desc: 'Auto-lift tonearm when current track ends' },
  { value: 15, label: '15 Minutes', desc: 'Runout fade & auto-stop in 15 minutes' },
  { value: 30, label: '30 Minutes', desc: 'Runout fade & auto-stop in 30 minutes' },
  { value: 45, label: '45 Minutes', desc: 'Runout fade & auto-stop in 45 minutes' },
  { value: 60, label: '60 Minutes', desc: 'Runout fade & auto-stop in 60 minutes' },
];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  currentTimer,
  remainingSeconds,
  onSelectOption,
}) => {
  if (!isOpen) return null;

  const formatRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#141318] to-[#0a0a0d] border border-zinc-800 rounded-2xl shadow-2xl p-5 text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 font-serif tracking-wide">
                Turntable Sleep Timer
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono">
                Vinyl Runout Fade &amp; Tonearm Auto-Return
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active status indicator */}
        {currentTimer !== 0 && (
          <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-xs font-mono text-indigo-200">
                {currentTimer === -1 ? 'Auto-stop at track end' : 'Timer Active'}
              </span>
            </div>
            {currentTimer > 0 && remainingSeconds !== null && (
              <span className="text-xs font-mono font-bold text-indigo-400">
                {formatRemaining(remainingSeconds)} remaining
              </span>
            )}
          </div>
        )}

        {/* Options list */}
        <div className="flex flex-col gap-1.5 mb-4">
          {TIMER_OPTIONS.map((opt) => {
            const isSelected = currentTimer === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onSelectOption(opt.value);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-200 shadow-sm'
                    : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg border ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isSelected ? 'text-indigo-100' : 'text-zinc-200'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-zinc-500">{opt.desc}</p>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mr-1" />
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-zinc-500 text-center font-mono">
          Stylus will automatically raise and volume smoothly fade out.
        </p>
      </div>
    </div>
  );
};
