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
  image_prompt?: string;
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
}

const MODEL_PRIMARY = "llama-3.3-70b-versatile";
const MODEL_FALLBACK = "llama-3.1-8b-instant";
const MAX_HISTORY_TURNS = 8;

const API_BASE = import.meta.env.DEV ? "/api/groq" : "https://api.groq.com";
const API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";

function trimHistory(history: ChatHistoryItem[]): ChatHistoryItem[] {
  return history.slice(-MAX_HISTORY_TURNS * 2);
}

function buildSystemPrompt(ctx: ChatRequestContext): string {
  const hotspots = ctx.hotspotLore.length
    ? `\nNotable places here: ${ctx.hotspotLore.join(" | ")}`
    : "";

  const memory = ctx.travelerMemory.length
    ? `\nWhat you know about this time traveler from past journeys: ${ctx.travelerMemory.join("; ")}`
    : "";

  return `You are ${ctx.agentName}, ${ctx.agentRole}, living in the year ${ctx.year} (${ctx.eraName}).

${CONTENT_LENS}

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
- image_prompt: a descriptive 8-15 word prompt for generating an image showing the subject/events mentioned in the reply. Must be historical, specific, realistic/period-appropriate (e.g. "old polaroid photo of a 1990s desktop computer, warm lighting"). Do not include any text or watermark.

Respond ONLY with valid JSON:
{"reply":"...","fun_fact":"...","mission_complete":false,"follow_up_chips":["...","..."],"scene_reaction":"none","image_prompt":"..."}`;
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
    image_prompt: parsed.image_prompt ? String(parsed.image_prompt) : undefined,
  };
}

const DEFAULT_RESPONSE: ChatResponse = {
  reply: "The timestream flickers... speak again, traveler.",
  fun_fact: "",
  mission_complete: false,
  follow_up_chips: [],
  scene_reaction: "none",
  image_prompt: undefined,
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
