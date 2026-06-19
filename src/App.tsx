import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat,
  Volume2, VolumeX, Search, FolderOpen, Upload, Disc,
  Music, Sparkles, Zap,
} from 'lucide-react';
import { Track, TurntableSettings, PlaybackState } from './types';
import { audioEngine } from './utils/audioEngine';
import { Turntable3D } from './components/Turntable3D';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [settings, setSettings] = useState<TurntableSettings>({
    pitch: 0.0, speed: 33, cueingLeverUp: true,
    crackleVolume: 0.42, isGrabbingHeadshell: false,
  });
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const activeTrack = tracks[activeTrackIndex] ?? null;

  useEffect(() => { audioEngine.setVolume(isMuted ? 0 : volume); }, [volume, isMuted]);
  useEffect(() => { audioEngine.setCrackleVolume(settings.crackleVolume); }, [settings.crackleVolume]);
  useEffect(() => {
    audioEngine.setPitch(settings.pitch);
    audioEngine.setSpeedMode(settings.speed);
  }, [settings.pitch, settings.speed]);

  useEffect(() => {
    audioEngine.setVolume(volume);
    audioEngine.setCrackleVolume(settings.crackleVolume);
    audioEngine.onTimeUpdate = (cur, tot) => {
      setCurrentTime(cur);
      if (tot && isFinite(tot)) setDuration(tot);
    };
    audioEngine.onEnded = () => handleNextTrack();
    if (activeTrack) audioEngine.setTrack(activeTrack);
  }, []);

  const handlePlay = () => {
    if (!activeTrack) return;
    setSettings(p => ({ ...p, cueingLeverUp: false }));
    setPlaybackState('playing');
    audioEngine.play();
  };

  const handlePause = () => {
    setSettings(p => ({ ...p, cueingLeverUp: true }));
    setPlaybackState('paused');
    audioEngine.pause();
  };

  const handleNeedleDrop = (progress: number) => {
    if (!activeTrack) return;
    setSettings(p => ({ ...p, cueingLeverUp: false }));
    setPlaybackState('playing');
    audioEngine.seek(progress * 100);
    audioEngine.play();
  };

  const handleNeedleLift = () => handlePause();

  const handleNextTrack = () => {
    if (isRepeat) { audioEngine.seek(0); audioEngine.play(); return; }
    const next = isShuffled
      ? Math.floor(Math.random() * tracks.length)
      : (activeTrackIndex + 1) % tracks.length;
    selectAndPlayTrack(next);
  };

  const handlePrevTrack = () => {
    if (currentTime > 4) { audioEngine.seek(0); return; }
    const prev = isShuffled
      ? Math.floor(Math.random() * tracks.length)
      : (activeTrackIndex - 1 + tracks.length) % tracks.length;
    selectAndPlayTrack(prev);
  };

  const selectAndPlayTrack = async (index: number) => {
    if (index < 0 || index >= tracks.length) return;
    setActiveTrackIndex(index);
    setSettings(p => ({ ...p, cueingLeverUp: true }));
    setPlaybackState('stopped');
    setCurrentTime(0); setDuration(0);
    await audioEngine.setTrack(tracks[index]);
    setTimeout(() => {
      setSettings(p => ({ ...p, cueingLeverUp: false }));
      setPlaybackState('playing');
      audioEngine.play();
    }, 460);
  };

  const handleSettingsFrom3D = (incoming: Partial<TurntableSettings & { isPlaying?: boolean; speedMode?: 33 | 45 }>) => {
    setSettings(prev => {
      const merged = { ...prev, ...incoming } as TurntableSettings;
      if ('speedMode' in incoming) { merged.speed = (incoming as any).speedMode; audioEngine.setSpeedMode(merged.speed); }
      if ('isPlaying' in incoming) {
        if (incoming.isPlaying) { merged.cueingLeverUp = false; setPlaybackState('playing'); audioEngine.play(); }
        else { merged.cueingLeverUp = true; setPlaybackState('paused'); audioEngine.pause(); }
      } else if ('cueingLeverUp' in incoming) {
        if (incoming.cueingLeverUp) { setPlaybackState('paused'); audioEngine.pause(); }
        else { setPlaybackState('playing'); audioEngine.play(); }
      }
      return merged;
    });
  };

  const AUDIO_EXTS = ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac', '.opus'];
  const buildTrack = (file: File, idx: number, album = 'Local Folder'): Track => ({
    id: `track_${idx}_${Date.now()}`,
    title: file.name.replace(/\.[^.]+$/, '').replace(/^\d+[\s._-]+/, '').trim() || file.name,
    artist: 'Local', album, duration: 0,
    url: URL.createObjectURL(file), file,
  });

  const handleOpenFolder = async () => {
    if (!('showDirectoryPicker' in window)) { folderInputRef.current?.click(); return; }
    try {
      const dir = await (window as any).showDirectoryPicker({ mode: 'read' });
      const loaded: Track[] = [];
      for await (const entry of dir.values()) {
        if (entry.kind === 'file') {
          const ext = entry.name.substring(entry.name.lastIndexOf('.')).toLowerCase();
          if (AUDIO_EXTS.includes(ext)) {
            const f = await entry.getFile();
            loaded.push(buildTrack(f, loaded.length, dir.name));
          }
        }
      }
      if (loaded.length) {
        setTracks(loaded); setActiveTrackIndex(0); setCurrentTime(0); setDuration(0);
        await audioEngine.setTrack(loaded[0]);
      }
    } catch { folderInputRef.current?.click(); }
  };

  const handleFolderFallback = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const loaded: Track[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      if (AUDIO_EXTS.includes(ext) || f.type.startsWith('audio/')) loaded.push(buildTrack(f, loaded.length));
    }
    if (loaded.length) {
      setTracks(loaded); setActiveTrackIndex(0); setCurrentTime(0); setDuration(0);
      await audioEngine.setTrack(loaded[0]);
    }
  };

  const handleFilesPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const loaded: Track[] = [];
    for (let i = 0; i < files.length; i++) loaded.push(buildTrack(files[i], i, 'My Collection'));
    if (loaded.length) {
      setTracks(loaded); setActiveTrackIndex(0); setCurrentTime(0); setDuration(0);
      await audioEngine.setTrack(loaded[0]);
    }
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const filteredTracks = tracks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.album ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const trackColors = ['from-violet-900/70','from-emerald-900/70','from-amber-900/70','from-rose-900/70','from-sky-900/70','from-fuchsia-900/70'];

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-b from-[#090809] via-[#050507] to-[#020103] font-sans antialiased text-[#e0dbd5] flex flex-col items-center justify-between p-4 md:p-5 select-none">
      <input ref={folderInputRef} type="file" className="hidden" onChange={handleFolderFallback}
        {...{ webkitdirectory: 'true', directory: 'true' } as any} />
      <input ref={fileInputRef} type="file" multiple accept="audio/*" className="hidden" onChange={handleFilesPick} />

      <div className="w-full max-w-6xl flex justify-between items-center py-2 border-b border-zinc-950/80 flex-shrink-0">
        <div>
          <span className="text-[9px] font-mono tracking-[0.22em] text-amber-600/80 font-semibold uppercase">High Fidelity Direct Drive</span>
          <h1 className="text-lg font-serif font-bold text-zinc-100 tracking-tight leading-none mt-0.5">Melodex</h1>
        </div>
        <div className="flex items-center gap-2">
          {tracks.length > 0 && (
            <div className="flex items-center gap-2">
              <button onClick={handleOpenFolder}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-xs text-amber-200/90 rounded-lg transition-all cursor-pointer">
                <FolderOpen className="w-3.5 h-3.5 text-amber-500/80" /><span>Change Folder</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md shadow-amber-500/15">
                <Upload className="w-3.5 h-3.5" /><span>Add Files</span>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 bg-zinc-950/90 rounded-full px-3 py-1 text-[10px] font-mono text-zinc-400 border border-zinc-900">
            <span className={`w-2 h-2 rounded-full ${playbackState === 'playing' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
            <span>{playbackState === 'playing' ? 'PLAYING' : 'STANDBY'}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl flex-1 flex flex-col md:flex-row items-stretch gap-4 my-3 overflow-hidden min-h-0">
        <div className="flex-[1.35] min-h-[220px] md:h-full rounded-2xl overflow-hidden border border-zinc-900/80 shadow-2xl bg-[#030205]/95 flex flex-col">
          <Turntable3D activeTrack={activeTrack} isPlaying={playbackState === 'playing'} pitch={settings.pitch}
            speedMode={settings.speed} cueingLeverUp={settings.cueingLeverUp} crackleVolume={settings.crackleVolume}
            onNeedleDrop={handleNeedleDrop} onNeedleLift={handleNeedleLift} onSettingsChange={handleSettingsFrom3D}
            currentTime={currentTime} duration={duration} />
        </div>

        <div className="flex-[0.85] md:h-full bg-gradient-to-b from-[#070709] to-[#040406] border border-zinc-900/80 rounded-2xl p-4 flex flex-col overflow-hidden shadow-2xl">
          {tracks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 p-4 animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800/60 flex items-center justify-center shadow-xl">
                <Disc className="w-7 h-7 text-amber-500/70" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-semibold text-zinc-100 tracking-wide">No vinyl loaded</h3>
                <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed mt-1.5">Open a local folder or pick individual audio files to start playing.</p>
              </div>
              <div className="flex flex-col w-full gap-2 px-2 mt-1">
                <button onClick={handleOpenFolder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20">
                  <FolderOpen className="w-4 h-4" /><span>Open Local Music Folder</span>
                </button>
                <div className="text-center text-[10px] text-zinc-600 font-mono">or</div>
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20">
                  <Upload className="w-4 h-4" /><span>Choose Audio Files</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 gap-3">
              <div className="flex items-center justify-between flex-shrink-0">
                <span className="text-[9px] font-mono font-semibold tracking-[0.18em] text-zinc-500 uppercase">Record Shelf</span>
                <span className="text-[9px] font-mono text-zinc-600">{filteredTracks.length} / {tracks.length}</span>
              </div>
              <div className="relative flex-shrink-0">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-600" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tracks, artist…"
                  className="w-full bg-zinc-950/80 border border-zinc-900 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/15 text-zinc-200 text-xs pl-9 pr-9 py-2 rounded-xl transition-all outline-none placeholder-zinc-600" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2 text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">clear</button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 min-h-0 pr-0.5 scrollbar-none">
                {filteredTracks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-600 border border-dashed border-zinc-900 rounded-xl">
                    <Music className="w-5 h-5 opacity-30 mb-2" /><span className="text-[11px]">No tracks match your search.</span>
                  </div>
                ) : filteredTracks.map(track => {
                  const origIdx = tracks.findIndex(t => t.id === track.id);
                  const isActive = origIdx === activeTrackIndex;
                  return (
                    <div key={track.id} onClick={() => isActive ? (playbackState === 'playing' ? handlePause() : handlePlay()) : selectAndPlayTrack(origIdx)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group ${isActive ? 'bg-zinc-900/80 border-amber-500/50 shadow-md' : 'bg-zinc-950/20 border-zinc-950 hover:bg-zinc-900/30 hover:border-zinc-900'}`}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${trackColors[origIdx % trackColors.length]} to-zinc-950 border border-zinc-900/80 flex items-center justify-center flex-shrink-0 shadow-inner`}>
                        <Disc className={`w-3.5 h-3.5 text-zinc-400 opacity-75 ${isActive && playbackState === 'playing' ? 'animate-spin' : ''}`} style={{ animationDuration: '2.5s' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate leading-none mb-0.5 ${isActive ? 'text-amber-200' : 'text-zinc-200 group-hover:text-zinc-100'}`}>{track.title}</p>
                        <p className="text-[10px] text-zinc-500 truncate leading-none">{track.artist}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1 pl-1">
                        {isActive && playbackState === 'playing' ? (
                          <div className="flex items-end gap-[2px] h-4">
                            <span className="w-[2px] bg-amber-400 rounded-full wave-bar-1" />
                            <span className="w-[2px] bg-amber-400 rounded-full wave-bar-2" />
                            <span className="w-[2px] bg-amber-400 rounded-full wave-bar-3" />
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-600">{fmt(track.duration || 0)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex-shrink-0 rounded-xl bg-gradient-to-r from-[#0c0c10] via-[#090910] to-[#070709] border border-zinc-900/80 shadow-2xl flex flex-col md:flex-row items-center gap-3 px-4 py-3 mb-1">
        <div className="flex items-center gap-3 w-full md:w-56 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center flex-shrink-0">
            {playbackState === 'playing' ? <Disc className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '2.2s' }} /> : <Music className="w-4 h-4 text-zinc-600" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif font-semibold text-zinc-100 text-xs truncate leading-none mb-1">{activeTrack ? activeTrack.title : 'No track loaded'}</p>
            <p className="text-zinc-500 text-[10px] truncate leading-none">{activeTrack ? activeTrack.artist : 'Open a folder to begin'}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsShuffled(s => !s)} title="Shuffle"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${isShuffled ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'}`}>
              <Shuffle className="w-3.5 h-3.5" />
            </button>
            <button onClick={handlePrevTrack} disabled={tracks.length === 0}
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 active:scale-90 disabled:opacity-25 transition-all cursor-pointer">
              <SkipBack className="w-4 h-4" />
            </button>
            {playbackState === 'playing' ? (
              <button onClick={handlePause}
                className="p-3 rounded-full bg-amber-500/90 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10 active:scale-95 transition-all cursor-pointer">
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button onClick={handlePlay} disabled={tracks.length === 0}
                className="p-3 rounded-full bg-amber-500/90 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-30 transition-all cursor-pointer">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            )}
            <button onClick={handleNextTrack} disabled={tracks.length === 0}
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 active:scale-90 disabled:opacity-25 transition-all cursor-pointer">
              <SkipForward className="w-4 h-4" />
            </button>
            <button onClick={() => setIsRepeat(r => !r)} title="Repeat"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${isRepeat ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'}`}>
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-full flex items-center gap-2 max-w-sm">
            <span className="text-[9px] font-mono text-zinc-600 w-7 text-right">{fmt(currentTime)}</span>
            <div className="flex-1 h-1 bg-zinc-900 rounded-full relative cursor-pointer overflow-hidden"
              onClick={e => {
                if (!activeTrack || !duration) return;
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                audioEngine.seek(((e.clientX - rect.left) / rect.width) * 100);
              }}>
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[9px] font-mono text-zinc-600 w-7">{fmt(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 border-t md:border-t-0 border-zinc-950 pt-2 md:pt-0 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-zinc-600 font-semibold uppercase tracking-wider">RPM</span>
            <button onClick={() => setSettings(s => ({ ...s, speed: s.speed === 33 ? 45 : 33 }))}
              className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono font-bold px-2 py-0.5 rounded-md border border-zinc-800 transition-colors cursor-pointer">
              {settings.speed}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-500/60 flex-shrink-0" />
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider hidden sm:inline">Crackle</span>
            <input type="range" min="0" max="1" step="0.01" value={settings.crackleVolume}
              onChange={e => setSettings(p => ({ ...p, crackleVolume: parseFloat(e.target.value) }))}
              className="w-16 sm:w-20 accent-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(m => !m)} className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer flex-shrink-0">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input type="range" min="0" max="1" step="0.01" value={volume}
              onChange={e => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="w-16 sm:w-20 accent-amber-500" />
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-zinc-600 flex-shrink-0" />
            <input type="range" min="-8" max="8" step="0.1" value={settings.pitch}
              onChange={e => setSettings(p => ({ ...p, pitch: parseFloat(e.target.value) }))}
              className="w-14 accent-amber-500"
              title={`Pitch: ${settings.pitch > 0 ? '+' : ''}${settings.pitch.toFixed(1)}%`} />
            <span className="text-[9px] font-mono text-zinc-600 w-8">
              {settings.pitch > 0 ? '+' : ''}{settings.pitch.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
