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

export function playVoice(text: string, profile: AgentVoiceProfile): void {
  if (!("speechSynthesis" in window) || !text.trim()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = profile.pitch;
  utterance.rate = profile.rate;

  const voice = pickVoice(profile);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

export function stopVoice(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
