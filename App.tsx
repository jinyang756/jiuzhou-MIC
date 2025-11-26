import React, { useState, useEffect } from 'react';
import { Page, Song } from './types';
import { Navigation } from './components/Navigation';
import { MusicPlayer } from './components/MusicPlayer';
import { BlogPage } from './pages/Blog';
import { ToolboxPage } from './pages/Toolbox';
import { JianLaiPage } from './pages/JianLai';
import { WorldResonancePage } from './pages/WorldResonance';
import { CommunityPage } from './pages/Community';
import { AboutPage } from './pages/About';
import { FinancePage } from './pages/Finance';
import { Search } from 'lucide-react';

// Real Audio Data with Lyrics
const initialPlaylist: Song[] = [
  {
    id: '1',
    title: 'Rain & Thunder',
    artist: '九州原声 · 自然',
    // Moody Rain / Forest
    cover: 'https://images.unsplash.com/photo-1501908734255-16579c18c25f?q=80&w=1000&auto=format&fit=crop',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_0df95e0c52.mp3',
    duration: '2:15',
    bitrate: '24bit / 96kHz',
    lyrics: "[00:00.00] (Rain sounds falling gently...)\n[00:10.00] Thunder rolls in the distance.\n[00:30.00] Nature's symphony plays on.\n[01:00.00] Peace returns to the earth."
  },
  {
    id: '2',
    title: 'Deep Meditation',
    artist: '九州原声 · 疗愈',
    // Zen Stones / Dark Atmosphere
    cover: 'https://images.unsplash.com/photo-1593096057997-d86016e7884a?q=80&w=1000&auto=format&fit=crop',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: '3:42',
    bitrate: 'FLAC / Lossless',
    lyrics: "Close your eyes...\nBreathe in...\nBreathe out...\nFeel the energy flow through you.\nLet go of all stress.\nYou are one with the universe."
  },
  {
    id: '3',
    title: 'Cyberpunk City',
    artist: '九州原声 · 未来',
    // Cyberpunk Neon Red/Blue
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_736a596766.mp3',
    duration: '2:30',
    bitrate: '320kbps AAC',
    lyrics: "(Instrumental Synthwave)\n\nNeon lights flickering...\nFlying cars passing by...\nThe future is now.\nCan you feel the digital pulse?"
  }
];

const HISTORY_STORAGE_KEY = 'jiuzhou_music_history';

const App: React.FC = () => {
  const [activePage, setPage] = useState<Page>(Page.BLOG);
  
  // Music State
  const [playlist, setPlaylist] = useState<Song[]>(initialPlaylist);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  
  // TTS / Audio Ducking State
  // When true, background music volume will be lowered to allow voice to be heard
  const [isTTSActive, setIsTTSActive] = useState(false);
  
  // History State
  const [history, setHistory] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  const currentSong = playlist[currentSongIndex];

  // Update history when current song changes
  useEffect(() => {
    if (!currentSong) return;

    setHistory(prevHistory => {
      // Remove current song if it exists to avoid duplicates, then add to top
      const filtered = prevHistory.filter(s => s.id !== currentSong.id);
      const newHistory = [currentSong, ...filtered].slice(0, 20); // Keep last 20
      
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.warn("Failed to save history");
      }
      return newHistory;
    });
  }, [currentSong?.id]); // Only trigger when ID changes

  // Filter playlist based on search
  const filteredPlaylist = playlist.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handlePlaySong = (id: string) => {
    const index = playlist.findIndex(s => s.id === id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      setIsPlaying(true);
      setIsPlayerExpanded(true);
    }
  };

  const addToPlaylist = (song: Song) => {
    // Check if exists
    if (!playlist.find(s => s.id === song.id)) {
      setPlaylist(prev => [song, ...prev]); // Add to top
    }
    handlePlaySong(song.id); // Play immediately
  };

  const renderContent = () => {
    switch (activePage) {
      case Page.BLOG:
        return <BlogPage />;
      case Page.TOOLBOX:
        return <ToolboxPage />;
      case Page.MUSIC:
        return (
           <div className="h-full flex flex-col items-center justify-start text-center space-y-6 animate-fade-in py-4 md:py-20 flex-1">
             <div className="w-full max-w-md mx-auto space-y-6 flex flex-col h-full">
               
               {/* Header Area */}
               <div className="space-y-4 text-center flex-shrink-0 mt-8 md:mt-0">
                  <div className="mx-auto w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-600/20 to-red-600/20 flex items-center justify-center animate-pulse border border-red-500/20">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-600/40 to-red-600/40 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                      <span className="text-2xl md:text-3xl text-white serif font-bold">九</span>
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-amber-100 serif tracking-widest">九州听觉</h2>
                  <p className="text-slate-400 text-sm md:text-base">
                    当前播放: <span className="text-amber-400">{currentSong?.title}</span>
                    <span className="block text-xs text-slate-500 mt-1">{currentSong?.bitrate} | MP3/FLAC/WAV/TTS 支持</span>
                  </p>
               </div>

               {/* Search Bar */}
               <div className="relative flex-shrink-0">
                 <input 
                   type="text" 
                   placeholder="搜索乐库 / Search Library..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-base md:text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                 />
                 <Search className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
               </div>
               
               {/* Playlist View - use flex-1 to fill space */}
               <div className="space-y-2 text-left flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0 pb-safe">
                  {filteredPlaylist.length === 0 && (
                    <div className="text-center text-slate-500 py-10">没有找到相关音乐</div>
                  )}
                  {filteredPlaylist.map((song) => (
                    <div 
                      key={song.id} 
                      onClick={() => handlePlaySong(song.id)}
                      className={`p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all hover:translate-x-1 active:scale-95 ${song.id === currentSong.id ? 'bg-gradient-to-r from-amber-900/30 to-red-900/30 border border-amber-500/30' : 'hover:bg-slate-800 border border-transparent'} group`}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-shadow">
                        <img src={song.cover} className="w-full h-full object-cover" alt="cover" loading="lazy" />
                        {song.id === currentSong.id && isPlaying && (
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                           </div>
                        )}
                        {song.isTTS && (
                           <div className="absolute top-0 right-0 bg-amber-600 text-[8px] text-white px-1 font-bold">VOICE</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className={`font-medium text-sm truncate ${song.id === currentSong.id ? 'text-amber-400' : 'text-slate-200'}`}>{song.title}</div>
                         <div className="text-xs text-slate-500 truncate">{song.artist}</div>
                      </div>
                      <div className="text-xs text-slate-600 font-mono">{song.duration}</div>
                    </div>
                  ))}
               </div>

               <div className="text-xs text-slate-600 pt-4 hidden md:block">
                 快捷键提示: 空格播放/暂停, Ctrl+左右方向键切歌
               </div>
             </div>
           </div>
        );
      case Page.JIANLAI:
        return <JianLaiPage addToPlaylist={addToPlaylist} setIsTTSActive={setIsTTSActive} />;
      case Page.WORLD:
        return <WorldResonancePage addToPlaylist={addToPlaylist} setIsTTSActive={setIsTTSActive} />;
      case Page.FINANCE:
        return <FinancePage addToPlaylist={addToPlaylist} setIsTTSActive={setIsTTSActive} />;
      case Page.COMMUNITY:
        return <CommunityPage playlist={playlist} onPlaySong={handlePlaySong} addToPlaylist={addToPlaylist} />;
      case Page.ABOUT:
        return <AboutPage />;
      default:
        return <BlogPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-amber-500/30">
      <Navigation 
        activePage={activePage} 
        setPage={setPage} 
      />

      <main 
        className={`
          transition-all duration-300 ease-in-out min-h-screen
          md:ml-64 p-4 md:p-8 pt-6 md:pt-8 flex flex-col
          /* Increased bottom padding for mobile to account for Bottom Nav + Floating Player */
          pb-44 md:pb-28
          ${isPlayerExpanded ? 'filter blur-sm scale-95 opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="max-w-6xl mx-auto h-full w-full flex-1 flex flex-col">
          {renderContent()}
        </div>
      </main>

      <MusicPlayer 
        currentSong={currentSong}
        isPlaying={isPlaying}
        togglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        isExpanded={isPlayerExpanded}
        setIsExpanded={setIsPlayerExpanded}
        history={history}
        onPlaySong={handlePlaySong}
        isTTSActive={isTTSActive}
      />
    </div>
  );
};

export default App;