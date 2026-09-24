import React, { useRef } from 'react';
import { X, Disc, Download, Heart, Clock, Upload } from 'lucide-react';
import { Track } from '../types';

interface VinylJacketModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (track: Track) => void;
  playCount: number;
  lastPlayed: number;
  onUpdateCoverUrl?: (trackId: string, newCoverUrl: string) => void;
}

export const VinylJacketModal: React.FC<VinylJacketModalProps> = ({
  track,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  playCount,
  lastPlayed,
  onUpdateCoverUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !track) return null;

  const fmt = (s: number) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const getFormatLabel = () => {
    if (track.file?.name) {
      const ext = track.file.name.substring(track.file.name.lastIndexOf('.')).toUpperCase();
      return ext.replace('.', '') || 'AUDIO';
    }
    if (track.isDemo) return 'SYNTH WAV / PCM';
    return 'DIGITAL AUDIO';
  };

  const getFileSizeLabel = () => {
    if (track.file?.size) {
      const mb = track.file.size / (1024 * 1024);
      return `${mb.toFixed(2)} MB`;
    }
    if (track.isDemo) return 'Virtual Procedural LP';
    return 'Local Stream';
  };

  const handleDownloadCover = () => {
    if (!track.coverUrl) return;
    const a = document.createElement('a');
    a.href = track.coverUrl;
    a.download = `${track.artist} - ${track.title} [Cover].jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newUrl = URL.createObjectURL(file);
    onUpdateCoverUrl?.(track.id, newUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#18161b] via-[#100f13] to-[#0a0a0d] border border-zinc-800/90 rounded-3xl shadow-2xl p-6 text-zinc-200 my-auto overflow-hidden">
        {/* Subtle cardboard grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #000000 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-full transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gatefold Jacket Container */}
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          {/* Left: 12" Vinyl Jacket Front Sleeve */}
          <div className="w-full md:w-64 flex flex-col items-center flex-shrink-0">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border border-zinc-700/60 shadow-2xl bg-zinc-950 group">
              {track.coverUrl ? (
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-amber-950/40 via-zinc-950 to-zinc-950">
                  <Disc className="w-16 h-16 text-amber-500/60 mb-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-xs font-serif font-bold text-amber-400/90">MELODEX ARCHIVE</span>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1">High Fidelity Vinyl Pressing</span>
                </div>
              )}

              {/* Glossy Vinyl Sleeve Ring-Wear Overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, transparent 48%, rgba(255,255,255,0.06) 64%, rgba(0,0,0,0.4) 95%)',
                }}
              />

              {/* Top Banner: Vintage Stereo Label */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-zinc-300">
                <span>STEREO LP</span>
                <span>33⅓ RPM</span>
              </div>
            </div>

            {/* Sleeve Spine Label */}
            <div className="w-full flex items-center justify-between mt-3 px-2 text-[9px] font-mono text-zinc-500">
              <span className="truncate max-w-[170px]">{track.artist} — {track.title}</span>
              <span className="text-amber-500/80 font-bold">12&quot; LP</span>
            </div>
          </div>

          {/* Right: Liner Notes & Audio Specifications */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-amber-500/80 font-semibold uppercase block mb-1">
                    Original Master Recording
                  </span>
                  <h2 className="text-xl font-serif font-bold text-zinc-100 tracking-tight leading-snug">
                    {track.title}
                  </h2>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">{track.artist}</p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">{track.album || 'Standard Vinyl Edition'}</p>
                </div>

                <button
                  onClick={() => onToggleFavorite(track)}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono">
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-xl p-2.5">
                  <span className="text-zinc-500 block text-[9px] uppercase">Format</span>
                  <span className="text-zinc-200 font-bold text-xs">{getFormatLabel()}</span>
                </div>
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-xl p-2.5">
                  <span className="text-zinc-500 block text-[9px] uppercase">Side Duration</span>
                  <span className="text-zinc-200 font-bold text-xs">{fmt(track.duration || 0)}</span>
                </div>
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-xl p-2.5">
                  <span className="text-zinc-500 block text-[9px] uppercase">Audio Payload</span>
                  <span className="text-zinc-200 font-bold text-xs truncate block">{getFileSizeLabel()}</span>
                </div>
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-xl p-2.5">
                  <span className="text-zinc-500 block text-[9px] uppercase">Play Count</span>
                  <span className="text-amber-400 font-bold text-xs">{playCount} spins</span>
                </div>
              </div>

              {/* Playback History Notes */}
              <div className="mt-3 bg-zinc-950/40 border border-zinc-900/80 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  Last Spun:
                </span>
                <span className="text-zinc-300">
                  {lastPlayed ? new Date(lastPlayed).toLocaleString() : 'Never dropped'}
                </span>
              </div>
            </div>

            {/* Actions: Cover Artwork Management */}
            <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-mono transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Cover</span>
              </button>

              {track.coverUrl && (
                <button
                  onClick={handleDownloadCover}
                  title="Download Cover Artwork"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
