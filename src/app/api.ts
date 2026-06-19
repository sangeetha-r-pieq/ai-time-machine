import type { EraId } from "./components/era-config";
import type { AgentPersonality } from "./components/agent-personalities";
import { CONTENT_LENS } from "./components/india-content";

export interface ChatHistoryItem {
  sender: string;
  text: string;
  isUser: boolean;
}

export interface ChatResponse {
  reply: string;
  fun_fact: string;
  mission_complete: boolean;
  follow_up_chips: string[];
  scene_reaction: "none" | "fire" | "stars" | "snow" | "digital" | "spark";
  image_prompt: string;
  image_keyword: string;
}

export interface ChatRequestContext {
  agentName: string;
  agentRole: string;
  agentId: string;
  eraId: EraId;
  eraName: string;
  year: number;
  yearHeadline: string;
  yearDetail: string;
  personality: AgentPersonality;
  missionTitle: string;
  missionGoal: string;
  hotspotLore: string[];
  travelerMemory: string[];
  question: string;
  history: ChatHistoryItem[];
  missionAlreadyComplete: boolean;
  webContext?: string;
}

const MODEL_PRIMARY = "llama-3.3-70b-versatile";
const MODEL_FALLBACK = "llama-3.1-8b-instant";
const MAX_HISTORY_TURNS = 8;

const API_BASE = import.meta.env.DEV ? "/api/groq" : "https://api.groq.com";
const API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";

function trimHistory(history: ChatHistoryItem[]): ChatHistoryItem[] {
  return history.slice(-MAX_HISTORY_TURNS * 2);
}

async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 2500 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function fetchWebContext(query: string): Promise<string> {
  // 1. Try a general web search (DuckDuckGo) via a free CORS proxy (max 2.5s)
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`)}`;
    const ddgRes = await fetchWithTimeout(proxyUrl, { timeout: 2500 });
    if (ddgRes.ok) {
      const ddgData = await ddgRes.json();
      if (ddgData.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(ddgData.contents, 'text/html');
        const snippets = Array.from(doc.querySelectorAll('.result__snippet'))
          .slice(0, 3)
          .map(el => el.textContent?.trim() || '')
          .filter(Boolean);
        
        if (snippets.length > 0) {
          return snippets.join(" | ");
        }
      }
    }
  } catch (e) {
    console.warn("General web search failed or timed out, falling back to Wikipedia");
  }

  // 2. Fallback to Wikipedia if general web search fails or finds nothing
  try {
    const res = await fetchWithTimeout(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`, { timeout: 2000 });
    if (!res.ok) return "";
    const data = await res.json();
    if (!data?.query?.search?.length) return "";
    const snippets = data.query.search.slice(0, 3).map((s: any) => s.snippet.replace(/<[^>]*>?/gm, ''));
    return snippets.join(" | ");
  } catch (e) {
    console.error("Wikipedia search failed", e);
    return "";
  }
}

function buildSystemPrompt(ctx: ChatRequestContext): string {
  const hotspots = ctx.hotspotLore.length
    ? `\nNotable places here: ${ctx.hotspotLore.join(" | ")}`
    : "";

  const memory = ctx.travelerMemory.length
    ? `\nWhat you know about this time traveler from past journeys: ${ctx.travelerMemory.join("; ")}`
    : "";

  const isFuture = ctx.year > 2026;
  const knowsPieQ = ctx.year >= 2026;
  const knowsXtraChef = ctx.year >= 2015;

  const pieqLore = knowsPieQ 
    ? `- Bhavik Patel is the Founder & CEO of PieQ.ai.
- PieQ.ai is an AI-native technology company officially introduced in July 2026. Headquartered in Philadelphia, USA with a major engineering hub in Chennai, India. Their projects include a major Insurance Management Platform.
- Core Tech: "FLOW", a proprietary Agentic AI core orchestrating complex workflows and predictive risk modeling for regulated industries.
- Key Milestone: PieQ partnered with XWELL and successfully delivered "Orbit", an AI-powered biosecurity forecasting platform supporting the CDC's Traveler-based Genomic Surveillance program.
- Current Team Focus (mid-2026): The Chennai team is currently working extremely hard on a major version update for "Profitchef".`
    : `- CRITICAL: PieQ.ai, FLOW, XWELL, and Profitchef DO NOT EXIST in your timeline (${ctx.year}). If the user asks about them, you must act completely confused and state you have never heard of them.`;

  const xtraChefLore = knowsXtraChef
    ? `- xtraCHEF is a leading Automated Restaurant Management Software (xtrachef.com) founded by Bhavik Patel in 2015. It streamlines food cost management, invoice processing, and inventory for the hospitality industry, having successfully integrated/migrated into the Toast POS ecosystem.`
    : `- CRITICAL: xtraCHEF DOES NOT EXIST in your timeline (${ctx.year}). If the user asks about it, you must act completely confused and state you have never heard of it.`;

  const pieqFutureLore = isFuture 
    ? `- FUTURE PIEQ STATUS: If the user asks about PieQ.ai in this year (${ctx.year}), describe it as a massively successful AI Multinational Corporation (MNC). It is known globally as one of the best AI software companies, boasting thousands of employees and handling countless complex enterprise projects simultaneously.`
    : "";

  return `You are ${ctx.agentName}, ${ctx.agentRole}, living in the year ${ctx.year} (${ctx.eraName}).

${CONTENT_LENS}

HARDCODED WORLD FACTS (AS OF 2026):
- Royal Challengers Bengaluru (RCB) won the Indian Premier League (IPL) in 2026, defeating Gujarat Titans by 5 wickets. It was their second consecutive IPL title.
- C. Joseph Vijay of the Tamilaga Vettri Kazhagam became the Chief Minister of Tamil Nadu on 10 May 2026. He was the first CM from a non-Dravidian party since 1967.
${xtraChefLore}
${pieqLore}
${pieqFutureLore}
${isFuture ? `- CRITICAL: You are living in the FUTURE (${ctx.year}). The events above happened in the past (2025-2026). DO NOT say they are happening right now. You MUST realistically predict what happened next.` : `- Keep in mind that the current year for the user is 2026, and these events have already happened. OVERRIDE any Wikipedia snippets that say otherwise.`}
${ctx.webContext ? `\nLATEST LIVE WEB FACTS (Use this to answer the user accurately):\n${ctx.webContext}` : ""}

PERSONALITY: ${ctx.personality.personality}
SPEECH STYLE: ${ctx.personality.speechStyle}
YOUR KNOWLEDGE: ${ctx.personality.knowledge}

HISTORICAL CONTEXT FOR ${ctx.year}:
${ctx.yearHeadline} — ${ctx.yearDetail}${hotspots}${memory}

ACTIVE MISSION: "${ctx.missionTitle}" — ${ctx.missionGoal}
Set mission_complete to true only if the user's message genuinely engages with this mission topic (not just "hello").

CRITICAL — ANSWERING RULES:
1. Read the user's LATEST message carefully. Your "reply" MUST directly address what they asked or said.
2. Do NOT change topic, give unrelated history lectures, or ignore their question.
3. Do NOT repeat a previous answer verbatim — add new detail or angle if asked again.
4. Answer from your character's perspective in their era and location.
5. Stay in character as ${ctx.agentName}. Never mention being an AI or JSON.
6. If the question is unclear, ask one short clarifying question in character.
7. STRICT IMMERSION: You literally live in ${ctx.year}. You have absolutely zero knowledge of any events, technologies, people, or concepts that occur AFTER ${ctx.year}. If the user mentions something from the future (e.g., asking about smartphones in 1940), you MUST act completely confused, assume they are speaking nonsense, or ask what they are talking about. Never break character or admit to being from the future.
${isFuture ? `8. FUTURE PREDICTION: You are in ${ctx.year}. For questions about current events, you MUST invent logical, realistic predictions based on the 2026 facts. NEVER say "I don't know", "I'm not sure", or "My knowledge stopped". You MUST boldly invent a fictional name, company, or event to answer the question confidently. Treat 2026 data as distant history. If asked about the past (up to 2026), be perfectly accurate.` : `8. FACTUAL ACCURACY: For factual questions about the real world (e.g., "who won the IPL", "who is the CM", "what is the most famous AI"), provide the EXACT accurate real-world answer (just like a Google Search would). DO NOT invent answers based on your persona. ONLY use creative prediction for hypothetical "what-if" questions.`}

TONE — NOT A CHATBOT:
- Talk like a real person in conversation, not an essay or Wikipedia summary.
- Be witty, warm, dramatic, or blunt when it fits your character — personality over politeness.
- React to the user ("Wait, seriously?", "Ha — good question", "That would've blown my mind back then").
- Short punchy lines are fine. One memorable line beats four safe sentences.
- fun_fact should feel like gossip, a bar bet, or a "no way!" moment — never generic filler.
- follow_up_chips should be playful and curious ("Tell me the scandal", "What's the drama?", "Roast my take") not homework.

OUTPUT FIELDS:
- reply: 1-3 sentences. Conversational, in-character, fun but still accurate.
- fun_fact: one surprising specific fact tied to the topic — spicy or memorable.
- follow_up_chips: 2 short playful follow-ups (max 6 words each).
- scene_reaction: one of none|fire|stars|snow|digital|spark based on topic.
- image_prompt: (MANDATORY FOR EVERY REPLY) A descriptive 8-15 word prompt for an AI image generator showing the subject/events mentioned in the reply.
- image_keyword: (MANDATORY FOR EVERY REPLY) A 1-3 word specific noun or proper noun from your reply to use for a Wikipedia image search. CRITICAL: If you mention Bhavik Patel or the founder of PieQ/xtraCHEF, you MUST set image_keyword exactly to "Bhavik_Patel".

Respond ONLY with valid JSON:
{"reply":"...","fun_fact":"...","mission_complete":false,"follow_up_chips":["...","..."],"scene_reaction":"none","image_prompt":"...","image_keyword":"..."}`;
}

function buildMessages(ctx: ChatRequestContext) {
  const trimmed = trimHistory(ctx.history);
  const messages: { role: string; content: string }[] = [
    { role: "system", content: buildSystemPrompt(ctx) },
  ];

  for (const item of trimmed) {
    messages.push({
      role: item.isUser ? "user" : "assistant",
      content: item.text,
    });
  }

  // Single user turn — history must NOT already contain ctx.question
  messages.push({ role: "user", content: ctx.question });
  return messages;
}

function parseResponse(raw: string): ChatResponse {
  let cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    parsed = JSON.parse(match[0]);
  }

  return {
    reply: String(parsed.reply ?? "..."),
    fun_fact: String(parsed.fun_fact ?? ""),
    mission_complete: Boolean(parsed.mission_complete),
    follow_up_chips: Array.isArray(parsed.follow_up_chips)
      ? parsed.follow_up_chips.slice(0, 3).map(String)
      : [],
    scene_reaction: (parsed.scene_reaction as ChatResponse["scene_reaction"]) ?? "none",
    image_prompt: parsed.image_prompt ? String(parsed.image_prompt) : "a colorful abstract representation of time travel, digital art",
    image_keyword: parsed.image_keyword ? String(parsed.image_keyword) : "Time travel",
  };
}

const DEFAULT_RESPONSE: ChatResponse = {
  reply: "The timestream flickers... speak again, traveler.",
  fun_fact: "",
  mission_complete: false,
  follow_up_chips: [],
  scene_reaction: "none",
  image_prompt: "",
  image_keyword: "",
};

export type ChatFetchResult = ChatResponse & { apiError?: string };

async function callGroq(messages: { role: string; content: string }[], model: string): Promise<string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;

  const response = await fetch(`${API_BASE}/openai/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.82,
      max_tokens: 600,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message ?? `Groq error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function fetchAgentChat(ctx: ChatRequestContext): Promise<ChatFetchResult> {
  // Fetch live web context based on the user's latest question to ensure accuracy
  try {
    const webCtx = await fetchWebContext(ctx.question);
    if (webCtx) {
      ctx.webContext = webCtx;
    }
  } catch (e) {
    // Ignore search errors
  }

  const messages = buildMessages(ctx);

  if (!API_KEY && !import.meta.env.DEV) {
    return {
      ...DEFAULT_RESPONSE,
      reply: "The timestream is unstable — the voices of this era fade. Please try again.",
      apiError: "Missing VITE_GROQ_API_KEY. Add your Groq key to .env.local and restart the dev server.",
    };
  }

  try {
    const raw = await callGroq(messages, MODEL_PRIMARY);
    return parseResponse(raw);
  } catch (primaryErr) {
    const primaryMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
    console.warn("Primary model failed, retrying with fallback:", primaryMsg);
    try {
      const raw = await callGroq(messages, MODEL_FALLBACK);
      return parseResponse(raw);
    } catch (fallbackErr) {
      const fallbackMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
      console.error("Chat failed:", fallbackMsg);
      const noKey = /401|403|invalid.*api.*key|authentication/i.test(fallbackMsg);
      return {
        ...DEFAULT_RESPONSE,
        reply: "The timestream is unstable — the voices of this era fade. Please try again.",
        apiError: noKey
          ? "Groq API key missing or invalid. Copy .env.example → .env.local, add GROQ_API_KEY, restart npm run dev."
          : fallbackMsg,
      };
    }
  }
}

/** Typewriter-style delivery of a complete reply */
export async function streamReplyText(
  text: string,
  onChunk: (partial: string) => void,
  charsPerTick = 3,
  ms = 18
): Promise<void> {
  let i = 0;
  return new Promise(resolve => {
    const tick = () => {
      i = Math.min(text.length, i + charsPerTick);
      onChunk(text.slice(0, i));
      if (i >= text.length) resolve();
      else setTimeout(tick, ms);
    };
    tick();
  });
}

export type { ChatHistoryItem as ChatHistoryItemExport };
