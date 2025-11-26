import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2, Minimize2, VolumeX, Mic2, Image as ImageIcon, Download, Clock, PlayCircle, Radio } from 'lucide-react';
import { Song } from '../types';
import { tts } from '../services/ttsService';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  history: Song[];
  onPlaySong: (id: string) => void;
  isTTSActive?: boolean; // Controls ducking
}

interface LyricLine {
  time: number;
  text: string;
}

type ViewMode = 'COVER' | 'LYRICS' | 'HISTORY';

const VOLUME_STORAGE_KEY = 'soulSync_volume';

// Helper to parse LRC string
const parseLyrics = (lrcString?: string): LyricLine[] => {
  if (!lrcString) return [];
  
  const lines = lrcString.split('\n');
  const regex = /^\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)$/;
  
  const parsed = lines.map(line => {
    const match = line.match(regex);
    if (!match) return null;
    
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
    
    return {
      time: minutes * 60 + seconds + milliseconds / 1000,
      text: match[4].trim()
    };
  }).filter((line): line is LyricLine => line !== null);

  return parsed.length > 0 ? parsed : [{ time: 0, text: lrcString || "No Lyrics" }];
};

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentSong, isPlaying, togglePlay, onNext, onPrev, isExpanded, setIsExpanded, history, onPlaySong, isTTSActive
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('COVER');

  // Initialize volume from storage
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
      return saved ? parseFloat(saved) : 0.7;
    } catch {
      return 0.7;
    }
  });

  // Parse lyrics when song changes
  const lyricLines = useMemo(() => parseLyrics(currentSong?.lyrics), [currentSong?.lyrics]);

  // Find active lyric index
  const activeLyricIndex = useMemo(() => {
    if (!lyricLines.length) return -1;
    // Find the last line whose time is <= currentTime
    const index = lyricLines.findIndex((line, i) => {
      const nextLine = lyricLines[i + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
    return index;
  }, [currentTime, lyricLines]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (viewMode === 'LYRICS' && activeLyricRef.current && isExpanded) {
       activeLyricRef.current.scrollIntoView({
         behavior: 'smooth',
         block: 'center',
       });
    }
  }, [activeLyricIndex, viewMode, isExpanded]);

  // Handle Play/Pause for both Audio and TTS
  useEffect(() => {
    if (!currentSong) return;

    if (currentSong.isTTS && currentSong.ttsData) {
        // TTS MODE
        if (isPlaying) {
             // If resuming or starting
             if (tts.isSpeaking()) {
                 tts.resume();
             } else {
                 tts.speak(currentSong.ttsData.text, currentSong.ttsData.persona, () => {
                     // On End
                     onNext();
                 });
             }
        } else {
            tts.pause();
        }
    } else {
        // AUDIO MODE
        // Stop TTS if switching back to normal audio
        if (tts.isSpeaking()) tts.stop();

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }
  }, [isPlaying, currentSong]);

  // --- INTEGRATION: Media Session API (System Controls) ---
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return;

    // 1. Set Metadata (Cover, Title, Artist)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      artwork: [
        { src: currentSong.cover, sizes: '96x96', type: 'image/jpeg' },
        { src: currentSong.cover, sizes: '128x128', type: 'image/jpeg' },
        { src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' },
      ]
    });

    // 2. Set Action Handlers (Play, Pause, Next, Prev, Seek)
    navigator.mediaSession.setActionHandler('play', togglePlay);
    navigator.mediaSession.setActionHandler('pause', togglePlay);
    navigator.mediaSession.setActionHandler('previoustrack', onPrev);
    navigator.mediaSession.setActionHandler('nexttrack', onNext);
    navigator.mediaSession.setActionHandler('stop', () => {
        if(isPlaying) togglePlay();
    });
    
    // Support seeking from system notification center
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
         if (audioRef.current) {
            audioRef.current.currentTime = details.seekTime;
            setCurrentTime(details.seekTime);
         }
      }
    });

    return () => {
        // Cleanup handlers on unmount or song change to avoid stale closures
        if('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
            navigator.mediaSession.setActionHandler('seekto', null);
            navigator.mediaSession.setActionHandler('stop', null);
        }
    }
  }, [currentSong, togglePlay, onNext, onPrev, isPlaying]);

  // --- INTEGRATION: Global Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore key events if the user is typing in an input field
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                handlePlayControl();
                break;
            case 'ArrowLeft':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    handlePrevControl();
                }
                break;
            case 'ArrowRight':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    handleNextControl();
                }
                break;
            // Optional: Volume control with Up/Down arrows could be added here
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, onPrev, onNext]);

  // Handle Volume & Ducking
  useEffect(() => {
    if (audioRef.current) {
      // Audio Ducking: If TTS is active externally, lower volume to 20%
      const effectiveVolume = isTTSActive ? volume * 0.2 : volume;
      audioRef.current.volume = effectiveVolume;
    }
    try {
        localStorage.setItem(VOLUME_STORAGE_KEY, volume.toString());
    } catch (e) {
        // ignore
    }
  }, [volume, isTTSActive]);

  // Audio Events
  const onTimeUpdate = () => {
    if (!audioRef.current) return;

    // Update internal state if not dragging
    if (!isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }

    // 3. Update System Position State (Important for lock screen progress bar)
    if ('mediaSession' in navigator && !isNaN(audioRef.current.duration)) {
      try {
        navigator.mediaSession.setPositionState({
          duration: audioRef.current.duration,
          playbackRate: audioRef.current.playbackRate,
          position: audioRef.current.currentTime,
        });
      } catch (e) {
        // Ignore errors that can happen if duration is invalid momentarily
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Ensure it keeps playing if we are in 'playing' state (e.g., auto-play next song)
      if(isPlaying && !currentSong?.isTTS) audioRef.current.play();
    }
  };

  const onEnded = () => {
    // Automatically go to next song when current one finishes.
    onNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handlePlayControl = () => {
    vibrate();
    togglePlay();
  };

  const handleNextControl = () => {
    vibrate();
    onNext();
  };

  const handlePrevControl = () => {
    vibrate();
    onPrev();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSong) return null;

  return (
    <div className={`
      fixed transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col
      ${isExpanded 
        ? 'inset-0 w-full h-full z-[60] md:w-[28rem] md:h-[calc(100vh-2rem)] md:top-auto md:bottom-4 md:right-4 md:left-auto md:rounded-3xl border-t md:border border-slate-700/50 pt-safe pb-safe md:pt-0 md:pb-0' 
        : `
           z-30 
           /* Desktop: standard corner card */
           md:left-auto md:bottom-4 md:right-4 md:w-96 md:h-20 md:rounded-2xl md:border md:border-slate-700
           /* Mobile: Floating Capsule above bottom nav */
           left-3 right-3 bottom-[4.5rem] h-16 rounded-2xl border border-slate-700/50 shadow-2xl
           `
      }
      bg-slate-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden
    `}>
      {/* Actual Audio Element (Only for non-TTS songs) */}
      {!currentSong.isTTS && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          autoPlay={isPlaying}
          crossOrigin="anonymous" 
        />
      )}

      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
          <img src={currentSong.cover} className="w-full h-full object-cover opacity-10 blur-3xl scale-150" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-950" />
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="flex-1 flex flex-col items-center p-6 md:p-8 relative z-10 overflow-hidden min-h-0">
             <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-4 md:p-2 z-50 active:scale-95"
                title="折叠播放器"
              >
                <Minimize2 className="w-6 h-6 md:w-5 md:h-5" />
              </button>

              <div className="w-full flex justify-between items-center mb-8 px-2 mt-8 md:mt-0">
                 <div className="text-xs text-slate-500 font-mono tracking-widest uppercase">Now Playing</div>
                 <div className="flex bg-slate-800/50 rounded-lg p-1 space-x-1">
                     <button 
                       onClick={() => setViewMode('COVER')} 
                       className={`p-2 md:p-1.5 rounded transition-colors ${viewMode === 'COVER' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`} 
                       title="封面"
                     >
                        <ImageIcon className="w-4 h-4 md:w-3 md:h-3"/>
                     </button>
                     <button 
                       onClick={() => setViewMode('LYRICS')} 
                       className={`p-2 md:p-1.5 rounded transition-colors ${viewMode === 'LYRICS' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`} 
                       title="歌词"
                     >
                        <Mic2 className="w-4 h-4 md:w-3 md:h-3"/>
                     </button>
                     <button 
                       onClick={() => setViewMode('HISTORY')} 
                       className={`p-2 md:p-1.5 rounded transition-colors ${viewMode === 'HISTORY' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`} 
                       title="历史记录"
                     >
                        <Clock className="w-4 h-4 md:w-3 md:h-3"/>
                     </button>
                     <div className="w-px bg-slate-700 mx-1"></div>
                     {currentSong.isTTS ? (
                        <div className="p-2 md:p-1.5 rounded text-amber-500 cursor-default" title="语音资产">
                            <Radio className="w-4 h-4 md:w-3 md:h-3"/>
                        </div>
                     ) : (
                        <a href={currentSong.url} download target="_blank" rel="noreferrer" className="p-2 md:p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700" title="下载">
                            <Download className="w-4 h-4 md:w-3 md:h-3"/>
                        </a>
                     )}
                 </div>
              </div>

              <div className="flex-1 w-full flex items-center justify-center relative min-h-0 mb-6">
                 {/* LYRICS VIEW */}
                 {viewMode === 'LYRICS' && (
                    <div 
                        ref={lyricsContainerRef}
                        className="w-full h-full overflow-y-auto custom-scrollbar text-center space-y-8 py-20 px-2 mask-image-gradient animate-fade-in no-scrollbar"
                        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
                    >
                        {currentSong.isTTS ? (
                            <div className="text-center px-4">
                                <Radio className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-pulse" />
                                <p className="text-slate-300 text-lg font-serif italic leading-loose">
                                    {currentSong.ttsData?.text}
                                </p>
                            </div>
                        ) : (
                            lyricLines.length > 0 && lyricLines[0].time === 0 && lyricLines.length === 1 && !currentSong.lyrics ? (
                                <p className="text-slate-500 italic mt-20">暂无滚动歌词</p>
                            ) : (
                                lyricLines.map((line, index) => {
                                    const isActive = index === activeLyricIndex;
                                    return (
                                        <div 
                                            key={index}
                                            ref={isActive ? activeLyricRef : null}
                                            className={`
                                                transition-all duration-500 ease-out cursor-pointer hover:text-white
                                                ${isActive 
                                                    ? 'text-amber-400 font-bold text-xl md:text-2xl scale-110' 
                                                    : 'text-slate-600 text-sm md:text-base blur-[0.5px] hover:blur-0'}
                                            `}
                                            onClick={() => {
                                                if(audioRef.current) {
                                                    audioRef.current.currentTime = line.time;
                                                }
                                            }}
                                        >
                                            <p className="leading-loose serif">{line.text}</p>
                                        </div>
                                    );
                                })
                            )
                        )}
                        <div className="h-32"></div> {/* Spacer */}
                    </div>
                 )}

                 {/* COVER VIEW */}
                 {viewMode === 'COVER' && (
                    <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group animate-fade-in">
                        <img src={currentSong.cover} alt="Cover" className={`w-full h-full object-cover transition-transform duration-[20s] ease-linear ${isPlaying ? 'scale-125' : 'scale-100'}`} />
                        {currentSong.isTTS ? (
                            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-widest flex items-center">
                                <Radio className="w-3 h-3 mr-1" /> VOICE ASSET
                            </div>
                        ) : (
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-500 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-bold tracking-widest">
                                HI-RES
                            </div>
                        )}
                    </div>
                 )}

                 {/* HISTORY VIEW */}
                 {viewMode === 'HISTORY' && (
                    <div className="w-full h-full overflow-y-auto custom-scrollbar px-2 animate-fade-in no-scrollbar">
                        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 text-center">最近播放</h4>
                        <div className="space-y-2">
                           {history.map((song) => (
                             <div 
                                key={`${song.id}-${Math.random()}`} // unique key for rendering
                                onClick={() => {
                                  onPlaySong(song.id);
                                  setViewMode('COVER'); // Switch back to cover when clicked
                                }}
                                className={`
                                  flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors
                                  ${song.id === currentSong.id ? 'bg-amber-600/20 border border-amber-600/30' : 'bg-slate-800/30 hover:bg-slate-800 border border-transparent'}
                                `}
                             >
                                <img src={song.cover} className="w-10 h-10 rounded-lg object-cover opacity-80" />
                                <div className="flex-1 min-w-0 text-left">
                                  <div className={`text-sm font-medium truncate ${song.id === currentSong.id ? 'text-amber-300' : 'text-slate-200'}`}>{song.title}</div>
                                  <div className="text-xs text-slate-500 truncate">{song.artist}</div>
                                </div>
                                {song.id === currentSong.id ? (
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                                  </div>
                                ) : (
                                  <PlayCircle className="w-4 h-4 text-slate-600 hover:text-white transition-colors" />
                                )}
                             </div>
                           ))}
                        </div>
                        <div className="h-10"></div>
                    </div>
                 )}
              </div>
          
              <div className="text-center space-y-2 w-full mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight truncate px-4">{currentSong.title}</h3>
                <p className="text-slate-400 font-medium truncate px-8">{currentSong.artist}</p>
                <div className="inline-block px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700 mt-2">
                   <span className="text-[10px] text-amber-300 font-mono tracking-widest">{currentSong.bitrate}</span>
                </div>
              </div>
        </div>
      )}

      {/* Controls Bar (Always Visible) */}
      <div className={`
        ${isExpanded ? 'p-6 pb-2 md:pb-8 bg-transparent flex-shrink-0' : 'h-full px-4 flex items-center justify-between bg-slate-900/50'}
        ${!isExpanded && 'md:bg-slate-900/50 hover:bg-slate-800/50 transition-colors'}
        border-t border-white/5 relative z-20 backdrop-blur-xl
      `}>
        {/* Progress Bar (Interactive) */}
        {isExpanded ? (
          <div className="w-full mb-8">
            {currentSong.isTTS ? (
                 /* Fake Progress bar for TTS */
                 <div className="w-full h-1 bg-slate-700/50 rounded-lg overflow-hidden">
                     <div className="h-full bg-amber-500 animate-[progress_10s_linear_infinite]" style={{ width: '100%' }}></div>
                 </div>
            ) : (
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  className="w-full h-1 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all touch-none"
                />
            )}
            <div className="flex justify-between text-xs text-slate-500 font-mono mt-2">
              <span>{currentSong.isTTS ? 'Playing' : formatTime(currentTime)}</span>
              <span>{currentSong.isTTS ? 'Voice' : formatTime(duration)}</span>
            </div>
          </div>
        ) : (
          /* Mini Progress bar on top border when collapsed */
          <div className="absolute top-0 left-0 h-[2px] bg-slate-800 w-full">
            <div 
              className={`h-full transition-all duration-300 ${currentSong.isTTS ? 'bg-amber-500' : 'bg-amber-600'}`}
              style={{ width: currentSong.isTTS ? '100%' : `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
        )}

        <div className={`flex items-center ${isExpanded ? 'justify-between w-full px-4' : 'w-full justify-between'}`}>
          
          {/* Mini Info */}
          {!isExpanded && (
            <div className="flex items-center space-x-3 overflow-hidden flex-1 cursor-pointer" onClick={() => setIsExpanded(true)}>
               <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                   <img src={currentSong.cover} className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`} />
               </div>
               <div className="truncate pr-4">
                  <h4 className="text-white font-medium text-sm truncate">{currentSong.title}</h4>
                  <p className="text-slate-400 text-xs truncate">{currentSong.artist}</p>
               </div>
            </div>
          )}

          {/* Expanded Volume (Left Side) */}
          {isExpanded && (
             <div className="group relative flex items-center justify-center">
                 <button onClick={() => setVolume(v => v === 0 ? 0.7 : 0)} className="text-slate-400 hover:text-white p-2">
                    {volume === 0 ? <VolumeX className="w-6 h-6 md:w-5 md:h-5" /> : <Volume2 className="w-6 h-6 md:w-5 md:h-5" />}
                 </button>
             </div>
          )}

          {/* Main Controls */}
          <div className="flex items-center space-x-6 md:space-x-6 flex-shrink-0">
            <button onClick={handlePrevControl} className="text-slate-300 hover:text-white transition-colors p-3 active:scale-90" title="上一曲 (Ctrl+Left)">
              <SkipBack className={`${isExpanded ? 'w-8 h-8' : 'w-6 h-6 md:w-5 md:h-5'}`} />
            </button>
            <button 
              onClick={handlePlayControl}
              className={`
                bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 hover:bg-amber-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]
                ${isExpanded ? 'w-16 h-16' : 'w-12 h-12'}
              `}
              title="播放/暂停 (Space)"
            >
              {isPlaying ? <Pause className={`fill-current ${isExpanded ? 'w-6 h-6' : 'w-5 h-5'}`} /> : <Play className={`fill-current ml-1 ${isExpanded ? 'w-6 h-6' : 'w-5 h-5'}`} />}
            </button>
            <button onClick={handleNextControl} className="text-slate-300 hover:text-white transition-colors p-3 active:scale-90" title="下一曲 (Ctrl+Right)">
              <SkipForward className={`${isExpanded ? 'w-8 h-8' : 'w-6 h-6 md:w-5 md:h-5'}`} />
            </button>
          </div>

          {/* Expanded Menu (Right Side) */}
          {isExpanded && (
             <button className="text-slate-400 hover:text-white p-2 opacity-0 pointer-events-none md:opacity-100">
                 <div className="w-6 h-6" /> 
             </button>
          )}

          {!isExpanded && (
             <button onClick={() => setIsExpanded(true)} className="ml-4 text-slate-400 hover:text-white flex-shrink-0 p-2 active:scale-95">
                <Maximize2 className="w-5 h-5" />
             </button>
          )}
        </div>
      </div>
    </div>
  );
};