import React, { useState, useEffect } from 'react';
import { FinanceQuote, Song } from '../types';
import { TrendingUp, BarChart2, ChevronLeft, BookOpen, Volume2, StopCircle, PlusCircle, Brain, Target } from 'lucide-react';
import { tts } from '../services/ttsService';
import { MarketDashboard } from '../components/MarketDashboard';

interface FinancePageProps {
  addToPlaylist?: (song: Song) => void;
  setIsTTSActive?: (active: boolean) => void;
}

const quotes: FinanceQuote[] = [
  {
    id: '1',
    title: '人性不变定律',
    author: 'Jesse Livermore',
    quote: '华尔街没有新鲜事，因为投机像山岳一样古老。股市今天发生的事情以前发生过，以后还会发生。因为人性从未改变。',
    context: '1929年，美国股市崩盘前夕。当所有人都在疯狂买入，相信“永久繁荣”的高原时，杰西·利弗莫尔却在悄悄做空。他敏锐地察觉到了市场狂热背后的脆弱。这段话道出了金融市场的终极真理：技术在变，算法在变，但贪婪与恐惧的人性循环永远不会变。',
    image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1600&auto=format&fit=crop',
    analysis: '利弗莫尔看透了K线背后的贪婪与恐惧。他知道，驱动市场的不是数据，而是人心。但他的悲剧也在于，看透了人性，却无法战胜自己的人性。这是一面永恒的镜子。'
  },
  {
    id: '2',
    title: '反身性谬误',
    author: 'George Soros',
    quote: '世界经济史是一部基于假象和谎言的连续剧。要获得财富，做法就是认清其假象，投入其中，然后在假象被公众认识之前退出游戏。',
    context: '1992年，索罗斯狙击英镑。他利用了英国央行维持高汇率的政策与经济衰退现实之间的矛盾。他的“反身性理论”认为，参与者的偏见会影响市场价格，而价格反过来又会强化偏见，形成自我强化的循环，直到泡沫破裂。他从不迷信完美的均衡，而是寻找市场的错误。',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1600&auto=format&fit=crop',
    analysis: '反身性打破了“市场总是正确”的迷信。索罗斯告诉我们，谬误才是市场的常态。获利的关键不在于寻找真理，而在于发现并利用大众的集体幻觉。这是一种冷酷而高效的猎人思维。'
  },
  {
    id: '3',
    title: '长期主义的胜利',
    author: 'Warren Buffett',
    quote: '在别人贪婪时恐惧，在别人恐惧时贪婪。',
    context: '2008年全球金融危机，雷曼兄弟倒闭，市场一片哀嚎。当所有人都认为资本主义要完蛋时，巴菲特开始大量买入高盛和通用电气的股票。他坚信美国的国运，也坚信周期的力量。这句看似简单的话，是对逆向思维和情绪控制的最高要求。',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop',
    analysis: '逆向投资说起来容易，做起来难如登天。它要求极其强大的心理素质和对价值的绝对信仰。巴菲特赚的不是波动的钱，而是时间的钱，是国运的钱。'
  },
  {
    id: '4',
    title: '价值逻辑共振',
    author: 'Jin Yang (金阳)',
    quote: '底牌是价值，翻牌是逻辑，对手是人性。没有底牌的博弈是赌博，不懂翻牌的坚守是死扛。',
    context: '金阳，九州世界的构建者，亦是金融市场的实战派。他摒弃了单一的教条主义，主张“立体作战”。他认为，价值决定了资产的下限（安全边际），而中短期的市场逻辑与情绪决定了爆发的上限与时机。投资不是静态的等待，而是动态的博弈。在确定的价值基础上，利用人性的贪婪与恐惧捕捉逻辑兑现的瞬间，才是从市场中持续获利的根本之道。',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=1600&auto=format&fit=crop',
    analysis: '金阳的策略是“体”与“用”的结合。价值是盾，防守底线；逻辑是矛，进攻超额。在九州的多重宇宙中，他看清了规则的本质：无论是代码、文字还是K线，本质上都是对世界运行规律的重构与利用。'
  }
];

export const FinancePage: React.FC<FinancePageProps> = ({ addToPlaylist, setIsTTSActive }) => {
  const [selectedQuote, setSelectedQuote] = useState<FinanceQuote | null>(null);
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
  }, [selectedQuote]);

  const handleSelect = (quote: FinanceQuote) => {
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
      if (setIsTTSActive) setIsTTSActive(true);
      
      const textToRead = `${selectedQuote.title}。作者：${selectedQuote.author}。${selectedQuote.quote}。背景：${selectedQuote.context}`;
      // Use 'DEEP' persona for serious financial topics
      tts.speak(textToRead, 'DEEP', () => {
        setIsSpeaking(false);
        if (setIsTTSActive) setIsTTSActive(false);
      });
    }
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedQuote || !addToPlaylist) return;

    const ttsSong: Song = {
      id: `fin-tts-${selectedQuote.id}`,
      title: `${selectedQuote.author}: ${selectedQuote.title}`,
      artist: '九州·金道',
      cover: selectedQuote.image,
      url: '', 
      duration: '语音',
      bitrate: 'AI Voice',
      isTTS: true,
      ttsData: {
        text: `${selectedQuote.title}。${selectedQuote.quote}。${selectedQuote.context}`,
        persona: 'DEEP'
      }
    };
    addToPlaylist(ttsSong);
    alert('已加入播放列表');
  };

  // Detail View
  if (selectedQuote) {
    return (
      <div className="animate-fade-in pb-20">
        <button 
          onClick={() => setSelectedQuote(null)}
          className="mb-6 flex items-center text-slate-400 hover:text-yellow-400 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 返回金道
        </button>

        {/* Immersive Header */}
        <div className="relative w-full h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-10 border border-yellow-900/30">
           <img src={selectedQuote.image} className="w-full h-full object-cover filter grayscale opacity-60" alt="scene" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
           
           <div className="absolute top-8 right-8">
               <div className="w-20 h-20 rounded-full border-2 border-yellow-600/30 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                   <TrendingUp className="w-10 h-10 text-yellow-500" />
               </div>
           </div>

           <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <div className="flex items-center space-x-3 mb-4">
                 <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20 tracking-wider">
                    {selectedQuote.author}
                 </span>
                 <div className="h-px flex-1 bg-yellow-500/20 mr-12"></div>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white serif leading-relaxed">
                 “{selectedQuote.quote}”
              </h1>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Context */}
           <div className="lg:col-span-2 space-y-8">
               <div className="glass-panel p-8 rounded-2xl border-l-4 border-yellow-600/50">
                   <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center">
                            <BookOpen className="w-5 h-5 mr-3 text-yellow-500" />
                            博弈背景
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
                                    ? 'bg-yellow-600 text-white animate-pulse shadow-[0_0_15px_rgba(202,138,4,0.5)]' 
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}
                            `}
                            >
                                {isSpeaking ? (
                                    <><StopCircle className="w-4 h-4 mr-2" /> 停止聆听</>
                                ) : (
                                    <><Volume2 className="w-4 h-4 mr-2" /> 聆听真理</>
                                )}
                            </button>
                        </div>
                   </div>
                   <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light text-lg">
                       {selectedQuote.context}
                   </p>
               </div>
           </div>

           {/* Static Analysis Section */}
           <div className="lg:col-span-1">
               <div className="sticky top-24 space-y-6">
                   <div className="bg-gradient-to-b from-slate-900 to-black p-8 rounded-2xl border border-yellow-900/40 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-50"></div>
                        
                        <h3 className="text-lg font-bold text-yellow-500 mb-6 flex items-center uppercase tracking-widest">
                            <Brain className="w-4 h-4 mr-2" />
                            金阳 · 破局
                        </h3>

                        <div className="animate-fade-in relative z-10">
                            <p className="text-slate-300 italic leading-relaxed text-sm md:text-base border-l-2 border-yellow-700/50 pl-4 py-1">
                                {selectedQuote.analysis}
                            </p>
                            <div className="mt-6 flex justify-end">
                                <span className="text-[10px] text-yellow-600 border border-yellow-600/30 px-2 py-1 rounded">INVESTMENT NOTE</span>
                            </div>
                        </div>
                   </div>
               </div>
           </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-8 pb-24 animate-fade-in">
        <header>
            <h2 className="text-3xl font-bold text-yellow-500 serif tracking-wide flex items-center">
                <TrendingUp className="w-8 h-8 mr-3" />
                金融悟道 · JinDao
            </h2>
            <p className="text-yellow-200/50 mt-2">在K线的波动中，看见人性的贪婪与恐惧。</p>
        </header>
        
        {/* Real-time Market Dashboard */}
        <MarketDashboard />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quotes.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => handleSelect(item)}
                    className="group cursor-pointer bg-gradient-to-b from-slate-900 to-black border border-slate-800 hover:border-yellow-600/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(202,138,4,0.1)]"
                >
                    <div className="h-48 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img src={item.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={item.title} loading="lazy" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-yellow-500 border border-yellow-500/30 font-bold uppercase tracking-widest">
                            {item.author}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors flex items-center">
                            <Target className="w-4 h-4 mr-2 text-slate-600 group-hover:text-yellow-500" />
                            {item.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed font-serif italic">
                            “{item.quote}”
                        </p>
                        <div className="mt-6 flex items-center text-xs text-slate-600 font-mono group-hover:text-yellow-600/70 transition-colors">
                             <BarChart2 className="w-3 h-3 mr-2" />
                             点击参悟
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};