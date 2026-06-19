/**
 * Smart image resolution:
 *  - Historical eras → real photos from Wikipedia (cached in localStorage)
 *  - Future / speculative → Pollinations AI with seed-based caching
 *  - Chat reply images → Pollinations AI with seed-based caching (one at a time)
 */

import type { EraId } from "./era-config";

// ── Wikipedia topic map (tried in order until one returns a photo) ───────────
const ERA_WIKI_TOPICS: Record<EraId, string[]> = {
  prehistoric: ["Lascaux", "Cave_painting", "Prehistoric_art"],
  ancient:     ["Great_Pyramid_of_Giza", "Ancient_Egypt", "Indus_Valley_Civilisation"],
  classical:   ["Parthenon", "Maurya_Empire", "Roman_Forum"],
  medieval:    ["Qutb_Minar", "Carcassonne", "Medieval_architecture"],
  industrial:  ["Indian_Railways", "Industrial_Revolution", "Steam_locomotive"],
  wartime:     ["Indian_independence_movement", "World_War_II", "Mahatma_Gandhi"],
  analog:      ["Apollo_11", "Indian_Space_Research_Organisation", "Moon_landing"],
  digital:     ["History_of_the_World_Wide_Web", "Silicon_Valley", "Personal_computer"],
  present:     ["Artificial_intelligence", "Smartphone", "International_Space_Station"],
  future:      [],                                    // always AI-generated
};

// ── In-memory + localStorage cache ──────────────────────────────────────────
const memCache: Record<string, string> = {};

function cacheGet(key: string): string | null {
  if (memCache[key]) return memCache[key];
  try {
    const v = localStorage.getItem(key);
    if (v) { memCache[key] = v; return v; }
  } catch { /* ignore */ }
  return null;
}

function cacheSet(key: string, url: string) {
  memCache[key] = url;
  try { localStorage.setItem(key, url); } catch { /* ignore */ }
}

// ── Wikipedia REST API (no key needed, no rate issues for 1 req/era) ────────
async function fetchWikipediaImage(topic: string): Promise<string | null> {
  try {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
    );
    if (!r.ok) return null;
    const d = await r.json();
    const src: string | undefined = d.originalimage?.source ?? d.thumbnail?.source;
    if (!src) return null;
    // Wikimedia thumbnail URLs contain "/Xpx-" — upscale to 960px
    return src.replace(/\/\d+px-/, "/960px-");
  } catch {
    return null;
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Get a **real photo** for a historical era (Wikipedia), or an AI image
 * for the future era. Cached so each era fetches only once ever.
 */
export async function getEraImage(eraId: EraId, year: number): Promise<string> {
  const key = `era-img-${eraId}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const topics = ERA_WIKI_TOPICS[eraId];

  // Future era → AI-generated
  if (!topics || topics.length === 0) {
    const url = pollinationsUrl(
      `futuristic city skyline with flying vehicles, year ${year}, cinematic sci-fi`,
      { width: 960, height: 540 }
    );
    cacheSet(key, url);
    return url;
  }

  // Try each Wikipedia topic
  for (const topic of topics) {
    const url = await fetchWikipediaImage(topic);
    if (url) { cacheSet(key, url); return url; }
  }

  // Fallback to Pollinations
  const fb = pollinationsUrl(
    `historical photograph of ${eraId} era, year ${year}, real photo`,
    { width: 960, height: 540 }
  );
  cacheSet(key, fb);
  return fb;
}

// ── Pollinations (seed-cached, for chat images & future content) ────────────

function hashSeed(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function pollinationsUrl(
  prompt: string,
  opts?: { width?: number; height?: number }
): string {
  const w = opts?.width ?? 480;
  const h = opts?.height ?? 360;
  const seed = hashSeed(prompt);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?width=${w}&height=${h}&seed=${seed}&nologo=true`;
}
