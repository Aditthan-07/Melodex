import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat,
  Volume2, VolumeX, Search, FolderOpen, Upload, Disc,
  Music, Sparkles, Zap, Sliders, Keyboard, Heart, Clock, Moon,
} from 'lucide-react';
import { Track, TurntableSettings, PlaybackState, ShelfFilter } from './types';
import { audioEngine } from './utils/audioEngine';
import { Turntable3D } from './components/Turntable3D';
import { AudioVisualizer } from './components/AudioVisualizer';
import { EqualizerModal } from './components/EqualizerModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { SleepTimerModal, SleepTimerOption } from './components/SleepTimerModal';
import { generateDemoTracks } from './utils/demoGenerator';
import { extractAudioMetadata } from './utils/tagReader';

const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length);
};

const loadSavedSettings = (): TurntableSettings => {
  try {
    const raw = localStorage.getItem('melodex_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pitch: 0.0,
        speed: parsed.speed === 45 ? 45 : 33,
        cueingLeverUp: true,
        crackleVolume: typeof parsed.crackleVolume === 'number' ? parsed.crackleVolume : 0.42,
        isGrabbingHeadshell: false,
        theme: ['obsidian', 'walnut', 'silver', 'neon'].includes(parsed.theme) ? parsed.theme : 'obsidian',
        wax: ['classic', 'amber', 'ruby', 'neon'].includes(parsed.wax) ? parsed.wax : 'classic',
        eq: parsed.eq || { bass: 0, mid: 0, treble: 0 },
        analogFX: parsed.analogFX || { warmth: 0, flutter: 0 },
      };
    }
  } catch (err) {
    console.debug('Failed to load saved settings:', err);
  }
  return {
    pitch: 0.0,
    speed: 33,
    cueingLeverUp: true,
    crackleVolume: 0.42,
    isGrabbingHeadshell: false,
    theme: 'obsidian',
    wax: 'classic',
    eq: { bass: 0, mid: 0, treble: 0 },
    analogFX: { warmth: 0, flutter: 0 },
  };
};

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEQOpen, setIsEQOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [settings, setSettings] = useState<TurntableSettings>(loadSavedSettings);
  const [volume, setVolume] = useState(() => {
    try {
      const v = localStorage.getItem('melodex_volume');
      return v !== null ? parseFloat(v) : 0.8;
    } catch {
      return 0.8;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [hoverGroove, setHoverGroove] = useState<{ pct: number; time: number; zone: string } | null>(null);

  const getGrooveZone = (pct: number): string => {
    if (pct < 6) return 'Lead-in';
    if (pct < 38) return 'Outer Groove';
    if (pct < 75) return 'Mid Groove';
    return 'Inner Groove';
  };
  const [shelfFilter, setShelfFilter] = useState<ShelfFilter>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('melodex_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [playStats, setPlayStats] = useState<Record<string, { playCount: number; lastPlayed: number }>>(() => {
    try {
      const raw = localStorage.getItem('melodex_play_stats');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const getTrackKey = (t: Track): string => `${t.title}__${t.artist}`;
  const isTrackFavorite = (t: Track): boolean => favorites.includes(getTrackKey(t));

  const toggleFavorite = (t: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const key = getTrackKey(t);
    setFavorites(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      try {
        localStorage.setItem('melodex_favorites', JSON.stringify(next));
      } catch (err) {
        console.debug('Failed to save favorites:', err);
      }
      return next;
    });
  };

  const recordTrackPlay = (t: Track) => {
    const key = getTrackKey(t);
    setPlayStats(prev => {
      const current = prev[key] || { playCount: 0, lastPlayed: 0 };
      const updated = {
        ...prev,
        [key]: {
          playCount: current.playCount + 1,
          lastPlayed: Date.now(),
        },
      };
      try {
        localStorage.setItem('melodex_play_stats', JSON.stringify(updated));
      } catch (err) {
        console.debug('Failed to save play stats:', err);
      }
      return updated;
    });
  };

  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [sleepTimerOption, setSleepTimerOption] = useState<SleepTimerOption>(0);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const sleepTimerOptionRef = useRef<SleepTimerOption>(0);
  useEffect(() => {
    sleepTimerOptionRef.current = sleepTimerOption;
  }, [sleepTimerOption]);

  const triggerRunoutShutoff = useCallback(() => {
    let step = 0;
    const steps = 15;
    const startVol = isMuted ? 0 : volume;
    const fadeInterval = setInterval(() => {
      step++;
      const factor = Math.max(0, 1 - step / steps);
      audioEngine.setVolume(startVol * factor);
      if (step >= steps) {
        clearInterval(fadeInterval);
        setSettings(p => ({ ...p, cueingLeverUp: true }));
        setPlaybackState('stopped');
        audioEngine.pause();
        audioEngine.setVolume(startVol);
        setSleepTimerOption(0);
        setSleepTimerRemaining(null);
      }
    }, 150);
  }, [isMuted, volume]);

  const handleSelectSleepTimer = (opt: SleepTimerOption) => {
    setSleepTimerOption(opt);
    setSleepTimerRemaining(opt > 0 ? opt * 60 : null);
  };

  useEffect(() => {
    if (sleepTimerOption <= 0) return;
    const interval = setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          triggerRunoutShutoff();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerOption, triggerRunoutShutoff]);

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
    audioEngine.setEQ(settings.eq);
  }, [settings.eq]);
  useEffect(() => {
    audioEngine.setAnalogFX(settings.analogFX);
  }, [settings.analogFX]);

  const handleNextTrackRef = useRef<() => void>(() => {});

  useEffect(() => {
    audioEngine.onTimeUpdate = (cur, tot) => {
      setCurrentTime(cur);
      if (tot && isFinite(tot)) setDuration(tot);
    };
    audioEngine.onEnded = () => {
      if (sleepTimerOptionRef.current === -1) {
        triggerRunoutShutoff();
      } else {
        handleNextTrackRef.current();
      }
    };
  }, [triggerRunoutShutoff]);

  const handlePlay = () => {
    if (!activeTrack) return;
    recordTrackPlay(activeTrack);
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
    recordTrackPlay(activeTrack);
    setSettings(p => ({ ...p, cueingLeverUp: false }));
    setPlaybackState('playing');
    audioEngine.seek(progress * 100);
    audioEngine.play();
  };

  const handleNeedleLift = () => handlePause();

  const selectAndPlayTrack = async (index: number) => {
    if (index < 0 || index >= tracks.length) return;
    const target = tracks[index];
    recordTrackPlay(target);
    setActiveTrackIndex(index);
    setSettings(p => ({ ...p, cueingLeverUp: true }));
    setPlaybackState('stopped');
    setCurrentTime(0); setDuration(0);
    await audioEngine.setTrack(target);
    setTimeout(() => {
      setSettings(p => ({ ...p, cueingLeverUp: false }));
      setPlaybackState('playing');
      audioEngine.play();
    }, 460);
  };

  const handleNextTrack = () => {
    if (isRepeat) { audioEngine.seek(0); audioEngine.play(); return; }
    const next = isShuffled
      ? getRandomIndex(tracks.length)
      : (activeTrackIndex + 1) % tracks.length;
    selectAndPlayTrack(next);
  };

  useEffect(() => {
    handleNextTrackRef.current = handleNextTrack;
  });

  const handlePrevTrack = () => {
    if (currentTime > 4) { audioEngine.seek(0); return; }
    const prev = isShuffled
      ? getRandomIndex(tracks.length)
      : (activeTrackIndex - 1 + tracks.length) % tracks.length;
    selectAndPlayTrack(prev);
  };

  useEffect(() => {
    try {
      localStorage.setItem('melodex_settings', JSON.stringify({
        speed: settings.speed,
        crackleVolume: settings.crackleVolume,
        theme: settings.theme,
        wax: settings.wax,
        eq: settings.eq,
        analogFX: settings.analogFX,
      }));
    } catch (err) {
      console.debug('Failed to save settings:', err);
    }
  }, [settings.speed, settings.crackleVolume, settings.theme, settings.wax, settings.eq, settings.analogFX]);

  useEffect(() => {
    try {
      localStorage.setItem('melodex_volume', volume.toString());
    } catch (err) {
      console.debug('Failed to save volume:', err);
    }
  }, [volume]);

  const actionsRef = useRef({ handlePlay, handlePause, activeTrack, playbackState });
  useEffect(() => {
    actionsRef.current = { handlePlay, handlePause, activeTrack, playbackState };
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (actionsRef.current.playbackState === 'playing') {
          actionsRef.current.handlePause();
        } else {
          actionsRef.current.handlePlay();
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const cur = audioEngine.getCurrentTime();
        const dur = audioEngine.getDuration();
        if (dur > 0) {
          const targetPct = Math.max(0, ((cur - 5) / dur) * 100);
          audioEngine.seek(targetPct);
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const cur = audioEngine.getCurrentTime();
        const dur = audioEngine.getDuration();
        if (dur > 0) {
          const targetPct = Math.min(100, ((cur + 5) / dur) * 100);
          audioEngine.seek(targetPct);
        }
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(v => Math.min(1, parseFloat((v + 0.05).toFixed(2))));
        setIsMuted(false);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(v => Math.max(0, parseFloat((v - 0.05).toFixed(2))));
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(m => !m);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setSettings(s => {
          const nextUp = !s.cueingLeverUp;
          if (nextUp) {
            setPlaybackState('paused');
            audioEngine.pause();
          } else if (actionsRef.current.activeTrack) {
            setPlaybackState('playing');
            audioEngine.play();
          }
          return { ...s, cueingLeverUp: nextUp };
        });
      } else if (e.key === '3') {
        e.preventDefault();
        setSettings(s => ({ ...s, speed: 33 }));
      } else if (e.key === '4') {
        e.preventDefault();
        setSettings(s => ({ ...s, speed: 45 }));
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsShuffled(sh => !sh);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsRepeat(rp => !rp);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsEQOpen(o => !o);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(o => !o);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSettingsFrom3D = (incoming: Partial<TurntableSettings & { isPlaying?: boolean; speedMode?: 33 | 45 }>) => {
    setSettings(prev => {
      const merged: TurntableSettings = { ...prev, ...incoming };
      if (incoming.speedMode !== undefined) {
        merged.speed = incoming.speedMode;
        audioEngine.setSpeedMode(merged.speed);
      }
      if (incoming.isPlaying !== undefined) {
        if (incoming.isPlaying) {
          merged.cueingLeverUp = false;
          setPlaybackState('playing');
          audioEngine.play();
        } else {
          merged.cueingLeverUp = true;
          setPlaybackState('paused');
          audioEngine.pause();
        }
      } else if (incoming.cueingLeverUp !== undefined) {
        if (incoming.cueingLeverUp) {
          setPlaybackState('paused');
          audioEngine.pause();
        } else {
          setPlaybackState('playing');
          audioEngine.play();
        }
      }
      return merged;
    });
  };

  const AUDIO_EXTS = ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac', '.opus'];
  const buildTrack = async (file: File, idx: number, album = 'Local Folder'): Promise<Track> => {
    let title = file.name.replace(/\.[^.]+$/, '').replace(/^\d+[\s._-]+/, '').trim() || file.name;
    let artist = 'Local';
    let alb = album;
    let coverUrl: string | undefined;

    try {
      const meta = await extractAudioMetadata(file);
      if (meta.title) title = meta.title;
      if (meta.artist) artist = meta.artist;
      if (meta.album) alb = meta.album;
      if (meta.coverUrl) coverUrl = meta.coverUrl;
    } catch (e) {
      console.debug('Failed to parse metadata:', e);
    }

    return {
      id: `track_${idx}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      artist,
      album: alb,
      duration: 0,
      url: URL.createObjectURL(file),
      file,
      coverUrl,
    };
  };

  const handleOpenFolder = async () => {
    if (!('showDirectoryPicker' in window)) { folderInputRef.current?.click(); return; }
    try {
      const pickerWindow = window as unknown as {
        showDirectoryPicker: (options?: { mode?: string }) => Promise<FileSystemDirectoryHandle>;
      };
      const dir = await pickerWindow.showDirectoryPicker({ mode: 'read' });
      const loaded: Track[] = [];
      for await (const entry of dir.values()) {
        if (entry.kind === 'file') {
          const ext = entry.name.substring(entry.name.lastIndexOf('.')).toLowerCase();
          if (AUDIO_EXTS.includes(ext)) {
            const f = await entry.getFile();
            const track = await buildTrack(f, loaded.length, dir.name);
            loaded.push(track);
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
      if (AUDIO_EXTS.includes(ext) || f.type.startsWith('audio/')) {
        const track = await buildTrack(f, loaded.length);
        loaded.push(track);
      }
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
    for (let i = 0; i < files.length; i++) {
      const track = await buildTrack(files[i], i, 'My Collection');
      loaded.push(track);
    }
    if (loaded.length) {
      setTracks(loaded); setActiveTrackIndex(0); setCurrentTime(0); setDuration(0);
      await audioEngine.setTrack(loaded[0]);
    }
  };

  const handleLoadDemoTracks = async () => {
    const demos = generateDemoTracks();
    setTracks(demos);
    setActiveTrackIndex(0);
    setCurrentTime(0);
    setDuration(demos[0].duration);
    await audioEngine.setTrack(demos[0]);
    setTimeout(() => {
      setSettings(p => ({ ...p, cueingLeverUp: false }));
      setPlaybackState('playing');
      audioEngine.play();
    }, 450);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    const loaded: Track[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      if (AUDIO_EXTS.includes(ext) || f.type.startsWith('audio/')) {
        const track = await buildTrack(f, tracks.length + loaded.length, 'Dropped Vinyl');
        loaded.push(track);
      }
    }
    if (loaded.length) {
      const updated = [...tracks, ...loaded];
      setTracks(updated);
      if (playbackState !== 'playing') {
        const startIdx = tracks.length;
        setActiveTrackIndex(startIdx);
        setCurrentTime(0);
        setDuration(0);
        await audioEngine.setTrack(updated[startIdx]);
        setTimeout(() => {
          setSettings(p => ({ ...p, cueingLeverUp: false }));
          setPlaybackState('playing');
          audioEngine.play();
        }, 450);
      }
    }
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const getTrackStats = (t: Track) => playStats[getTrackKey(t)] || { playCount: 0, lastPlayed: 0 };

  const filteredTracks = tracks
    .filter(t => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.album ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (shelfFilter === 'favorites') return isTrackFavorite(t);
      if (shelfFilter === 'history') return getTrackStats(t).playCount > 0;
      return true;
    })
    .sort((a, b) => {
      if (shelfFilter === 'history') {
        return (getTrackStats(b).lastPlayed || 0) - (getTrackStats(a).lastPlayed || 0);
      }
      return 0;
    });

  const favoritesCount = tracks.filter(isTrackFavorite).length;
  const historyCount = tracks.filter(t => getTrackStats(t).playCount > 0).length;

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const trackColors = ['from-violet-900/70','from-emerald-900/70','from-amber-900/70','from-rose-900/70','from-sky-900/70','from-fuchsia-900/70'];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#090809] via-[#050507] to-[#020103] font-sans antialiased text-[#e0dbd5] flex flex-col items-center justify-between p-4 md:p-5 select-none"
    >
      <input
        ref={folderInputRef}
        type="file"
        className="hidden"
        onChange={handleFolderFallback}
        {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      <input ref={fileInputRef} type="file" multiple accept="audio/*" className="hidden" onChange={handleFilesPick} />

      {isDraggingOver && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md border-4 border-dashed border-amber-500/70 m-4 rounded-3xl animate-fade-in pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 animate-pulse">
            <Disc className="w-10 h-10 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 tracking-wide">Drop Audio Files to Spin</h2>
          <p className="text-xs text-amber-400/80 font-mono mt-2">Supports MP3, WAV, FLAC, M4A, OGG, AAC, OPUS</p>
        </div>
      )}

      <div className="w-full max-w-6xl flex justify-between items-center py-2 border-b border-zinc-950/80 flex-shrink-0">
        <div>
          <span className="text-[9px] font-mono tracking-[0.22em] text-amber-600/80 font-semibold uppercase">High Fidelity Direct Drive</span>
          <h1 className="text-lg font-serif font-bold text-zinc-100 tracking-tight leading-none mt-0.5">Melodex</h1>
        </div>

        <div className="hidden sm:flex items-center">
          <AudioVisualizer isPlaying={playbackState === 'playing'} />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 bg-zinc-950/90 rounded-lg p-1 border border-zinc-900 text-[10px] font-mono">
            <span className="text-[9px] text-zinc-500 uppercase px-1 font-semibold">Finish</span>
            {(['obsidian', 'walnut', 'silver', 'neon'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                title={`Switch turntable finish to ${t}`}
                className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                  settings.theme === t
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-1 bg-zinc-950/90 rounded-lg p-1 border border-zinc-900 text-[10px] font-mono">
            <span className="text-[9px] text-zinc-500 uppercase px-1 font-semibold">Wax</span>
            {(['classic', 'amber', 'ruby', 'neon'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setSettings((s) => ({ ...s, wax: w }))}
                title={`Switch vinyl wax pressing to ${w}`}
                className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                  settings.wax === w
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsSleepTimerOpen(true)}
            title={sleepTimerOption === 0 ? "Sleep Timer" : "Sleep Timer Active"}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              sleepTimerOption !== 0
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm'
                : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-indigo-400'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${sleepTimerOption !== 0 ? 'fill-current text-indigo-400' : ''}`} />
            {sleepTimerOption !== 0 && (
              <span className="text-[10px] font-bold">
                {sleepTimerOption === -1
                  ? 'Auto'
                  : sleepTimerRemaining !== null
                  ? `${Math.floor(sleepTimerRemaining / 60)}:${(sleepTimerRemaining % 60).toString().padStart(2, '0')}`
                  : `${sleepTimerOption}m`}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard Shortcuts (?)"
            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

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
            theme={settings.theme} wax={settings.wax}
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
                <button
                  onClick={handleLoadDemoTracks}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Spin Demo Vinyl (Lo-Fi Jazz)</span>
                </button>
                <div className="text-center text-[10px] text-zinc-600 font-mono">or load your own audio</div>
                <button onClick={handleOpenFolder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 active:scale-95 text-zinc-200 rounded-xl text-xs font-medium transition-all cursor-pointer">
                  <FolderOpen className="w-4 h-4 text-amber-500/80" /><span>Open Local Music Folder</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 active:scale-95 text-zinc-200 rounded-xl text-xs font-medium transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-amber-500/80" /><span>Choose Audio Files</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 gap-3">
              <div className="flex items-center justify-between flex-shrink-0">
                <span className="text-[9px] font-mono font-semibold tracking-[0.18em] text-zinc-500 uppercase">Record Shelf</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadDemoTracks}
                    title="Load Demo Lo-Fi Vinyl"
                    className="text-[9px] font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    + Demo Vinyl
                  </button>
                  <span className="text-[9px] font-mono text-zinc-600">{filteredTracks.length} / {tracks.length}</span>
                </div>
              </div>

              {/* Shelf Filter Tabs */}
              <div className="flex items-center gap-1 bg-zinc-950/90 rounded-lg p-1 border border-zinc-900 text-[10px] font-mono flex-shrink-0">
                <button
                  onClick={() => setShelfFilter('all')}
                  className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer ${
                    shelfFilter === 'all'
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  All ({tracks.length})
                </button>
                <button
                  onClick={() => setShelfFilter('favorites')}
                  className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    shelfFilter === 'favorites'
                      ? 'bg-rose-500 text-white font-bold shadow-sm'
                      : 'text-zinc-500 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${shelfFilter === 'favorites' ? 'fill-current' : ''}`} />
                  <span>Favs ({favoritesCount})</span>
                </button>
                <button
                  onClick={() => setShelfFilter('history')}
                  className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    shelfFilter === 'history'
                      ? 'bg-sky-500 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-500 hover:text-sky-400'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>History ({historyCount})</span>
                </button>
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
                    <Music className="w-5 h-5 opacity-30 mb-2" /><span className="text-[11px]">No tracks match your search or filter.</span>
                  </div>
                ) : filteredTracks.map(track => {
                  const origIdx = tracks.findIndex(t => t.id === track.id);
                  const isActive = origIdx === activeTrackIndex;
                  const isFav = isTrackFavorite(track);
                  const stats = getTrackStats(track);
                  return (
                    <div key={track.id} onClick={() => isActive ? (playbackState === 'playing' ? handlePause() : handlePlay()) : selectAndPlayTrack(origIdx)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group ${isActive ? 'bg-zinc-900/80 border-amber-500/50 shadow-md' : 'bg-zinc-950/20 border-zinc-950 hover:bg-zinc-900/30 hover:border-zinc-900'}`}>
                      <div className={`w-8 h-8 rounded-lg overflow-hidden border border-zinc-900/80 flex items-center justify-center flex-shrink-0 shadow-inner ${track.coverUrl ? '' : `bg-gradient-to-br ${trackColors[origIdx % trackColors.length]} to-zinc-950`}`}>
                        {track.coverUrl ? (
                          <img src={track.coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Disc className={`w-3.5 h-3.5 text-zinc-400 opacity-75 ${isActive && playbackState === 'playing' ? 'animate-spin' : ''}`} style={{ animationDuration: '2.5s' }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate leading-none mb-1 ${isActive ? 'text-amber-200' : 'text-zinc-200 group-hover:text-zinc-100'}`}>{track.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-zinc-500 truncate leading-none">{track.artist}</p>
                          {stats.playCount > 0 && (
                            <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-zinc-900/90 text-amber-400/80 border border-zinc-800 leading-none">
                              {stats.playCount}x
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2 pl-1">
                        <button
                          onClick={(e) => toggleFavorite(track, e)}
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isFav
                              ? 'text-rose-500 hover:text-rose-400'
                              : 'text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-500' : ''}`} />
                        </button>
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
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 flex items-center justify-center flex-shrink-0 shadow-md">
            {activeTrack?.coverUrl ? (
              <img src={activeTrack.coverUrl} alt="" className="w-full h-full object-cover" />
            ) : playbackState === 'playing' ? (
              <Disc className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '2.2s' }} />
            ) : (
              <Music className="w-4 h-4 text-zinc-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif font-semibold text-zinc-100 text-xs truncate leading-none mb-1">{activeTrack ? activeTrack.title : 'No track loaded'}</p>
            <p className="text-zinc-500 text-[10px] truncate leading-none">{activeTrack ? activeTrack.artist : 'Open a folder to begin'}</p>
          </div>
          {activeTrack && (
            <button
              onClick={(e) => toggleFavorite(activeTrack, e)}
              title={isTrackFavorite(activeTrack) ? "Remove from Favorites" : "Add to Favorites"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0 ${
                isTrackFavorite(activeTrack) ? 'text-rose-500 hover:text-rose-400' : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isTrackFavorite(activeTrack) ? 'fill-current text-rose-500' : ''}`} />
            </button>
          )}
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
            <div
              className="flex-1 h-2 bg-zinc-950 border border-zinc-900 rounded-full relative cursor-pointer select-none group"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.04) 4px, rgba(255,255,255,0.04) 5px)',
              }}
              onMouseMove={e => {
                if (!activeTrack || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                const time = (pct / 100) * duration;
                setHoverGroove({ pct, time, zone: getGrooveZone(pct) });
              }}
              onMouseLeave={() => setHoverGroove(null)}
              onClick={e => {
                if (!activeTrack || !duration) return;
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                audioEngine.seek(pct);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all relative overflow-hidden"
                style={{ width: `${progressPct}%` }}
              />

              {duration > 0 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-amber-400 border border-amber-200 rounded-sm shadow-md pointer-events-none transition-all"
                  style={{ left: `calc(${progressPct}% - 3px)` }}
                />
              )}

              {hoverGroove && (
                <div
                  className="absolute top-0 bottom-0 w-[1px] bg-white/80 pointer-events-none"
                  style={{ left: `${hoverGroove.pct}%` }}
                />
              )}

              {hoverGroove && (
                <div
                  className="absolute -top-7 px-2 py-0.5 bg-zinc-950/95 border border-amber-500/40 rounded-md text-[9px] font-mono text-zinc-200 shadow-xl pointer-events-none -translate-x-1/2 whitespace-nowrap z-30 flex items-center gap-1.5"
                  style={{ left: `${hoverGroove.pct}%` }}
                >
                  <span className="text-amber-400 font-bold">{fmt(hoverGroove.time)}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">{hoverGroove.zone}</span>
                </div>
              )}
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
            <button
              onClick={() => setSettings(p => ({ ...p, pitch: 0.0 }))}
              title={settings.pitch === 0 ? "Quartz Lock engaged (0.0%)" : "Quartz Lock: Click to reset pitch to 0.0%"}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                settings.pitch === 0
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400/90 border-zinc-800'
              }`}
            >
              {settings.pitch === 0 ? 'LOCK' : `${settings.pitch > 0 ? '+' : ''}${settings.pitch.toFixed(1)}%`}
            </button>
          </div>

          <button
            onClick={() => setIsEQOpen(true)}
            title="Audiophile Sound Console (EQ & Analog Warmth)"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              settings.eq.bass !== 0 ||
              settings.eq.mid !== 0 ||
              settings.eq.treble !== 0 ||
              settings.analogFX.warmth > 0 ||
              settings.analogFX.flutter > 0
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span className="text-[10px] hidden sm:inline">EQ &amp; FX</span>
          </button>
        </div>
      </div>

      <EqualizerModal
        isOpen={isEQOpen}
        onClose={() => setIsEQOpen(false)}
        eq={settings.eq}
        onChange={(newEQ) => setSettings((s) => ({ ...s, eq: newEQ }))}
        analogFX={settings.analogFX}
        onAnalogFXChange={(newFX) => setSettings((s) => ({ ...s, analogFX: newFX }))}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        currentTimer={sleepTimerOption}
        remainingSeconds={sleepTimerRemaining}
        onSelectOption={handleSelectSleepTimer}
      />
    </div>
  );
}
