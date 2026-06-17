import type { EraId } from "./era-config";
import { getEraImage, pollinationsUrl } from "./image-utils";

/** Cartoon-style avatar emoji per agent (eraId-agentId) */
export const AGENT_AVATARS: Record<string, string> = {
  "prehistoric-elder": "🧔",
  "prehistoric-historian": "👩‍🔬",
  "ancient-scribe": "📜",
  "ancient-historian": "👩‍🏫",
  "classical-local": "🏛️",
  "classical-historian": "👨‍🏫",
  "medieval-monk": "✝️",
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
  prehistoric:
    "prehistoric cave shelter with fire and hunters, mammoth hills in distance, golden sunset, flat cartoon illustration",
  ancient:
    "ancient Egypt pyramids and Nile river foreground, desert horizon, warm illustrated landscape",
  classical:
    "classical Athens agora and Parthenon on hill, Mediterranean sea in distance, golden hour illustration",
  medieval:
    "medieval castle and cathedral on hill, village below, distant trade road, golden hour illustration",
  industrial:
    "industrial Manchester factory smokestacks and railway, Victorian city skyline, atmospheric illustration",
  wartime:
    "WWII European frontline town rubble, searchlights in sky, cinematic historical illustration",
  analog:
    "NASA Apollo launch pad and mission control vibe, 1969 retro space age illustration",
  digital:
    "1990s dot-com office with CRT monitors and server racks, neon digital age illustration",
  present:
    "modern global city skyline at dusk, technology and transit, 2020s vibrant illustration",
  future:
    "futuristic arcology towers and orbital habitats, sci-fi 2070 illustration",
};

const BG_STYLE =
  "flat cartoon background art, rich colors, cinematic wide 16:9, no text, no watermark";

/**
 * Returns a URL for the era background.
 * Uses Pollinations with seed-based caching for the styled cartoon background.
 */
export function getEraBackgroundUrl(eraId: EraId, year: number): string {
  const base = ERA_BG_PROMPTS[eraId] ?? "historical landscape, era-appropriate architecture, illustrated scene";
  const prompt = `${base}, year ${year}, ${BG_STYLE}`;
  return pollinationsUrl(prompt, { width: 960, height: 540 });
}

/**
 * Async — fetches a **real photo** for the era from Wikipedia.
 * Falls back to Pollinations if Wikipedia has no image.
 * Results are cached in localStorage so each era only fetches once ever.
 */
export { getEraImage };

/** @deprecated use getEraBackgroundUrl */
export const getIndiaBackgroundUrl = getEraBackgroundUrl;

export const CONTENT_LENS = `PERSPECTIVE — GLOBAL HISTORY:
- Answer from your character's time, place, and lived experience.
- Be historically accurate. Use concrete local detail and, when relevant, connect to wider world events.
- If the user asks about a specific topic or region, focus there — do not force every answer through one country.
- Stay in character. Never mention being an AI or JSON.`;

/** @deprecated use CONTENT_LENS */
export const INDIA_SYSTEM_LENS = CONTENT_LENS;
