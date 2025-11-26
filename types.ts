
export enum Page {
  BLOG = 'BLOG',
  TOOLBOX = 'TOOLBOX',
  MUSIC = 'MUSIC',
  JIANLAI = 'JIANLAI',
  WORLD = 'WORLD',
  COMMUNITY = 'COMMUNITY',
  FINANCE = 'FINANCE',
  ABOUT = 'ABOUT'
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string; // Added for playback
  duration: string; // Display string e.g. "4:32" or "语音"
  bitrate: string; // e.g. "24bit / 192kHz"
  lyrics?: string; // Optional lyrics field
  isTTS?: boolean; // Is this a text-to-speech asset?
  ttsData?: {
    text: string;
    persona: 'DEEP' | 'NORMAL' | 'GENTLE';
  };
}

export interface BlogTopic {
  id: string;
  title: string;
  description: string;
  cover: string;
  postCount: number;
  lastUpdated: string;
  status: 'ONGOING' | 'COMPLETED'; // Serializing status
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // Full article content
  date: string;
  category: string;
  image: string;
  topicId?: string; // Link to a BlogTopic
  order?: number;   // Chapter order within the topic
}

export interface CommunityPost {
  id: string;
  avatar: string; // URL or Emoji
  roleName: string; // Theme based IP name
  content: string;
  likes: number;
  timestamp: string;
  isAnonymous: boolean;
  recommendedSong?: Song; // AI Recommended Song Prescription
}

export interface WorldEvent {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  analysis?: string; // Pre-written Author interpretation
}

export interface JianLaiQuote {
  id: string;
  quote: string;
  character: string;
  sceneDescription: string;
  image: string;
  analysis?: string; // Pre-written Author interpretation
}

export interface FinanceQuote {
  id: string;
  title: string;
  author: string;
  quote: string;
  context: string;
  image: string;
  analysis?: string; // Pre-written Author interpretation
}
