import React, { useState, useEffect, useRef } from 'react';
import { Wind, CloudRain, Flame, Trees, Play, Pause, Volume2 } from 'lucide-react';

// Free high-quality loops
const SOUND_URLS = {
  rain: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_0152595743.mp3?filename=rain-112671.mp3', 
  fire: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8fa3046bd1.mp3?filename=fireplace-2005.mp3',
  forest: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_0066c8d357.mp3?filename=forest-wind-12248.mp3'
};

export const ToolboxPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BREATHE' | 'AMBIENT'>('BREATHE');
  
  // --- Breathing Logic ---
  const [breathingState, setBreathingState] = useState<'IDLE' | 'INHALE' | 'HOLD' | 'EXHALE'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (breathingState === 'INHALE') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        setBreathingState('HOLD');
        setTimeLeft(7); // Hold for 7s
      }
    } else if (breathingState === 'HOLD') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        setBreathingState('EXHALE');
        setTimeLeft(8); // Exhale for 8s
      }
    } else if (breathingState === 'EXHALE') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        setCycleCount(c => c + 1);
        setBreathingState('INHALE');
        setTimeLeft(4); // Loop back to Inhale 4s
      }
    }

    return () => clearTimeout(timer);
  }, [breathingState, timeLeft]);

  const toggleBreathing = () => {
    if (breathingState === 'IDLE') {
      setBreathingState('INHALE');
      setTimeLeft(4);
      setCycleCount(0);
    } else {
      setBreathingState('IDLE');
      setTimeLeft(0);
    }
  };

  const getBreathingText = () => {
    switch(breathingState) {
      case 'IDLE': return '点击开始';
      case 'INHALE': return '吸气 (Inhale)';
      case 'HOLD': return '屏息 (Hold)';
      case 'EXHALE': return '呼气 (Exhale)';
    }
  };

  const getScaleClass = () => {
    switch(breathingState) {
      case 'IDLE': return 'scale-100';
      case 'INHALE': return 'scale-150 duration-[4000ms]';
      case 'HOLD': return 'scale-150 duration-0'; // Stay expanded
      case 'EXHALE': return 'scale-100 duration-[8000ms]';
    }
  };

  // --- Ambient Logic ---
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({
    rain: false,
    fire: false,
    forest: false
  });
  
  // Refs to hold Audio objects to persist across renders without re-loading
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Initialize Audio objects once
    Object.keys(SOUND_URLS).forEach(key => {
        if (!audioRefs.current[key]) {
            const audio = new Audio(SOUND_URLS[key as keyof typeof SOUND_URLS]);
            audio.loop = true;
            audio.volume = 0; // Start silent for fade-in
            audioRefs.current[key] = audio;
        }
    });

    // Cleanup on unmount
    return () => {
        Object.values(audioRefs.current).forEach((audio) => {
            const audioEl = audio as HTMLAudioElement;
            audioEl.pause();
            audioEl.src = '';
        });
    };
  }, []);

  // Handle Play/Pause logic based on state
  useEffect(() => {
    Object.keys(activeSounds).forEach(key => {
        const audio = audioRefs.current[key];
        if (!audio) return;

        if (activeSounds[key]) {
            if (audio.paused) {
                audio.play().catch(e => console.error("Audio play failed", e));
                // Simple fade in
                audio.volume = 0.5;
            }
        } else {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    });
  }, [activeSounds]);

  const toggleSound = (id: string) => {
    setActiveSounds(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="space-y-8 pb-24 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold text-white serif tracking-wide flex items-center">
            <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
            九州 · 灵台
        </h2>
        <p className="text-emerald-400/80 mt-2">灵台方寸，斜月三星。在此修心，万籁俱寂。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar Nav */}
        <div className="glass-panel rounded-2xl p-4 space-y-2 h-fit">
           <button 
             onClick={() => setActiveTab('BREATHE')}
             className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'BREATHE' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-slate-800'}`}
           >
             <Wind className="w-5 h-5" />
             <span>吐纳 (Breathing)</span>
           </button>
           <button 
             onClick={() => setActiveTab('AMBIENT')}
             className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'AMBIENT' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-slate-800'}`}
           >
             <CloudRain className="w-5 h-5" />
             <span>万籁 (Ambient)</span>
           </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 h-full">
           {activeTab === 'BREATHE' && (
              <div className="glass-panel h-[500px] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-slate-900/50 pointer-events-none"></div>
                 
                 {/* Breathing Circle */}
                 <div className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`
                        w-48 h-48 rounded-full border-4 border-emerald-400/30 flex items-center justify-center
                        transition-transform ease-in-out bg-emerald-500/10 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.2)]
                        ${getScaleClass()}
                      `}
                    >
                       <div className={`w-32 h-32 rounded-full bg-emerald-400/20 flex items-center justify-center transition-opacity duration-1000 ${breathingState === 'HOLD' ? 'opacity-100' : 'opacity-50'}`}>
                          <div className="text-4xl font-bold text-white">{timeLeft > 0 ? timeLeft : ''}</div>
                       </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mt-12 animate-fade-in">{getBreathingText()}</h3>
                    <p className="text-emerald-400/60 mt-2 text-sm">4-7-8 呼吸法：调节神经，缓解焦虑</p>

                    <button 
                      onClick={toggleBreathing}
                      className="mt-8 px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-900/40 flex items-center"
                    >
                       {breathingState === 'IDLE' ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                       {breathingState === 'IDLE' ? '开始修习' : '停止'}
                    </button>
                 </div>
                 
                 {cycleCount > 0 && (
                   <div className="absolute bottom-6 text-slate-500 text-xs tracking-widest uppercase">
                      已完成 {cycleCount} 次循环
                   </div>
                 )}
              </div>
           )}

           {activeTab === 'AMBIENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                 {[
                   { id: 'rain', label: '听雨', icon: CloudRain, desc: '深夜的窗边，雨滴落在玻璃上' },
                   { id: 'fire', label: '篝火', icon: Flame, desc: '温暖的壁炉，木柴燃烧的噼啪声' },
                   { id: 'forest', label: '深林', icon: Trees, desc: '清晨的森林，风吹过树叶的沙沙声' }
                 ].map((sound) => (
                    <div 
                      key={sound.id}
                      onClick={() => toggleSound(sound.id)}
                      className={`
                        glass-panel p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden group
                        ${activeSounds[sound.id] ? 'border-emerald-500 bg-emerald-900/20' : 'border-transparent hover:bg-slate-800/50'}
                      `}
                    >
                       {activeSounds[sound.id] && (
                           <div className="absolute right-4 top-4">
                               <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                           </div>
                       )}
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className={`p-3 rounded-xl transition-colors ${activeSounds[sound.id] ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'}`}>
                             <sound.icon className="w-6 h-6" />
                          </div>
                       </div>
                       <h4 className={`text-lg font-bold mb-1 relative z-10 transition-colors ${activeSounds[sound.id] ? 'text-white' : 'text-slate-300'}`}>{sound.label}</h4>
                       <p className="text-sm text-slate-500 relative z-10">{sound.desc}</p>
                    </div>
                 ))}
                 
                 <div className="md:col-span-2 mt-4 p-6 bg-slate-800/30 rounded-xl text-center border border-dashed border-slate-700">
                    <p className="text-slate-500 text-sm">耳机体验更佳 • 音频源自 Pixabay</p>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};