
import React, { useState, useEffect } from 'react';
import { Settings, Send, Briefcase, Heart, Trash2, Mail, Coffee, Sparkles, Upload, User, Fingerprint, Music, MessageCircle, Crown, Eye, Code, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'CREATOR' | 'SETTINGS' | 'SUBMIT' | 'BUSINESS' | 'WIFE'>('IDENTITY');

  // Identity Stats State
  const [stats, setStats] = useState({
    joinDate: '2023-11-01', // Mock or store in LS
    songsListened: 0,
    postsCreated: 0,
    title: '九州流浪者',
    id: '000000'
  });

  useEffect(() => {
    // Calculate Stats from LocalStorage
    try {
        const musicHistory = JSON.parse(localStorage.getItem('jiuzhou_music_history') || '[]');
        const posts = JSON.parse(localStorage.getItem('jiuzhou_community_posts_v2') || '[]');
        const songsCount = musicHistory.length;
        const postsCount = posts.filter((p: any) => p.isAnonymous).length; // Only count user posts
        
        let userTitle = '九州流浪者';
        if (postsCount > 5) userTitle = '深渊凝视者';
        if (songsCount > 10) userTitle = '寻音猎人';
        if (songsCount > 30 && postsCount > 10) userTitle = '九州守护使';

        // Simple ID generation based on user agent or random (persistent ideally, but random for now)
        const userId = Math.floor(Math.random() * 900000 + 100000).toString();

        setStats({
            joinDate: new Date().toLocaleDateString('zh-CN'),
            songsListened: songsCount,
            postsCreated: postsCount,
            title: userTitle,
            id: userId
        });
    } catch (e) {
        console.warn("Error calculating stats");
    }
  }, []);

  // Logic for clearing cache
  const handleClearCache = () => {
    if (confirm('确定要清除所有本地缓存吗？这会重置音乐历史、AI分析结果等数据。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Logic for Wife form
  const [wifeForm, setWifeForm] = useState({ name: '', age: '', desc: '' });
  const [submittedWife, setSubmittedWife] = useState(false);

  const handleSubmitWife = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedWife(true);
    // Easter egg logic with improved UX (no alert block)
    setTimeout(() => {
        setSubmittedWife(false);
        setWifeForm({ name: '', age: '', desc: '' });
    }, 4000);
  };

  const personas = [
    { 
        name: '金阳 (Jin Yang)',
        title: '金融悟道 · 破局者',
        desc: '价值为盾，逻辑为矛。在K线的海洋中寻找人性的锚点，负责九州世界的经济逻辑与博弈智慧。',
        icon: Zap,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10'
    },
    { 
        name: '观聿 (Guan Yu)',
        title: '九州史官 · 执笔者',
        desc: '以笔为剑，记录九州的日升月落。负责整理思想碎片，撰写《九州志》与《剑来》评注。',
        icon: User,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    { 
        name: '夜风 (Night Breeze)',
        title: '树洞守夜 · 聆听者',
        desc: '穿行在匿名社区的虚空行者。他听见过最多的秘密，也为无数孤独的灵魂开具过音乐处方。',
        icon: Eye,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10'
    },
    { 
        name: 'AthenDrakomin',
        title: '代码架构 · 造物主',
        desc: '九州世界的底层架构师。构建系统的矩阵，编织数字的罗网，确保每一个比特的稳定运行。',
        icon: Code,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
       <header>
        <h2 className="text-3xl font-bold text-white serif tracking-wide">关于九州</h2>
        <p className="text-slate-400 mt-2">Jiuzhou Group • 连接每一个有趣的灵魂。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="glass-panel rounded-2xl p-4 space-y-2 h-fit">
           <button onClick={() => setActiveTab('IDENTITY')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'IDENTITY' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Fingerprint className="w-5 h-5" /> <span>我的身份</span>
           </button>
           <button onClick={() => setActiveTab('CREATOR')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'CREATOR' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Crown className="w-5 h-5" /> <span>创造者档案</span>
           </button>
           <button onClick={() => setActiveTab('SETTINGS')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'SETTINGS' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Settings className="w-5 h-5" /> <span>通用设置</span>
           </button>
           <button onClick={() => setActiveTab('SUBMIT')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'SUBMIT' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Send className="w-5 h-5" /> <span>内容投稿</span>
           </button>
           <button onClick={() => setActiveTab('BUSINESS')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'BUSINESS' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Briefcase className="w-5 h-5" /> <span>商务合作</span>
           </button>
           <div className="h-px bg-slate-800 my-2"></div>
           <button onClick={() => setActiveTab('WIFE')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'WIFE' ? 'bg-pink-500/20 text-pink-400' : 'text-pink-300/70 hover:bg-pink-500/10'}`}>
              <Heart className="w-5 h-5" /> <span>给作者介绍对象</span>
           </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
            {activeTab === 'IDENTITY' && (
                <div className="flex flex-col items-center justify-center animate-fade-in">
                    {/* The Card */}
                    <div className="w-full max-w-md aspect-[1.58/1] rounded-3xl relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-amber-500/30 group transition-transform duration-500 hover:scale-105">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>

                        {/* Content */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-amber-500 font-bold tracking-widest text-xs mb-1">JIUZHOU PASS</div>
                                    <div className="text-white font-serif text-2xl font-bold tracking-wide">九州通行证</div>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white serif font-bold text-lg">九</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="text-center">
                                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Music</div>
                                    <div className="text-amber-400 font-mono text-xl font-bold flex items-center justify-center">
                                        <Music className="w-3 h-3 mr-1" /> {stats.songsListened}
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-slate-800"></div>
                                <div className="text-center">
                                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Posts</div>
                                    <div className="text-rose-400 font-mono text-xl font-bold flex items-center justify-center">
                                        <MessageCircle className="w-3 h-3 mr-1" /> {stats.postsCreated}
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-slate-800"></div>
                                <div className="text-center">
                                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Since</div>
                                    <div className="text-slate-300 font-mono text-sm font-bold mt-1">
                                        {stats.joinDate.split('/')[0]}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Current Title</div>
                                <div className="text-white text-3xl serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                                    {stats.title}
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="text-slate-600 font-mono text-xs tracking-[0.2em]">{stats.id}</div>
                                    <Fingerprint className="w-8 h-8 text-slate-800 group-hover:text-amber-500/20 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center space-y-2">
                        <p className="text-slate-400 text-sm">此卡片记录了你在九州世界的精神足迹。</p>
                        <p className="text-xs text-slate-600">继续探索，解锁更高阶的头衔。</p>
                    </div>
                </div>
            )}

            {activeTab === 'CREATOR' && (
                <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                    {personas.map((persona) => (
                        <div key={persona.name} className="glass-panel p-6 rounded-2xl group hover:border-slate-600 transition-all hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${persona.bg}`}>
                                    <persona.icon className={`w-6 h-6 ${persona.color}`} />
                                </div>
                                <div className="text-xs text-slate-500 font-mono uppercase tracking-wider border border-slate-800 px-2 py-1 rounded">
                                    PROFILE
                                </div>
                            </div>
                            <h3 className={`text-xl font-bold mb-1 ${persona.color}`}>{persona.name}</h3>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{persona.title}</div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {persona.desc}
                            </p>
                        </div>
                    ))}
                    <div className="md:col-span-2 text-center pt-8 border-t border-slate-800 mt-4">
                        <p className="text-slate-500 italic text-sm">
                            "我们在不同的维度相遇，共同构建了九州的模样。"
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'SETTINGS' && (
                <div className="glass-panel p-8 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-slate-700 pb-4">应用设置</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-slate-200">清除本地缓存</h4>
                            <p className="text-sm text-slate-500">修复显示异常，重置所有状态。</p>
                        </div>
                        <button onClick={handleClearCache} className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex items-center">
                            <Trash2 className="w-4 h-4 mr-2" /> 清除数据
                        </button>
                    </div>
                     <div className="flex items-center justify-between opacity-50 pointer-events-none">
                        <div>
                            <h4 className="font-medium text-slate-200">暗黑模式</h4>
                            <p className="text-sm text-slate-500">九州社区目前仅支持暗黑模式。</p>
                        </div>
                        <div className="w-10 h-6 bg-slate-700 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                        </div>
                    </div>
                    <div className="pt-6 text-xs text-slate-600 text-center">
                        Jiuzhou Group v2.0.0 (Amber)
                    </div>
                </div>
            )}

            {activeTab === 'SUBMIT' && (
                 <div className="glass-panel p-8 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-slate-700 pb-4">内容投稿</h3>
                    <p className="text-slate-400">如果你有感人的故事、动听的音乐或深刻的感悟，欢迎分享给我们。我们会认真阅读每一份投稿。</p>
                    <div className="space-y-4">
                        <input type="text" placeholder="标题 / 主题" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-base md:text-sm text-slate-200 focus:outline-none focus:border-amber-500" />
                        <textarea placeholder="内容描述..." className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-base md:text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none" />
                         <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-500 hover:border-slate-500 cursor-pointer transition-colors flex flex-col items-center">
                            <Upload className="w-8 h-8 mb-2 opacity-50" />
                            <span>点击上传附件 (图片/音频/文档)</span>
                        </div>
                         <button className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20">
                            提交审核
                        </button>
                    </div>
                 </div>
            )}
            
            {activeTab === 'BUSINESS' && (
                <div className="glass-panel p-8 rounded-2xl space-y-8 text-center">
                     <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full mx-auto flex items-center justify-center mb-4 border border-slate-700 shadow-xl">
                        <Briefcase className="w-10 h-10 text-amber-500" />
                     </div>
                     <h3 className="text-2xl font-bold text-white serif">九州工作室 (Jiuzhou Studio)</h3>
                     <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                        我们致力于打造最纯粹的数字化精神角落。如果您对我们的愿景感兴趣，或希望进行品牌联动、广告投放，欢迎联系。
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <div className="bg-slate-800/50 p-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-amber-500/30">
                            <Mail className="w-5 h-5 text-amber-400" />
                            <span className="text-slate-200 text-sm">contact@jiuzhougroup.vip</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-amber-500/30">
                            <Coffee className="w-5 h-5 text-amber-400" />
                            <span className="text-slate-200 text-sm">请作者喝咖啡</span>
                        </div>
                     </div>
                </div>
            )}

            {activeTab === 'WIFE' && (
                 <div className="glass-panel p-8 rounded-2xl space-y-6 relative overflow-hidden border border-pink-500/20">
                    <Sparkles className="absolute -top-10 -right-10 text-pink-500/10 w-64 h-64 animate-pulse" />
                    
                    {submittedWife && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fade-in">
                            <div className="text-center p-8">
                                <Heart className="w-20 h-20 text-pink-500 mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">收到心意！</h3>
                                <p className="text-pink-300">九州红娘系统已启动，作者正在火速赶来... 😍</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center space-x-4 border-b border-pink-500/20 pb-4 relative z-10">
                        <div className="p-3 bg-pink-500/10 rounded-full">
                             <Heart className="w-8 h-8 text-pink-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-pink-400">给作者介绍对象</h3>
                            <p className="text-xs text-pink-300/70">这是一个非常严肃（bushi）的功能模块</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmitWife} className="space-y-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">称呼 / 昵称</label>
                                <input required value={wifeForm.name} onChange={e => setWifeForm({...wifeForm, name: e.target.value})} type="text" className="w-full bg-slate-900/50 border border-slate-700 focus:border-pink-500 rounded-xl p-3 text-base md:text-sm text-slate-200 outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">星座 / MBTI</label>
                                <input required value={wifeForm.age} onChange={e => setWifeForm({...wifeForm, age: e.target.value})} type="text" className="w-full bg-slate-900/50 border border-slate-700 focus:border-pink-500 rounded-xl p-3 text-base md:text-sm text-slate-200 outline-none transition-colors" />
                            </div>
                        </div>
                         <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">安利理由 / 留言</label>
                                <textarea required value={wifeForm.desc} onChange={e => setWifeForm({...wifeForm, desc: e.target.value})} className="w-full h-32 bg-slate-900/50 border border-slate-700 focus:border-pink-500 rounded-xl p-3 text-base md:text-sm text-slate-200 outline-none resize-none transition-colors" placeholder="夸夸她..." />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold">照片 (假装上传)</label>
                            <div className="border-2 border-dashed border-slate-700 hover:border-pink-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors group bg-slate-900/30">
                                <span className="text-slate-500 group-hover:text-pink-400 transition-colors flex items-center justify-center">
                                    <Upload className="w-4 h-4 mr-2" /> 点击上传绝美照片
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-900/20 transition-all transform active:scale-95 flex items-center justify-center">
                            <Send className="w-4 h-4 mr-2" /> 发送红线
                        </button>
                    </form>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};
