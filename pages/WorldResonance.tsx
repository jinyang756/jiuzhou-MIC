
import React, { useState, useEffect } from 'react';
import { Globe, Heart, AlignLeft, Volume2, StopCircle, PlusCircle, MapPin, ChevronLeft, Sparkles } from 'lucide-react';
import { WorldEvent, Song } from '../types';
import { tts } from '../services/ttsService';

interface WorldResonancePageProps {
  addToPlaylist?: (song: Song) => void;
  setIsTTSActive?: (active: boolean) => void;
}

// Expanded Mock Data with pre-written analysis
const mockEvents: WorldEvent[] = [
  {
    id: '1',
    title: '战火中的钢琴师',
    location: '加沙废墟 / Yarmouk Camp',
    description: '在那张著名的照片背后，是一个关于坚守的故事。叙利亚大马士革南部的雅尔穆克难民营，四周是断壁残垣，炮火声从未停歇。但就在这样一片灰色的废墟之中，一位名叫Aeham Ahmad的钢琴师，将他那架有些走调的钢琴推到了街道中央。\n\n他开始弹奏。琴声穿过充满硝烟的空气，穿过那些绝望的眼神。孩子们围了过来，虽然他们的衣服破旧，脸上沾满灰尘，但在琴声响起的瞬间，他们的眼中重新有了光。这不是一场为了表演的演奏，这是一个人用最温柔的方式，对残酷命运发出的最震耳欲聋的咆哮。他告诉世界：由于饥饿和恐惧，我们的身体可能会死去，但只要音乐还在，灵魂就依然自由。',
    // Moody piano / ruins vibe
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1600&auto=format&fit=crop',
    analysis: '废墟中的琴声，是对战争最优雅的蔑视。它证明了人类尊严的最后一道防线，不在于肉体的存活，而在于精神的自由。即使身处地狱，依然可以仰望天堂。'
  },
  {
    id: '2',
    title: '跨越国界的骨髓捐赠',
    location: '中国杭州 - 意大利',
    description: '这是一场与时间的赛跑，更是一次跨越种族与国界的生命接力。一位年轻的中国医生在得知自己的造血干细胞与一位远在意大利的白血病患者配型成功后，毫不犹豫地签下了同意书。\n\n采集过程漫长且伴随着身体的不适，但他始终带着微笑。那袋红色的“生命种子”，在志愿者的护送下，跨越了8000公里的距离，飞越崇山峻岭。在这一刻，政治、语言、文化的隔阂统统消失了。人类回归到了最本质的属性——我们是同类。我们流着红色的血，我们同样渴望活下去。这袋血液证明了，爱是人类通用的语言。',
    // Touching hands / Care
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1600&auto=format&fit=crop',
    analysis: '血液的红，是人类共同的底色。在生命面前，所有的政治标签、国界线都显得如此苍白。这不仅是一次救助，更是一次关于“人类命运共同体”的具象化预演。'
  },
  {
    id: '3',
    title: '鲸鱼的葬礼',
    location: '太平洋深海',
    description: '当一只巨大的鲸鱼预感到生命的终结，它会独自游向深海。随着呼吸停止，它巨大的身躯开始缓慢下沉，这一下沉的过程往往持续数月。这便是“鲸落”。\n\n但这并不是结束，而是另一个伟大的开始。在漆黑冰冷的海底，这具庞大的躯体将成为一座绿洲。它将滋养鲨鱼、盲鳗、甲壳类等上万个生物体，这一供养过程甚至可以持续百年。生于海，归于海。它用死亡，为这片海洋献上了最后一次温柔。这不仅是自然界的循环，更是一种极致的浪漫与牺牲——一鲸落，万物生。',
    // Deep Ocean / Blue Texture
    image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1600&auto=format&fit=crop',
    analysis: '这是一种极其宏大的自然诗篇。死亡并非终结，而是另一种形式的永生。鲸落教会我们如何优雅地谢幕，以及如何慷慨地馈赠。这是生命最高级的温柔。'
  }
];

export const WorldResonancePage: React.FC<WorldResonancePageProps> = ({ addToPlaylist, setIsTTSActive }) => {
  const [selectedEvent, setSelectedEvent] = useState<WorldEvent | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      tts.stop();
      if (setIsTTSActive) setIsTTSActive(false);
    };
  }, []);

  useEffect(() => {
    tts.stop();
    setIsSpeaking(false);
    if (setIsTTSActive) setIsTTSActive(false);
  }, [selectedEvent]);

  const handleSelect = (event: WorldEvent) => {
    setSelectedEvent(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
        tts.stop();
        setIsSpeaking(false);
        if (setIsTTSActive) setIsTTSActive(false);
    } else if (selectedEvent) {
        setIsSpeaking(true);
        if (setIsTTSActive) setIsTTSActive(true);
        const textToRead = `${selectedEvent.title}。${selectedEvent.description}`;
        // World events use 'NORMAL' persona
        tts.speak(textToRead, 'NORMAL', () => {
          setIsSpeaking(false);
          if (setIsTTSActive) setIsTTSActive(false);
        });
    }
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedEvent || !addToPlaylist) return;

    const ttsSong: Song = {
      id: `wr-tts-${selectedEvent.id}`,
      title: `${selectedEvent.title}`,
      artist: '九州·世界',
      cover: selectedEvent.image,
      url: '', // No URL for TTS assets
      duration: '语音',
      bitrate: 'AI Voice',
      isTTS: true,
      ttsData: {
        text: `${selectedEvent.title}。${selectedEvent.description}`,
        persona: 'NORMAL'
      }
    };
    addToPlaylist(ttsSong);
    alert('已加入播放列表');
  };

  // Render Detail View
  if (selectedEvent) {
    return (
      <div className="animate-fade-in pb-20">
         <button 
          onClick={() => setSelectedEvent(null)}
          className="mb-6 flex items-center text-slate-400 hover:text-cyan-400 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 返回世界地图
        </button>

        {/* Hero Section */}
        <div className="relative h-64 md:h-96 w-full rounded-3xl overflow-hidden shadow-2xl mb-8">
            <img src={selectedEvent.image} className="w-full h-full object-cover" alt="hero" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent flex items-center">
               <div className="p-8 md:p-12 max-w-2xl">
                  <div className="flex items-center text-cyan-400 text-sm font-bold tracking-widest uppercase mb-3">
                     <MapPin className="w-4 h-4 mr-2" />
                     {selectedEvent.location}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white serif mb-4 leading-tight">
                     {selectedEvent.title}
                  </h1>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Story Content */}
           <div className="lg:col-span-2">
              <div className="glass-panel p-8 rounded-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <AlignLeft className="w-5 h-5 mr-3 text-cyan-400" />
                        事件始末
                    </h3>
                    <div className="flex space-x-3">
                        <button 
                            onClick={handleAddToPlaylist}
                            className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                            title="加入播放器歌单"
                         >
                            <PlusCircle className="w-4 h-4 mr-2" /> 收藏原声
                         </button>
                        <button 
                          onClick={handleToggleSpeech}
                          className={`
                            flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all
                            ${isSpeaking 
                                ? 'bg-cyan-500 text-white animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}
                          `}
                        >
                            {isSpeaking ? (
                                <><StopCircle className="w-4 h-4 mr-2" /> 停止讲述</>
                            ) : (
                                <><Volume2 className="w-4 h-4 mr-2" /> 聆听故事</>
                            )}
                        </button>
                    </div>
                 </div>
                 <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg font-light">
                    {selectedEvent.description}
                 </p>
              </div>
           </div>

           {/* Interpretation Sidebar */}
           <div className="lg:col-span-1">
              <div className="sticky top-24">
                 <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Heart className="w-24 h-24" />
                    </div>

                    <h3 className="text-lg font-bold text-cyan-400 mb-6 flex items-center uppercase tracking-widest relative z-10 border-b border-slate-800 pb-2">
                       <Sparkles className="w-4 h-4 mr-2" />
                       共鸣 · 回响
                    </h3>

                    <div className="animate-fade-in relative z-10">
                        <p className="text-slate-300 leading-relaxed italic text-sm md:text-base">
                            {selectedEvent.analysis}
                        </p>
                        <div className="mt-4 flex justify-end">
                            <span className="text-[10px] text-cyan-600 font-mono tracking-widest">BY NIGHT BREEZE</span>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Render List View
  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      <header className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-cyan-400 serif tracking-wide flex items-center md:justify-start justify-center">
          <Globe className="w-8 h-8 mr-3" />
          我们还认识这个世界吗？
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto md:mx-0">
          通过全球的感动瞬间，重新校准灵魂的坐标。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockEvents.map((event) => (
          <div 
            key={event.id} 
            onClick={() => handleSelect(event)}
            className="group cursor-pointer glass-panel rounded-2xl overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-cyan-900/10"
          >
            <div className="h-48 relative overflow-hidden">
               <img src={event.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="event" />
               <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> {event.location}
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
               <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
               <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                 {event.description}
               </p>
               <div className="text-cyan-500 text-sm font-medium flex items-center mt-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                  查看详情 <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
