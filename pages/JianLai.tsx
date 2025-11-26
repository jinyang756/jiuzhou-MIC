
import React, { useState, useEffect } from 'react';
import { JianLaiQuote, Song } from '../types';
import { Sword, BookOpen, Feather, Volume2, StopCircle, PlusCircle, ChevronLeft } from 'lucide-react';
import { tts } from '../services/ttsService';

interface JianLaiPageProps {
  addToPlaylist?: (song: Song) => void;
  setIsTTSActive?: (active: boolean) => void;
}

// Expanded mock data with rich story context and pre-written analysis
const quotes: JianLaiQuote[] = [
  {
    id: '1',
    character: '陈平安',
    quote: '有些道理，是可以讲一讲的。如果讲不通，那我再出剑。',
    sceneDescription: '那一年，剑气长城之上，战火暂歇。少年陈平安坐在一处破败的城头，脚下是无数妖族的尸骸，头顶是晦暗不明的天色。他擦拭着手中的长剑，眼神不再是泥瓶巷里的懵懂，也不全是纯粹的杀意。\n\n身边有老剑修讥笑他不够爽利，杀妖便杀妖，讲什么道理？陈平安没有反驳，只是看着远方。他这一路走来，见过太多的强者挥刀向弱者，也见过太多的规矩变成了束缚好人的枷锁。他练拳，是为了讲理；他练剑，是为了让这世道愿意听他讲理。这并非迂腐，而是一个草鞋少年对这个残酷世界最后的温柔与坚持。',
    // Epic Misty Mountains / Great Wall vibe
    image: 'https://images.unsplash.com/photo-1563385669-7988352db73b?q=80&w=1600&auto=format&fit=crop',
    analysis: '讲理与出剑，是陈平安的一体两面。这并非简单的先礼后兵，而是他对这个残酷修真界秩序的重新定义。大多数人只信奉力量，而他试图在力量之上，架构起道德的屋脊。这种“天真”，才是最锋利的剑。'
  },
  {
    id: '2',
    character: '阿良',
    quote: '我叫阿良，善良的良。',
    sceneDescription: '江湖路远，风沙漫天。一个头戴斗笠、腰悬酒壶的汉子缓缓走来，哪怕对面是数位成名已久的大宗师，甚至是天上垂钓的仙人，他也依旧是一副吊儿郎当的模样。\n\n阿良的剑，不出则已，一出便是天地变色。但他最让人记住的，往往不是他的剑术，而是他那句看似玩笑的自我介绍。在这个尔虞我诈、弱肉强食的修真界，“善良”二字显得多么可笑又多么奢侈。可阿良用他的一生证明了，真正的无敌，不是杀力最高，而是即便看透了世界的黑暗，依然选择做一个“善良”的游侠。',
    // Deep Forest / Bamboo / Swordsman Path
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=1600&auto=format&fit=crop',
    analysis: '阿良的“善良”，是历经沧桑后的选择。他见过最高处的风景，也见过最底层的泥泞，却依然愿意对这个世界报以戏谑的温柔。这种举重若轻，是真正的无敌心境。'
  },
  {
    id: '3',
    character: '齐静春',
    quote: '君子坐而论道，少年起而行之。',
    sceneDescription: '骊珠洞天破碎前夕，整座天下的大道压胜都落在了这个读书人的肩头。齐静春本可以凭借圣人修为一走了之，或者顺应大势牺牲小镇百姓以求自保。但他选择了最笨的一条路——以一己之力，抗下天道反噬。\n\n在书院的最后一课，他看着底下的孩子们，目光温和如初。他教了一辈子的书，讲了一辈子的道理，最后用自己的生命给孩子们上了最后一课：道理不是放在嘴边说的，是要用脚一步步走出来的。白衣消散的那一刻，浩然天下少了一位读书人，但人间多了一颗名为“希望”的种子。',
    // Ancient Architecture / Roof details / Light
    image: 'https://images.unsplash.com/photo-1542640244-7e67286feb8f?q=80&w=1600&auto=format&fit=crop',
    analysis: '齐静春的死，是儒家“知其不可而为之”的最高注脚。他用生命为陈平安撑起了一片天，也为浩然天下撑起了一个“理”字。他是真正的读书种子，温润如玉，却坚韧如山。'
  }
];

export const JianLaiPage: React.FC<JianLaiPageProps> = ({ addToPlaylist, setIsTTSActive }) => {
  const [selectedQuote, setSelectedQuote] = useState<JianLaiQuote | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop TTS when unmounting or switching quotes
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
  }, [selectedQuote]);

  const handleSelect = (quote: JianLaiQuote) => {
    setSelectedQuote(quote);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
      if (setIsTTSActive) setIsTTSActive(false);
    } else if (selectedQuote) {
      setIsSpeaking(true);
      if (setIsTTSActive) setIsTTSActive(true); // Lower music volume
      
      // Combine title and description for reading
      const textToRead = `角色：${selectedQuote.character}。经典台词：${selectedQuote.quote}。背景故事：${selectedQuote.sceneDescription}`;
      tts.speak(textToRead, 'DEEP', () => {
        setIsSpeaking(false);
        if (setIsTTSActive) setIsTTSActive(false); // Restore music volume
      });
    }
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedQuote || !addToPlaylist) return;

    const ttsSong: Song = {
      id: `jl-tts-${selectedQuote.id}`,
      title: `${selectedQuote.character}·${selectedQuote.quote.substring(0, 5)}...`,
      artist: '九州·剑来',
      cover: selectedQuote.image,
      url: '', // No URL for TTS assets
      duration: '语音',
      bitrate: 'AI Voice',
      isTTS: true,
      ttsData: {
        text: `角色：${selectedQuote.character}。经典台词：${selectedQuote.quote}。背景故事：${selectedQuote.sceneDescription}`,
        persona: 'DEEP'
      }
    };
    addToPlaylist(ttsSong);
    alert('已加入播放列表');
  };

  // Render Detail View
  if (selectedQuote) {
    return (
      <div className="animate-fade-in pb-20">
        <button 
          onClick={() => setSelectedQuote(null)}
          className="mb-6 flex items-center text-slate-400 hover:text-amber-500 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 返回剑来世界
        </button>

        <div className="relative w-full h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-10 group">
          <img src={selectedQuote.image} className="w-full h-full object-cover" alt="scene" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
             <div className="flex items-center space-x-3 mb-4 opacity-0 translate-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 backdrop-blur-md">
                   {selectedQuote.character}
                </span>
                <span className="text-amber-100/60 text-sm tracking-widest uppercase">经典瞬间</span>
             </div>
             <h1 className="text-3xl md:text-5xl font-bold text-white serif leading-snug opacity-0 translate-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                “{selectedQuote.quote}”
             </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Story Section */}
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-8 rounded-2xl border-l-4 border-amber-500/50">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <BookOpen className="w-5 h-5 mr-3 text-amber-500" />
                        背景故事
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
                                ? 'bg-amber-500 text-white animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}
                          `}
                        >
                            {isSpeaking ? (
                                <><StopCircle className="w-4 h-4 mr-2" /> 停止聆听</>
                            ) : (
                                <><Volume2 className="w-4 h-4 mr-2" /> 沉浸聆听</>
                            )}
                        </button>
                    </div>
                 </div>
                 
                 <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-serif">
                       {selectedQuote.sceneDescription}
                    </p>
                 </div>
              </div>
           </div>

           {/* Static Analysis Section */}
           <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                 <div className="bg-[#1c1917] p-8 rounded-2xl border border-stone-800 shadow-xl relative overflow-hidden group">
                    {/* Stamp Effect */}
                    <div className="absolute top-4 right-4 w-16 h-16 border-2 border-red-800/50 rounded-lg flex items-center justify-center rotate-12 opacity-50 pointer-events-none">
                        <span className="text-red-800/50 font-serif text-xs font-bold writing-vertical">九州评注</span>
                    </div>

                    <h3 className="text-lg font-bold text-amber-600 mb-6 flex items-center uppercase tracking-widest font-serif border-b border-stone-800 pb-2">
                       <Feather className="w-4 h-4 mr-2" />
                       九州 · 评注
                    </h3>
                    
                    <div className="animate-fade-in">
                        <p className="text-stone-300 font-serif leading-relaxed text-base italic">
                            {selectedQuote.analysis}
                        </p>
                        <div className="mt-6 text-xs text-stone-500 text-right font-mono">— 观聿 笔</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Render Gallery List
  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-bold text-amber-500 serif tracking-widest flex items-center">
            <Sword className="w-8 h-8 mr-3" />
            剑来 · 瞬间
          </h2>
          <p className="text-amber-100/60 mt-2">我们感动的，是那些美好的回忆。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quotes.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleSelect(item)}
            className="group cursor-pointer relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-lg hover:shadow-amber-900/20 hover:-translate-y-2"
          >
            <img 
              src={item.image} 
              alt={item.character}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
               <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-amber-100 serif mb-2">{item.character}</h3>
                  <div className="w-10 h-1 bg-amber-500 rounded-full mb-4 group-hover:w-20 transition-all duration-300"></div>
                  <p className="text-amber-100/90 text-sm line-clamp-3 italic leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    “{item.quote}”
                  </p>
               </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
               <BookOpen className="text-amber-500 w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
