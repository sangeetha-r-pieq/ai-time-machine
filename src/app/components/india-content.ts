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

/** Photorealistic head-and-shoulders portraits — live video-call style per agent */
const AGENT_PORTRAIT_PROMPTS: Record<string, string> = {
  "prehistoric-elder":
    "photorealistic elderly prehistoric forest dweller, weathered face, animal hide cloak, looking at camera, head and shoulders portrait, campfire warm light",
  "prehistoric-historian":
    "photorealistic female paleoanthropologist, field jacket, looking at camera, head and shoulders portrait, natural outdoor light",
  "ancient-scribe":
    "photorealistic ancient Egyptian royal scribe, white linen, looking at camera, head and shoulders portrait, temple blur background",
  "ancient-historian":
    "photorealistic female Egyptologist, sun hat, looking at camera, head and shoulders portrait, archaeological site blur",
  "classical-local":
    "photorealistic ancient Athenian merchant, chiton, looking at camera, head and shoulders portrait, Mediterranean light",
  "classical-historian":
    "photorealistic male ancient Greek scholar, looking at camera, head and shoulders portrait, marble blur background",
  "medieval-monk":
    "photorealistic medieval Benedictine monk, brown robes, tonsure, looking at camera, head and shoulders portrait",
  "medieval-historian":
    "photorealistic female medieval history professor, academic robes, looking at camera, head and shoulders portrait",
  "industrial-foreman":
    "photorealistic Victorian factory foreman, soot-stained waistcoat, flat cap, looking at camera, sepia head and shoulders portrait",
  "industrial-historian":
    "photorealistic male Victorian scholar, frock coat, looking at camera, head and shoulders portrait",
  "wartime-soldier":
    "photorealistic British WWII soldier 1944, helmet, looking at camera, black and white head and shoulders portrait",
  "wartime-historian":
    "photorealistic female 1940s historian, wool coat, looking at camera, head and shoulders portrait",
  "analog-local":
    "photorealistic NASA secretary woman 1969, vintage hairstyle, looking at camera, Kodachrome head and shoulders portrait",
  "analog-historian":
    "photorealistic male MIT scientist 1970s, tweed jacket, looking at camera, head and shoulders portrait",
  "digital-dev":
    "photorealistic 1990s tech worker, flannel shirt, CRT glow on face, looking at camera, head and shoulders portrait",
  "digital-historian":
    "photorealistic female Stanford professor 1990s, blazer, looking at camera, head and shoulders portrait",
  "present-citizen":
    "photorealistic modern software engineer, casual hoodie, looking at camera, head and shoulders portrait, city blur",
  "present-analyst":
    "photorealistic professional woman technology analyst, blazer, looking at camera, head and shoulders portrait",
  "future-guide":
    "photorealistic near-future human, sleek practical clothing, subtle wearable tech, looking at camera, head and shoulders portrait",
  "future-human":
    "photorealistic female near-future historian, practical futuristic clothing, looking at camera, head and shoulders portrait",
};

const PORTRAIT_SEEDS: Record<string, number> = {
  "prehistoric-elder": 52001,
  "prehistoric-historian": 52002,
  "ancient-scribe": 52003,
  "ancient-historian": 52004,
  "classical-local": 52005,
  "classical-historian": 52006,
  "medieval-monk": 52007,
  "medieval-historian": 52008,
  "industrial-foreman": 52009,
  "industrial-historian": 52010,
  "wartime-soldier": 52011,
  "wartime-historian": 52012,
  "analog-local": 52013,
  "analog-historian": 52014,
  "digital-dev": 52015,
  "digital-historian": 52016,
  "present-citizen": 52017,
  "present-analyst": 52018,
  "future-guide": 52019,
  "future-human": 52020,
};

const PORTRAIT_STYLE =
  "ultra photorealistic, shot on 85mm portrait lens, natural skin pores and texture, sharp eyes, head and shoulders, looking at camera, conversational pose, soft neutral background blur, documentary photograph, no text, no watermark";

const LIVE_PORTRAIT_STYLE =
  "ultra photorealistic webcam portrait, natural skin, sharp eyes, head and shoulders, looking directly at camera as if on video call, soft background blur, no text";

const PORTRAIT_NEGATIVE =
  "cartoon, anime, illustration, painting, drawing, sketch, 3d render, disney, pixar, cute, chibi, big eyes, animated movie, cel shaded, multiple people, crowd, blurry, deformed, extra limbs, text, watermark, logo";

/** One representative realistic traveler per era (journey animation + previews) */
const ERA_TRAVELER_PROMPTS: Record<EraId, string> = {
  prehistoric:
    "photorealistic prehistoric forest dweller hunter gatherer, weathered skin, animal hide clothing, barefoot, walking on dirt path, documentary photograph",
  ancient:
    "photorealistic ancient Egyptian farmer in linen kilt, Nile village, walking, documentary photograph",
  classical:
    "photorealistic ancient Greek citizen in chiton, walking marble street, documentary photograph",
  medieval:
    "photorealistic medieval European peasant in wool tunic, walking muddy village road, documentary photograph",
  industrial:
    "photorealistic Victorian factory worker in soot-stained clothes, walking industrial street, sepia documentary photograph",
  wartime:
    "photorealistic WWII civilian in wool coat, walking damaged European street, black and white documentary photograph",
  analog:
    "photorealistic 1960s NASA technician in work clothes, walking launch pad, Kodachrome documentary photograph",
  digital:
    "photorealistic 1990s office worker in casual shirt, walking tech campus, documentary photograph",
  present:
    "photorealistic modern everyday person in casual clothes, walking city sidewalk, contemporary documentary photograph",
  future:
    "photorealistic near-future citizen in practical smart clothing, walking sustainable city plaza, cinematic documentary photograph",
};

const TRAVELER_SEEDS: Record<EraId, number> = {
  prehistoric: 53001,
  ancient: 53002,
  classical: 53003,
  medieval: 53004,
  industrial: 53005,
  wartime: 53006,
  analog: 53007,
  digital: 53008,
  present: 53009,
  future: 53010,
};

export function getEraTravelerPortraitUrl(eraId: EraId, year: number): string {
  const base = ERA_TRAVELER_PROMPTS[eraId];
  const prompt = `${base}, historical year ${year}, ${PORTRAIT_STYLE}`;
  const seed = TRAVELER_SEEDS[eraId];
  const params = new URLSearchParams({
    width: "512",
    height: "768",
    nologo: "true",
    seed: String(seed),
    model: "flux",
    negative: PORTRAIT_NEGATIVE,
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export function getAgentPortraitUrl(eraId: EraId, agentId: string, year: number): string {
  const key = `${eraId}-${agentId}`;
  const base =
    AGENT_PORTRAIT_PROMPTS[key] ??
    `photorealistic historically accurate person from ${eraId} era, era-appropriate clothing and appearance`;
  const prompt = `${base}, historical year ${year}, ${LIVE_PORTRAIT_STYLE}`;
  const seed = PORTRAIT_SEEDS[key] ?? ERA_SEEDS[eraId] + 1000;
  const params = new URLSearchParams({
    width: "480",
    height: "640",
    nologo: "true",
    seed: String(seed),
    model: "flux",
    negative: PORTRAIT_NEGATIVE,
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

/** Photorealistic scene prompts — one stable look per era */
const ERA_BG_PROMPTS: Record<EraId, string> = {
  prehistoric:
    "photorealistic prehistoric river valley at golden hour, campfire smoke, distant mammoth herd on grassy hills, misty atmosphere, documentary wildlife photography",
  ancient:
    "photorealistic ancient Egypt pyramids and Nile river at sunrise, desert heat haze, archaeological documentary photograph, wide cinematic landscape",
  classical:
    "photorealistic ancient Athens Parthenon on acropolis hill, Mediterranean blue sky, marble temples, historical documentary photograph, natural daylight",
  medieval:
    "photorealistic medieval European castle and cathedral on hilltop, village in valley, morning fog, historical documentary aerial photograph",
  industrial:
    "photorealistic Victorian industrial Manchester cityscape, factory smokestacks, railway bridge, overcast sky, sepia-toned historical documentary photo",
  wartime:
    "photorealistic WWII European ruined town street, damaged buildings, overcast sky, black and white historical war documentary photograph",
  analog:
    "photorealistic NASA Apollo era launch pad at Cape Kennedy 1969, rocket on pad, technicians in distance, Kodachrome documentary photograph",
  digital:
    "photorealistic 1990s computer server room and office, CRT monitors, beige computers, fluorescent lighting, documentary tech photography",
  present:
    "photorealistic modern global city skyline at blue hour, glass towers, traffic light trails, contemporary urban documentary photograph",
  future:
    "photorealistic futuristic sustainable megacity at dusk, green arcology towers, clean transit, cinematic sci-fi documentary photograph, realistic lighting",
};

/** Fixed seed per era — stable image, no flicker when year changes within era */
const ERA_SEEDS: Record<EraId, number> = {
  prehistoric: 41001,
  ancient: 41002,
  classical: 41003,
  medieval: 41004,
  industrial: 41005,
  wartime: 41006,
  analog: 41007,
  digital: 41008,
  present: 41009,
  future: 41010,
};

const BG_STYLE =
  "ultra photorealistic, shot on 35mm film, natural lighting, sharp focus, high detail, cinematic wide 16:9, no text, no watermark";

const BG_NEGATIVE =
  "cartoon, anime, illustration, painting, drawing, sketch, cel shaded, 3d render, blurry, low quality, deformed, text, watermark, logo";

/**
 * Returns a URL for the era background.
 * Uses Pollinations with seed-based caching for the styled cartoon background.
 */
export function getEraBackgroundUrl(eraId: EraId, year: number): string {
  const base = ERA_BG_PROMPTS[eraId] ?? "photorealistic historical landscape, era-appropriate architecture, documentary photograph";
  const prompt = `${base}, historical year ${year}, ${BG_STYLE}`;
  const seed = ERA_SEEDS[eraId] ?? 42;
  const params = new URLSearchParams({
    width: "1280",
    height: "720",
    nologo: "true",
    seed: String(seed),
    model: "flux",
    negative: BG_NEGATIVE,
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
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
