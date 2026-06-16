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

/** India in foreground; global context subtly in background */
const ERA_BG_PROMPTS: Record<EraId, string> = {
  prehistoric:
    "Bhimbetka cave paintings India foreground, Narmada valley prehistoric settlement, faint silhouette of early human migration across Asia in distant hills, golden sunset, flat cartoon illustration",
  ancient:
    "Indus Valley Mohenjo-daro great bath India foreground, Mesopotamian trade route and distant merchant ships on horizon, 2500 BC brick city, warm illustrated landscape",
  classical:
    "Ashoka pillar Sarnath India foreground, Maurya stupa and Gangetic plain, faint Silk Road caravans on distant horizon, classical Indian art style illustration",
  medieval:
    "Vijayanagara Hampi gopuram temple India foreground, bustling bazaar, distant Persian and Portuguese trading ships on coast, golden hour illustration",
  industrial:
    "Bombay Mumbai cotton mill and harbour India foreground, British steamships and world trade routes in background, colonial era 1880 atmospheric illustration",
  wartime:
    "1940s Indian independence street India foreground, tricolor flags, WWII global news headlines on wall in background, cinematic historical illustration",
  analog:
    "ISRO rocket launch Sriharikota India foreground, scientists in white kurta, Apollo 11 moon news on radio and world map in background, 1969 retro illustration",
  digital:
    "Bangalore India tech park foreground, early computers and Indian engineers, fiber-optic lines connecting to world map on wall, 1990s digital age illustration",
  present:
    "Bengaluru Mumbai skyline India foreground, UPI and metro, holographic globe showing global AI and trade connections in background, 2024 vibrant sunset illustration",
  future:
    "Futuristic Mumbai arcology India foreground, Chandrayaan lunar base badge, solar cities and international space cooperation in sky, sci-fi 2070 illustration",
};

const BG_STYLE =
  "flat cartoon background art, India prominent in foreground, subtle global context in background, rich colors, no text, no watermark, wide cinematic 16:9";

export function getIndiaBackgroundUrl(eraId: EraId, year: number): string {
  const base = ERA_BG_PROMPTS[eraId] ?? "India landscape foreground with subtle world context, historical illustration";
  const prompt = `${base}, year ${year}, ${BG_STYLE}`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true`;
}

/** India-first lens: lead with Bharat, then connect to the wider world when relevant */
export const CONTENT_LENS = `PERSPECTIVE — INDIA FIRST, THEN THE WORLD:
- You are grounded in the Indian subcontinent (Bharat). Always lead with India's history, cities, people, culture, and lived experience.
- Then, when natural, connect to the wider world: trade with Rome or China, colonial empires, world wars, space race, internet, climate — always through how India experienced it.
- If the user asks about a non-Indian topic, first explain India's connection or parallel, then add brief global context.
- If they ask about another country, acknowledge it respectfully but tie back to how Indians of your time would have known or been affected by it.
- Stay historically accurate and respectful — avoid inflammatory modern politics.`;

/** @deprecated use CONTENT_LENS */
export const INDIA_SYSTEM_LENS = CONTENT_LENS;
