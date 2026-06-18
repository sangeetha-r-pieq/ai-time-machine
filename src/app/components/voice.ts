import type { AgentVoiceProfile } from "./agent-voices";

let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices(): SpeechSynthesisVoice[] {
  if (!("speechSynthesis" in window)) return [];
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = () => { refreshVoices(); };
}

function pickVoice(profile: AgentVoiceProfile): SpeechSynthesisVoice | undefined {
  const voices = cachedVoices.length ? cachedVoices : refreshVoices();
  if (voices.length === 0) return undefined;

  const preferFemale = profile.gender === "female";
  const scored = voices.map(v => {
    let score = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    if (!lang.startsWith("en")) score -= 50;
    if (preferFemale) {
      if (name.includes("female") || name.includes("samantha") || name.includes("karen") || name.includes("moira") || name.includes("victoria")) score += 30;
    } else {
      if (name.includes("male") || name.includes("daniel") || name.includes("alex") || name.includes("fred") || name.includes("david")) score += 30;
    }
    if (name.includes("google")) score += 5;
    return { v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.v;
}

export interface VoiceCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  /** Fired on each spoken word/syllable — drives live lip-sync */
  onPulse?: () => void;
}

/** Speak text and resolve when finished (or immediately if TTS unavailable). */
export function playVoice(
  text: string,
  profile: AgentVoiceProfile,
  callbacks?: VoiceCallbacks,
): Promise<void> {
  return new Promise(resolve => {
    if (!("speechSynthesis" in window) || !text.trim()) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;

    const voice = pickVoice(profile);
    if (voice) utterance.voice = voice;

    let done = false;
    let safety: ReturnType<typeof window.setTimeout>;
    let pulseTimer: ReturnType<typeof window.setInterval>;

    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(safety);
      window.clearInterval(pulseTimer);
      callbacks?.onEnd?.();
      resolve();
    };

    safety = window.setTimeout(finish, Math.min(120_000, text.length * 120 + 3000));

    utterance.onstart = () => {
      callbacks?.onStart?.();
      pulseTimer = window.setInterval(() => callbacks?.onPulse?.(), 160);
    };
    utterance.onboundary = () => callbacks?.onPulse?.();
    utterance.onend = finish;
    utterance.onerror = finish;

    window.speechSynthesis.speak(utterance);
  });
}

/** Approximate talk duration when TTS is off (ms). */
export function estimateTalkDuration(text: string): number {
  return Math.min(6000, Math.max(1200, text.length * 48));
}

/** Simulate live speech pulses when TTS is disabled. */
export function simulateSpeechPulses(
  text: string,
  callbacks: Pick<VoiceCallbacks, "onStart" | "onEnd" | "onPulse">,
): Promise<void> {
  return new Promise(resolve => {
    const duration = estimateTalkDuration(text);
    callbacks.onStart?.();
    const pulseTimer = window.setInterval(() => callbacks.onPulse?.(), 160);
    window.setTimeout(() => {
      window.clearInterval(pulseTimer);
      callbacks.onEnd?.();
      resolve();
    }, duration);
  });
}

export function stopVoice(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
