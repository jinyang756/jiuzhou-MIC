
import React, { useState, useEffect, useRef } from 'react';
import { CommunityPost, Song } from '../types';
import { Users, Send, MessageCircle, Bot, Shield, Heart, Music, Play, Disc, Flame, Sparkles, Telescope, LayoutGrid, X } from 'lucide-react';
import { getAIResponseForCommunity } from '../services/geminiService';

interface CommunityPageProps {
    playlist?: Song[];
    onPlaySong?: (id: string) => void;
    addToPlaylist?: (song: Song) => void;
}

const roles = [
  { id: 'void', name: '虚空行者', avatar: '🌌' },
  { id: 'star', name: '追星人', avatar: '🌠' },
  { id: 'tree', name: '沉默的树', avatar: '🌳' },
  { id: 'cat', name: '屋顶的猫', avatar: '🐈' }
];

const initialPosts: CommunityPost[] = [
  {
    id: '1',
    avatar: '🌳',
    roleName: '沉默的树',
    content: '有时候觉得，城市太吵了，我想找一片没有信号的森林，把自己种在土里。',
    likes: 12,
    timestamp: '2小时前',
    isAnonymous: true
  },
  {
    id: '2',
    avatar: '🌌',
    roleName: '虚空行者',
    content: '如果是世界末日，你最后想听的一首歌是什么？',
    likes: 34,
    timestamp: '5小时前',
    isAnonymous: true
  }
];

const STORAGE_KEY = 'jiuzhou_community_posts_v2';

// Helper to generate deterministic random positions and DEPTH based on ID
const generateStarAttributes = (id: string) => {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Normalize to percentages/values
    const top = Math.abs(hash % 80) + 10; // 10% - 90%
    const left = Math.abs((hash >> 2) % 90) + 5; // 5% - 95%
    const delay = Math.abs((hash >> 3) % 5);
    const size = (Math.abs((hash >> 4) % 3) + 1) * 0.25 + 0.5; // 0.75rem to 1.5rem
    const opacity = (Math.abs((hash >> 5) % 5) + 5) / 10; // 0.5 - 1.0
    
    // Calculate depth factor: Larger stars are "closer", so they move MORE.
    // Map size (0.5 - 1.25) to depth (1 - 3)
    const depth = size * 2.5; 

    return { 
        style: {
            top: `${top}%`, 
            left: `${left}%`, 
            animationDelay: `${delay}s`, 
            transform: `scale(${size})`,
            opacity: opacity
        },
        depth
    };
};

export const CommunityPage: React.FC<CommunityPageProps> = ({ playlist = [], onPlaySong, addToPlaylist }) => {
  // --- STATE ---
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialPosts;
    } catch (e) {
      console.warn("Failed to load posts from storage", e);
      return initialPosts;
    }
  });

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [isAiReplying, setIsAiReplying] = useState<string | null>(null);
  
  // New States for Galaxy & Incinerator
  const [viewMode, setViewMode] = useState<'GALAXY' | 'LIST'>('GALAXY');
  const [isIncineratorMode, setIsIncineratorMode] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [selectedStar, setSelectedStar] = useState<CommunityPost | null>(null);
  
  // Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const galaxyRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.warn("Failed to save posts to storage", e);
    }
  }, [posts]);

  // Parallax Handler
  const handleMouseMove = (e: React.MouseEvent) => {
      if (viewMode !== 'GALAXY' || !galaxyRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePos({
          x: (clientX / innerWidth - 0.5) * 20, // -10 to 10
          y: (clientY / innerHeight - 0.5) * 20
      });
  };

  // --- HANDLERS ---
  const handlePost = () => {
    if (!newPostContent.trim()) return;

    if (isIncineratorMode) {
        // Incinerator Logic
        setIsBurning(true);
        setTimeout(() => {
            setNewPostContent('');
            setIsBurning(false);
            // Do NOT save to posts
        }, 1500);
        return;
    }

    const post: CommunityPost = {
      id: Date.now().toString(),
      avatar: selectedRole.avatar,
      roleName: selectedRole.name,
      content: newPostContent,
      likes: 0,
      timestamp: '刚刚',
      isAnonymous: true
    };

    setPosts([post, ...posts]);
    setNewPostContent('');
  };

  const handleAiReply = async (postId: string, content: string) => {
    setIsAiReplying(postId);
    const { text, recommendedSongId } = await getAIResponseForCommunity(content, '九州守护者 (AI)', playlist);
    const recommendedSong = recommendedSongId ? playlist.find(s => s.id === recommendedSongId) : undefined;

    const aiPost: CommunityPost = {
      id: Date.now().toString() + '_ai',
      avatar: '🛡️',
      roleName: '九州守护者 (AI)',
      content: text,
      likes: 999,
      timestamp: '刚刚',
      isAnonymous: false,
      recommendedSong: recommendedSong
    };

    setPosts(current => [aiPost, ...current]);
    setIsAiReplying(null);
  };

  // --- RENDERERS ---

  const renderPrescriptionCard = (song: Song) => (
    <div className="mt-4 bg-slate-900/80 rounded-xl p-4 border border-rose-500/30 flex items-center gap-4 group cursor-pointer hover:bg-slate-800 transition-all shadow-lg"
            onClick={(e) => { 
                e.stopPropagation(); 
                if (addToPlaylist) {
                    addToPlaylist(song);
                } else if (onPlaySong) {
                    onPlaySong(song.id);
                }
            }}>
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img src={song.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-current opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
            <div className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded flex items-center">
                <Music className="w-3 h-3 mr-1" /> 音乐处方
            </div>
            </div>
            <h4 className="text-white font-bold truncate">{song.title}</h4>
            <p className="text-slate-400 text-xs truncate">{song.artist}</p>
        </div>
        <div className="hidden md:block">
            <Disc className="w-8 h-8 text-slate-700 group-hover:text-rose-500/50 group-hover:animate-spin transition-colors" />
        </div>
    </div>
  );

  const renderGalaxy = () => (
      <div 
        ref={galaxyRef}
        className="relative flex-1 w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl min-h-[500px]"
        onMouseMove={handleMouseMove}
      >
          {/* Background Layers with Parallax - Distant layers move slowly */}
          <div 
             className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black transition-transform duration-75 ease-out"
             style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
          ></div>
          <div 
             className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-[pulse_8s_ease-in-out_infinite] transition-transform duration-75 ease-out"
             style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px) scale(1.1)` }}
          ></div>
          
          {/* Stars */}
          {posts.map((post) => {
              const { style, depth } = generateStarAttributes(post.id);
              return (
                  <div
                    key={post.id}
                    className="absolute cursor-pointer group z-10 transition-transform duration-75 ease-out"
                    style={{
                        ...style,
                        // True Parallax: Multiply movement by depth.
                        // mousePos goes from -10 to 10. Depth ~1 to 3.
                        // This creates movement between -10px and -30px.
                        transform: `${style.transform} translate(${-mousePos.x * depth}px, ${-mousePos.y * depth}px)`
                    }}
                    onClick={() => setSelectedStar(post)}
                  >
                      {/* Star Glow */}
                      <div className={`
                          rounded-full bg-white shadow-[0_0_10px_white] animate-pulse
                          ${post.roleName.includes('AI') ? 'w-3 h-3 bg-rose-400 shadow-[0_0_15px_#fb7185]' : 'w-2 h-2'}
                          group-hover:scale-150 transition-transform duration-300
                      `}></div>
                      
                      {/* Hover Tooltip - Now shows content snippet */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 scale-0 group-hover:scale-100 duration-200 origin-bottom">
                          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-2xl min-w-[160px] text-center transform translate-y-2">
                              <span className="font-bold text-rose-300 block text-xs mb-1">{post.roleName}</span>
                              <span className="text-[10px] text-slate-300 block line-clamp-2 leading-relaxed text-left opacity-90">
                                {post.content}
                              </span>
                              {post.recommendedSong && (
                                <div className="mt-1 pt-1 border-t border-white/5 flex items-center justify-center text-[9px] text-rose-400/80">
                                   <Music className="w-2 h-2 mr-1" /> 附赠处方
                                </div>
                              )}
                          </div>
                      </div>
                  </div>
              );
          })}

          <div className="absolute bottom-6 left-6 text-slate-500 text-xs font-mono backdrop-blur-sm px-2 py-1 rounded-lg border border-white/5">
              <Sparkles className="w-3 h-3 inline mr-2 text-rose-500" /> 
              当前观测到 <span className="text-white font-bold">{posts.length}</span> 颗心灵信号
          </div>
      </div>
  );

  const renderList = () => (
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="glass-panel p-6 rounded-2xl relative animate-fade-in hover:bg-slate-800/50 transition-colors">
            {post.roleName.includes('AI') && (
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Bot className="w-24 h-24" />
              </div>
            )}
            
            <div className="flex items-start space-x-4 relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${post.roleName.includes('AI') ? 'bg-rose-500/20 ring-1 ring-rose-500/50' : 'bg-slate-700'}`}>
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1 flex-wrap">
                  <span className={`font-bold ${post.roleName.includes('AI') ? 'text-rose-400' : 'text-slate-300'}`}>
                    {post.roleName}
                  </span>
                  <span className="text-xs text-slate-500">• {post.timestamp}</span>
                  {post.isAnonymous && <Shield className="w-3 h-3 text-slate-600" />}
                </div>
                <p className="text-slate-200 leading-relaxed text-lg serif break-words whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.recommendedSong && renderPrescriptionCard(post.recommendedSong)}
                
                <div className="mt-4 flex items-center space-x-6">
                  <button className="flex items-center text-slate-500 hover:text-rose-400 transition-colors text-sm group">
                    <Heart className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" /> {post.likes}
                  </button>
                  <button className="flex items-center text-slate-500 hover:text-blue-400 transition-colors text-sm">
                    <MessageCircle className="w-4 h-4 mr-1" /> 回复
                  </button>
                  
                  {!post.roleName.includes('AI') && (
                    <button 
                      onClick={() => handleAiReply(post.id, post.content)}
                      disabled={isAiReplying === post.id}
                      className="ml-auto text-xs flex items-center text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20"
                    >
                      {isAiReplying === post.id ? '连接中...' : <><Bot className="w-3 h-3 mr-1" /> 召唤守护者</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );

  return (
    <div className="space-y-8 pb-24 h-full flex flex-col">
      <header className="flex-shrink-0 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold text-rose-400 serif tracking-wide flex items-center">
            <Users className="w-8 h-8 mr-3" />
            匿名树洞
            </h2>
            <p className="text-slate-400 mt-2">在这里，卸下面具，只谈灵魂。</p>
        </div>
        <div className="bg-slate-900/50 p-1 rounded-xl flex items-center border border-slate-800">
            <button 
                onClick={() => setViewMode('GALAXY')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'GALAXY' ? 'bg-rose-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                title="星海模式"
            >
                <Telescope className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setViewMode('LIST')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-rose-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                title="列表模式"
            >
                <LayoutGrid className="w-5 h-5" />
            </button>
        </div>
      </header>

      {/* Input Area */}
      <div className={`glass-panel p-6 rounded-2xl space-y-4 shadow-xl border-t transition-colors duration-500 ${isIncineratorMode ? 'border-orange-500/50 bg-orange-900/10' : 'border-rose-500/20'}`}>
        <div className="relative">
            <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={isIncineratorMode ? "在这里写下你想遗忘的一切...点击焚烧，灰飞烟灭。" : "分享你此刻的心境..."}
            className={`w-full h-24 rounded-xl p-4 text-base md:text-sm text-slate-200 resize-none focus:outline-none focus:ring-1 transition-all placeholder-slate-600
                ${isIncineratorMode ? 'bg-orange-950/30 focus:ring-orange-500/50' : 'bg-slate-800/50 focus:ring-rose-500/50'}
                ${isBurning ? 'opacity-0 scale-95 blur-sm transition-all duration-1000' : 'opacity-100'}
            `}
            />
            {isBurning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Flame className="w-16 h-16 text-orange-500 animate-bounce" />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent animate-pulse rounded-xl"></div>
                </div>
            )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
             <button 
                onClick={() => setIsIncineratorMode(!isIncineratorMode)}
                className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full border transition-all
                    ${isIncineratorMode ? 'bg-orange-500 text-white border-orange-400' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}
                `}
             >
                 <Flame className={`w-3 h-3 mr-1 ${isIncineratorMode ? 'fill-current' : ''}`} />
                 情绪焚烧炉 {isIncineratorMode ? 'ON' : 'OFF'}
             </button>

             {!isIncineratorMode && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar touch-pan-x flex-1">
                    {roles.map(role => (
                    <button
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap flex-shrink-0 ${selectedRole.id === role.id ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        <span className="mr-1">{role.avatar}</span> {role.name}
                    </button>
                    ))}
                </div>
             )}
          </div>

          <button
            onClick={handlePost}
            disabled={isBurning}
            className={`
                w-full md:w-auto px-6 py-2 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                ${isIncineratorMode 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500' 
                    : 'bg-slate-100 text-slate-900 hover:bg-white'}
            `}
          >
            {isIncineratorMode ? (
                <><Flame className="w-4 h-4 mr-2" /> 焚烧心事</>
            ) : (
                <><Send className="w-4 h-4 mr-2" /> 投递星空</>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'GALAXY' ? renderGalaxy() : renderList()}

      {/* Galaxy Modal */}
      {selectedStar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedStar(null)}>
            <div className="w-full max-w-lg glass-panel rounded-2xl p-6 relative shadow-2xl border-t border-rose-500/20" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedStar(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${selectedStar.roleName.includes('AI') ? 'bg-rose-500/20 ring-1 ring-rose-500/50' : 'bg-slate-700'}`}>
                        {selectedStar.avatar}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white serif">{selectedStar.roleName}</h3>
                        <p className="text-slate-500 text-xs">{selectedStar.timestamp} • 来自银河某处</p>
                    </div>
                </div>

                <div className="prose prose-invert max-w-none">
                    <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap font-serif">
                        {selectedStar.content}
                    </p>
                </div>

                {selectedStar.recommendedSong && (
                    <div className="mt-6 border-t border-slate-700 pt-4">
                         {renderPrescriptionCard(selectedStar.recommendedSong)}
                    </div>
                )}

                <div className="mt-8 flex justify-end space-x-4">
                     <button className="flex items-center text-slate-500 hover:text-rose-400 transition-colors">
                        <Heart className="w-5 h-5 mr-1" /> {selectedStar.likes}
                     </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
