
export type VoicePersona = 'DEEP' | 'NORMAL' | 'GENTLE';

interface VoiceConfig {
  pitch: number;
  rate: number;
  lang: string;
}

const PERSONA_CONFIGS: Record<VoicePersona, VoiceConfig> = {
  DEEP: { pitch: 0.8, rate: 0.9, lang: 'zh-CN' },   // 深沉旁白
  NORMAL: { pitch: 1.0, rate: 1.0, lang: 'zh-CN' }, // 标准讲述
  GENTLE: { pitch: 1.2, rate: 0.9, lang: 'zh-CN' },  // 温和/女性向
};

class TTSService {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voicesLoaded: boolean = false;
  private watchdogTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    // Handle async voice loading (Chrome/Android)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
            this.voicesLoaded = true;
        };
    }
  }

  public speak(text: string, persona: VoicePersona = 'NORMAL', onEnd?: () => void) {
    // Cancel previous speech and timers
    this.stop();

    const config = PERSONA_CONFIGS[persona];
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;
    utterance.lang = config.lang;

    // Try to find a good Chinese voice
    const voices = this.synth.getVoices();
    // Prioritize Google Chinese or System Chinese, specific to Persona if possible
    let zhVoice = voices.find(v => v.lang === 'zh-CN' && v.name.includes('Google'));
    if (!zhVoice) {
        zhVoice = voices.find(v => v.lang === 'zh-CN');
    }
    
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    const cleanup = () => {
        if (this.watchdogTimer) clearTimeout(this.watchdogTimer);
        this.currentUtterance = null;
    };

    utterance.onend = () => {
      cleanup();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error("TTS Error", e);
      cleanup();
      if (onEnd) onEnd();
    };

    // SAFETY WATCHDOG: Estimate duration + 5 seconds buffer
    // Average 3 chars per second roughly, minimal 5 seconds
    const estimatedDuration = Math.max((text.length / 3) * 1000, 5000) + 5000;
    this.watchdogTimer = setTimeout(() => {
        console.warn("TTS Watchdog triggered: Forcing stop");
        this.stop();
        if (onEnd) onEnd();
    }, estimatedDuration);

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.watchdogTimer) {
        clearTimeout(this.watchdogTimer);
        this.watchdogTimer = null;
    }
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.synth.speaking;
  }
}

export const tts = new TTSService();