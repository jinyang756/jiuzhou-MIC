import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

// Safely access process.env or import.meta.env to prevent crashes
const getApiKey = () => {
  try {
    // 1. Vite Standard (Recommended for Vercel)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
        // @ts-ignore
        return import.meta.env.VITE_API_KEY;
    }
    
    // 2. Node/Process Fallback
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }

    // 3. Global Window Fallback (Legacy)
    // @ts-ignore
    if (typeof window !== 'undefined' && window.API_KEY) {
        // @ts-ignore
        return window.API_KEY;
    }
    return '';
  } catch (e) {
    console.warn("Environment variable access failed", e);
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const analyzeResonance = async (eventDescription: string): Promise<string> => {
  if (!apiKey) return "API Key 未配置，无法连接九州核心。";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `分析以下事件，提取其中能唤醒人类共鸣的情感核心。请用充满哲理和同理心的语言描述，解释为什么这件事能触动人心，以及它对"活着的意义"有什么启示。字数控制在150字以内。\n\n事件：${eventDescription}`,
    });
    return response.text || "无法分析该事件。";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "分析过程中发生错误，请稍后再试。";
  }
};

export const interpretQuote = async (quote: string, character: string): Promise<string> => {
    if (!apiKey) return "API Key 未配置。";
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `你是《剑来》小说的资深读者。请解析以下这句话的意境。分析${character}当时的心境，以及这句话背后那种令人战栗或感动的力量。字数100字左右。\n\n角色：${character}\n台词：${quote}`,
      });
      return response.text || "无法解析。";
    } catch (error) {
      console.error("Gemini quote error:", error);
      return "剑气太强，无法解析。";
    }
  };

export const analyzeFinance = async (quote: string, author: string): Promise<string> => {
    if (!apiKey) return "API Key 未配置。";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `你是一位精通人性、博弈论与东方哲学的顶级投资哲学家。请解析以下金融名言。
            
            请从"人性弱点"、"市场周期"和"道家哲学"的角度进行深度解读。告诉读者，为什么这句话在一百年后依然适用？
            
            作者：${author}
            名言：${quote}
            
            要求：语言犀利、冷峻，直指人心。字数150字左右。`,
        });
        return response.text || "无法解析市场迷雾。";
    } catch (error) {
        console.error("Gemini finance error:", error);
        return "市场波动过大，信号丢失。";
    }
};

export const getAIResponseForCommunity = async (
    userPost: string, 
    role: string, 
    playlist: Song[] = []
): Promise<{ text: string; recommendedSongId?: string }> => {
    if (!apiKey) return { text: "API Key 未配置，九州守护者离线中..." };

    try {
        // Construct a simplified list of songs for the context
        const songsContext = playlist.map(s => `ID: ${s.id} | Title: ${s.title} | Mood: ${s.artist}`).join('\n');

        const prompt = `
        用户发帖内容: "${userPost}"
        
        请你扮演"${role}"。你的任务是给予用户温暖、深刻的慰藉。
        
        此外，你是一位"音乐药剂师"。这里有一份"九州曲库":
        ${songsContext}
        
        要求：
        1. 回复要简短、温暖、直击灵魂。
        2. 分析用户的情绪。如果曲库中有一首歌非常适合平复这种情绪或产生共鸣，请在回复的最后一行加上标签 {{SONG_ID:歌曲ID}}。
        3. 如果没有特别合适的歌，就不要加标签。
        4. 不要直接在回复文字里说"我推荐这首歌"，直接贴标签即可，系统会自动生成卡片。
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let text = response.text || "守护者正在沉思...";
        let recommendedSongId = undefined;

        // Parse the song ID tag
        const match = text.match(/\{\{SONG_ID:(.*?)\}\}/);
        if (match) {
            recommendedSongId = match[1].trim();
            // Remove the tag from the visible text
            text = text.replace(match[0], '').trim();
        }

        return { text, recommendedSongId };
    } catch (error) {
        return { text: "连接断开..." };
    }
}