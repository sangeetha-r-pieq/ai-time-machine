import type { EraId } from "./era-config";

/** Cartoon-style avatar emoji per agent (eraId-agentId) */
export const AGENT_AVATARS: Record<string, string> = {
  "prehistoric-elder": "🧔",
  "prehistoric-historian": "👩‍🔬",
  "ancient-scribe": "📜",
  "ancient-historian": "👩‍🏫",
  "classical-local": "🧑‍🌾",
  "classical-historian": "👨‍🏫",
  "medieval-monk": "🙏",
  "medieval-historian": "👩‍🎓",
  "industrial-foreman": "👷",
  "industrial-historian": "👨‍🔬",
  "wartime-soldier": "🎖️",
  "wartime-historian": "👩‍⚕️",
  "analog-local": "👩‍💼",
  "analog-historian": "👨‍🚀",
  "digital-dev": "💻",
  "digital-historian": "👩‍💻",
  "present-citizen": "🧑‍💻",
  "present-analyst": "📊",
  "future-guide": "🤖",
  "future-human": "👩‍🚀",
};

export function getAgentAvatar(eraId: EraId, agentId: string): string {
  return AGENT_AVATARS[`${eraId}-${agentId}`] ?? "🧑";
}

const ERA_BG_PROMPTS: Record<EraId, string> = {
  prehistoric: "Bhimbetka rock shelters ancient India, prehistoric cave paintings, Bhopal region, golden sunset, painterly illustration",
  ancient: "Indus Valley civilization Mohenjo-daro great bath, ancient India 2500 BC, brick city, warm desert light, illustrated landscape",
  classical: "Maurya Empire ancient India, Ashoka pillar Sarnath, Buddhist stupas, lush Gangetic plain, classical Indian art style illustration",
  medieval: "Vijayanagara Empire Hampi stone temples, medieval South India, bazaar and gopuram towers, golden hour illustration",
  industrial: "Colonial era Mumbai Bombay harbour 1880, steam ships, cotton mills, Victorian India waterfront, atmospheric illustration",
  wartime: "1940s India independence movement, crowded Indian street, tricolor flags, historical atmosphere, cinematic illustration",
  analog: "1970s India ISRO rocket launch Sriharikota, scientists in white kurta, monsoon sky, retro space age illustration",
  digital: "1990s Bangalore India tech park, early computers, bustling IT city, neon and monsoon clouds, digital age illustration",
  present: "Modern India Bengaluru Mumbai skyline 2024, UPI digital India, metro trains, vibrant tech city sunset illustration",
  future: "Futuristic India 2070, Mumbai arcology towers, solar panels, flying transit, Chandrayaan moon base, sci-fi illustration",
};

export function getIndiaBackgroundUrl(eraId: EraId, year: number): string {
  const base = ERA_BG_PROMPTS[eraId] ?? "India landscape historical illustration";
  const prompt = `${base}, year ${year}, flat cartoon background art, rich colors, no text, no watermark, wide cinematic 16:9`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true`;
}

export const INDIA_SYSTEM_LENS = `You speak from the perspective of the Indian subcontinent. Prioritize Indian history, geography, culture, languages, and lived experience. Reference Indian cities, movements, science, and arts when relevant. Stay historically respectful — avoid inflammatory modern politics.`;
