
import React, { useState } from 'react';
import { BlogPost, BlogTopic } from '../types';
import { Calendar, Tag, ArrowRight, Layers, BookOpen, ChevronLeft, ChevronRight, List, CheckCircle2, PenTool, Clock } from 'lucide-react';

// --- Mock Data ---

const mockTopics: BlogTopic[] = [
  {
    id: 'jianlai-deep',
    title: '剑来·问道篇',
    description: '深度解析《剑来》中草蛇灰线的伏笔与人物心境的演变，从陈平安的练拳到练心。',
    // Ink / Mountain Abstract
    cover: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1600&auto=format&fit=crop', 
    postCount: 3,
    lastUpdated: '2023-10-25',
    status: 'ONGOING'
  },
  {
    id: 'digital-zen',
    title: '数字极简主义',
    description: '在算法的洪流中重建内心的秩序。关于注意力管理、多巴胺断舍离的实践记录。',
    // Quiet Coffee / Minimalist
    cover: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1600&auto=format&fit=crop',
    postCount: 2,
    lastUpdated: '2023-10-24',
    status: 'COMPLETED'
  }
];

const mockPosts: BlogPost[] = [
  {
    id: '1',
    topicId: 'digital-zen',
    order: 1,
    title: '数字极简主义与心灵秩序',
    excerpt: '在信息过载的时代，如何通过减少数字噪音来重建内心的宁静与秩序...',
    content: `
      <p>我们生活在一个"永远在线"的时代。手机不仅仅是工具，它已经延伸成为了我们这种生物的"外挂器官"。</p>
      <p>每天醒来第一件事是摸手机，睡觉前最后一件事是刷短视频。我们的注意力被切割成无数个15秒的碎片。这种碎片化的生活，正在从根本上重塑我们的大脑回路。</p>
      <h3>什么是数字极简主义？</h3>
      <p>卡尔·纽波特在《数字极简主义》一书中提出：这是一种使用技术理念，即不仅关注你使用哪些工具，更关注如何使用这些工具。</p>
      <p>它不是让你扔掉手机，而是让你重新夺回控制权。不是被算法喂养，而是主动选择摄入的信息。</p>
      <h3>实践的第一步：断舍离</h3>
      <p>试着删除那些"打发时间"的APP。如果你需要它们，你会在浏览器里找到它们。但仅仅是增加了"打开"这个动作的阻力，就能帮你过滤掉80%无意义的点击。</p>
      <p>保持内心的秩序，从清理屏幕开始。</p>
    `,
    date: '2023-10-24',
    category: '生活哲学',
    // Nature / Quiet
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop' 
  },
  {
    id: '1-2',
    topicId: 'digital-zen',
    order: 2,
    title: '多巴胺戒断：找回深度阅读的能力',
    excerpt: '为什么我们越来越难读完一本书？如何通过多巴胺戒断重启深度思考...',
    content: `
      <p>上一次你心无旁骛地读完一章书，是什么时候？</p>
      <p>即时满足的回路让我们对"无聊"的容忍度降到了历史最低点。一旦大脑感觉到枯燥，手指就会下意识地滑动屏幕寻找下一个刺激点。</p>
      <p>深度阅读不仅仅是获取信息，它是一种精神的瑜伽。它强迫大脑维持在某种复杂的逻辑构建中，这在短视频时代是一种稀缺的能力。</p>
      <p>试试看，这个周末，把手机锁在抽屉里，只带一本书去公园。你会发现，时间变慢了，但灵魂变轻了。</p>
    `,
    date: '2023-10-26',
    category: '生活哲学',
    // Reading book
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1600&auto=format&fit=crop' 
  },
  {
    id: '2',
    topicId: 'jianlai-deep',
    order: 1,
    title: '论《剑来》中的因果与自由',
    excerpt: '陈平安走过的路，不仅仅是练拳，更是在因果交织的罗网中寻找那一线自由...',
    content: `
      <p>《剑来》的世界观最迷人的地方，在于那张密不透风的因果大网。</p>
      <p>陈平安从泥瓶巷走出来，每一步都算计，每一步都小心翼翼。很多人说他活得太累，不像个少年。但如果你身处那样一个大佬布局、圣人落子的世界，"活着"本身就是一种奢望。</p>
      <h3>什么是自由？</h3>
      <p>在烽火的笔下，自由不是随心所欲，不是想干什么就干什么。那是强者的特权，不是弱者的自由。</p>
      <p>陈平安追求的自由，是"讲理"。是哪怕我剑术通天，我也要和你坐下来，把道理讲清楚。如果道理讲不通，那我再出剑。</p>
      <p>这种克制，才是最大的自由。</p>
    `,
    date: '2023-10-20',
    category: '深度阅读',
    // Foggy Mountain
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop' 
  },
  {
    id: '2-2',
    topicId: 'jianlai-deep',
    order: 2,
    title: '齐静春：读书人的脊梁',
    excerpt: '那个白衣飘飘的教书匠，如何以一己之力，为这个世界扛下了三教辩论的重压...',
    content: `
      <p>齐静春，是《剑来》前期最令人意难平的角色。</p>
      <p>他是文圣首徒，本该是那个时代最耀眼的星辰。但他选择了一座小小的骊珠洞天，守着一群孩子，守着一种看似迂腐的规矩。</p>
      <p>"君子坐而论道，少年起而行之。"</p>
      <p>他用自己的死，给陈平安铺了一条路，也给这个世道留下了一颗种子。他证明了，读书读到极致，不是为了明哲保身，而是为了"当仁不让"。</p>
    `,
    date: '2023-10-22',
    category: '人物志',
    // Ancient Architecture
    image: 'https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?q=80&w=1600&auto=format&fit=crop' 
  },
  {
    id: '2-3',
    topicId: 'jianlai-deep',
    order: 3,
    title: '阿良：江湖就是酒和剑',
    excerpt: '那个戴着斗笠的男人，告诉了我们什么是真正的江湖...',
    content: `
      <p>阿良的出现，让那座沉闷的江湖瞬间鲜活了起来。</p>
      <p>他不像其他大修士那样高高在上。他会偷看寡妇洗澡（误），他会为了喝一口酒死皮赖脸。但他出剑的时候，整座天下都要低头。</p>
      <p>阿良代表了我们心中那个最理想的江湖梦：潇洒、无拘无束，但心中有大义。</p>
      <p>"我叫阿良，善良的良。" 这一句话，道尽了多少风流。</p>
    `,
    date: '2023-10-25',
    category: '人物志',
    // Alcohol / Rustic
    image: 'https://images.unsplash.com/photo-1535925343803-3162799303d8?q=80&w=1600&auto=format&fit=crop' 
  },
  {
    id: '3',
    title: '为什么我们听老歌会流泪？',
    excerpt: '音乐作为记忆的锚点，如何在特定的频率下瞬间击穿防御机制...',
    content: `
      <p>前奏响起的瞬间，你突然愣住了。并没有什么惊天动地的事情发生，但眼泪就是止不住。</p>
      <p>这种体验你一定有过。其实，我们怀念的不是那首歌，而是听那首歌时的自己。</p>
      <p>海马体负责记忆，杏仁核负责情绪。音乐巧妙地连接了这两者。老歌就像一把钥匙，不需要密码，直接打开了那扇尘封的门。</p>
      <p>那是回不去的夏天，是再也见不到的人。是那个还相信永远的自己。</p>
    `,
    date: '2023-10-15',
    category: '情感共鸣',
    // Vinyl Record
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop' 
  }
];

export const BlogPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LATEST' | 'SERIES'>('LATEST');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<BlogTopic | null>(null);

  // --- Helpers ---

  const handleTopicSelect = (topic: BlogTopic) => {
    setSelectedTopic(topic);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostSelect = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedPost(null);
    setSelectedTopic(null);
  };

  const handleBackToTopic = () => {
    setSelectedPost(null);
  };

  // --- Derived State for Reader Navigation ---

  const currentTopic = selectedPost?.topicId 
    ? mockTopics.find(t => t.id === selectedPost.topicId) 
    : null;

  const topicPosts = currentTopic
    ? mockPosts.filter(p => p.topicId === currentTopic.id).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const currentPostIndex = topicPosts.findIndex(p => p.id === selectedPost?.id);
  const prevPost = currentPostIndex > 0 ? topicPosts[currentPostIndex - 1] : null;
  const nextPost = currentPostIndex !== -1 && currentPostIndex < topicPosts.length - 1 ? topicPosts[currentPostIndex + 1] : null;


  // --- Render Functions ---

  const renderPostReader = () => {
    if (!selectedPost) return null;
    
    return (
      <div className="animate-fade-in max-w-4xl mx-auto pb-20">
        <button 
          onClick={currentTopic ? handleBackToTopic : handleBackToHome}
          className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
          {currentTopic ? `返回专题：${currentTopic.title}` : '返回列表'}
        </button>

        <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-2xl">
           <img 
             src={selectedPost.image} 
             className="w-full h-full object-cover" 
             alt={selectedPost.title}
             loading="lazy" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
           <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <div className="flex items-center space-x-3 mb-4">
                 <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-blue-500/30">
                    {selectedPost.category}
                 </span>
                 <span className="text-slate-400 text-sm flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {selectedPost.date}
                 </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white serif leading-tight">
                {selectedPost.title}
              </h1>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
           {/* Sidebar / Series Nav */}
           {currentTopic && (
              <div className="md:w-64 flex-shrink-0 order-2 md:order-1">
                 <div className="sticky top-24 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-5">
                    <h4 className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-4 flex items-center">
                       <Layers className="w-3 h-3 mr-2" /> 
                       专题目录
                    </h4>
                    <h3 className="font-bold text-white mb-2 line-clamp-2">{currentTopic.title}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${currentTopic.status === 'ONGOING' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                            {currentTopic.status === 'ONGOING' ? '连载中' : '已完结'}
                        </span>
                        <span className="text-[10px] text-slate-500">更新于 {currentTopic.lastUpdated}</span>
                    </div>

                    <div className="space-y-1 relative">
                       {/* Timeline line */}
                       <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-800"></div>
                       {topicPosts.map((p, idx) => (
                          <div 
                             key={p.id} 
                             onClick={() => handlePostSelect(p)}
                             className={`
                               relative pl-6 py-2 text-sm cursor-pointer transition-colors border-l-2
                               ${p.id === selectedPost.id 
                                 ? 'border-blue-500 text-blue-400 font-medium' 
                                 : 'border-transparent text-slate-500 hover:text-slate-300'}
                             `}
                          >
                             <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></span>
                             {p.id === selectedPost.id && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                             )}
                             <span className="mr-2 opacity-50">{idx + 1}.</span>
                             {p.title}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           )}

           {/* Main Content */}
           <div className={`flex-1 order-1 md:order-2 ${!currentTopic ? 'md:mx-auto md:max-w-3xl' : ''}`}>
              <article 
                 className="prose prose-invert prose-lg md:prose-xl max-w-none text-slate-300 leading-relaxed font-light font-sans"
                 dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }} 
              />
              
              <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
              
              {/* Footer Navigation */}
              {currentTopic ? (
                 <div className="grid grid-cols-2 gap-4">
                    {prevPost ? (
                       <button 
                          onClick={() => handlePostSelect(prevPost)}
                          className="group flex flex-col items-start p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-colors text-left"
                       >
                          <span className="text-xs text-slate-500 mb-2 flex items-center group-hover:text-blue-400 transition-colors"><ChevronLeft className="w-3 h-3 mr-1" /> 上一章</span>
                          <span className="text-white font-medium line-clamp-1">{prevPost.title}</span>
                       </button>
                    ) : <div></div>}
                    
                    {nextPost ? (
                       <button 
                          onClick={() => handlePostSelect(nextPost)}
                          className="group flex flex-col items-end p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-colors text-right"
                       >
                          <span className="text-xs text-slate-500 mb-2 flex items-center group-hover:text-blue-400 transition-colors">下一章 <ChevronRight className="w-3 h-3 ml-1" /></span>
                          <span className="text-white font-medium line-clamp-1">{nextPost.title}</span>
                       </button>
                    ) : <div></div>}
                 </div>
              ) : (
                <div className="text-center">
                    <p className="text-slate-500 italic">感谢阅读，期待下一次的灵感相遇。</p>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  const renderTopicDetail = () => {
    if (!selectedTopic) return null;
    const posts = mockPosts.filter(p => p.topicId === selectedTopic.id).sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div className="animate-fade-in space-y-8">
        <button 
          onClick={handleBackToHome}
          className="flex items-center text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 返回专题库
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
              <img 
                src={selectedTopic.cover} 
                alt={selectedTopic.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              
              {/* Status Badge */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border flex items-center shadow-lg
                    ${selectedTopic.status === 'ONGOING' 
                        ? 'bg-blue-500/90 text-white border-blue-400' 
                        : 'bg-emerald-500/90 text-white border-emerald-400'}`}>
                   {selectedTopic.status === 'ONGOING' ? <PenTool className="w-3 h-3 mr-1.5" /> : <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                   {selectedTopic.status === 'ONGOING' ? '连载中' : '已完结'}
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                 <h2 className="text-3xl font-bold text-white serif mb-2">{selectedTopic.title}</h2>
                 <p className="text-slate-300 text-sm">{selectedTopic.description}</p>
                 <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-slate-400 font-mono">
                    <span>最后更新</span>
                    <span>{selectedTopic.lastUpdated}</span>
                 </div>
              </div>
           </div>

           <div className="flex-1 w-full">
              <div className="glass-panel rounded-2xl p-6 md:p-8">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <List className="w-5 h-5 mr-2 text-blue-400" /> 目录 ({posts.length} 篇)
                    </div>
                    {selectedTopic.status === 'ONGOING' && (
                        <span className="text-xs text-blue-400 animate-pulse flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                            持续更新中
                        </span>
                    )}
                 </h3>
                 <div className="space-y-4">
                    {posts.map((post, idx) => (
                       <div 
                         key={post.id} 
                         onClick={() => handlePostSelect(post)}
                         role="button"
                         tabIndex={0}
                         onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handlePostSelect(post);
                            }
                         }}
                         className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                       >
                          <div className="flex items-center space-x-4">
                             <div className="w-8 h-8 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center font-mono text-sm group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                                {idx + 1}
                             </div>
                             <div>
                                <h4 className="text-white font-medium group-hover:text-blue-300 transition-colors">{post.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
                             </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-8 pb-24 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white serif tracking-wide">九州志</h2>
          <p className="text-slate-400">收录九州大地的思想碎片，重建精神的避难所。</p>
        </div>
        
        {/* Tabs */}
        <div className="bg-slate-900/50 p-1 rounded-xl flex items-center border border-slate-800">
           <button 
             onClick={() => setActiveTab('LATEST')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'LATEST' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
           >
             最新文章
           </button>
           <button 
             onClick={() => setActiveTab('SERIES')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'SERIES' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
           >
             专题连载
           </button>
        </div>
      </header>

      {activeTab === 'LATEST' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => handlePostSelect(post)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePostSelect(post);
                }
              }}
              tabIndex={0}
              role="button"
              className="group glass-panel rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy" 
                />
                {post.topicId && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white border border-white/10 flex items-center">
                    <Layers className="w-3 h-3 mr-1 text-blue-400" /> 连载中
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span className="flex items-center text-blue-400"><Tag className="w-3 h-3 mr-1" /> {post.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-blue-300 transition-colors serif line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div 
                  className="flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors mt-auto"
                >
                  阅读全文 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {mockTopics.map((topic) => (
             <div 
               key={topic.id} 
               onClick={() => handleTopicSelect(topic)}
               onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTopicSelect(topic);
                }
               }}
               tabIndex={0}
               role="button"
               className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-slate-800 hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
             >
                <img 
                    src={topic.cover} 
                    alt={topic.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-50 group-hover:brightness-75" 
                    loading="lazy" 
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent">
                   {/* Serialization Status Badge */}
                   <div className="absolute top-4 right-4 flex items-center space-x-2">
                        {topic.status === 'ONGOING' && (
                             <div className="bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> 最近更新
                             </div>
                        )}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border flex items-center shadow-lg
                                ${topic.status === 'ONGOING' 
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                            {topic.status === 'ONGOING' ? '连载中' : '已完结'}
                        </div>
                   </div>

                   <div className={`w-12 h-1 mb-4 rounded-full transition-all duration-300 group-hover:w-20 ${topic.status === 'ONGOING' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                   <h3 className="text-3xl font-bold text-white serif mb-2">{topic.title}</h3>
                   <p className="text-slate-300 mb-4 line-clamp-2">{topic.description}</p>
                   <div className="flex items-center text-xs text-slate-400 font-mono space-x-4 border-t border-white/10 pt-4">
                      <span className="flex items-center"><BookOpen className="w-3 h-3 mr-1" /> {topic.postCount} 章节</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 更新于 {topic.lastUpdated}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );

  if (selectedPost) return renderPostReader();
  if (selectedTopic) return renderTopicDetail();
  return renderHome();
};
