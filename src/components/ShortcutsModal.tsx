import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  key: string;
  desc: string;
  category: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { key: 'Space', desc: 'Play / Pause motor and audio', category: 'Playback' },
  { key: '← / →', desc: 'Seek 5 seconds backward / forward', category: 'Playback' },
  { key: '↑ / ↓', desc: 'Volume up / down (5%)', category: 'Audio' },
  { key: 'M', desc: 'Mute / unmute audio', category: 'Audio' },
  { key: 'C', desc: 'Toggle tonearm cueing lever', category: 'Turntable' },
  { key: '3 / 4', desc: 'Switch speed (33⅓ / 45 RPM)', category: 'Turntable' },
  { key: 'S', desc: 'Toggle shuffle mode', category: 'Playback' },
  { key: 'R', desc: 'Toggle repeat track', category: 'Playback' },
  { key: 'E', desc: 'Open / close Tone Equalizer', category: 'Audio' },
  { key: '?', desc: 'Show / hide keyboard shortcuts', category: 'General' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#141318] to-[#0a0a0d] border border-zinc-800 rounded-2xl shadow-2xl p-5 text-zinc-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 font-serif tracking-wide">
                Keyboard Shortcuts
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono">Quick Physical Deck Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-900"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15">
                  {item.category}
                </span>
                <span className="text-xs text-zinc-300">{item.desc}</span>
              </div>
              <kbd className="px-2.5 py-1 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono font-bold text-amber-300 shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-900 text-center">
          <p className="text-[10px] font-mono text-zinc-600">
            Press <kbd className="text-amber-400 font-bold">?</kbd> anywhere to toggle this guide
          </p>
        </div>
      </div>
    </div>
  );
};
