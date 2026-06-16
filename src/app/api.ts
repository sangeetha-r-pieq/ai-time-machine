import type { EraId } from "./components/era-config";
import type { AgentPersonality } from "./components/agent-personalities";

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
const MAX_HISTORY_TURNS = 10;

const API_BASE = import.meta.env.DEV ? "/api/groq" : "https://api.groq.com";
const API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";

function trimHistory(history: ChatHistoryItem[], agentName: string): ChatHistoryItem[] {
  const filtered = history.filter(h => h.isUser || h.sender === agentName);
  return filtered.slice(-MAX_HISTORY_TURNS * 2);
}

function buildSystemPrompt(ctx: ChatRequestContext): string {
  const hotspots = ctx.hotspotLore.length
    ? `\nNotable places here: ${ctx.hotspotLore.join(" | ")}`
    : "";

  const memory = ctx.travelerMemory.length
    ? `\nWhat you know about this time traveler from past journeys: ${ctx.travelerMemory.join("; ")}`
    : "";

  return `You are ${ctx.agentName}, ${ctx.agentRole}, living in the year ${ctx.year} (${ctx.eraName}).

PERSONALITY: ${ctx.personality.personality}
SPEECH STYLE: ${ctx.personality.speechStyle}
YOUR KNOWLEDGE: ${ctx.personality.knowledge}

HISTORICAL CONTEXT FOR ${ctx.year}:
${ctx.yearHeadline} — ${ctx.yearDetail}${hotspots}${memory}

ACTIVE MISSION: "${ctx.missionTitle}" — ${ctx.missionGoal}
Set mission_complete to true only if the user's message genuinely engages with this mission topic (not just "hello").

RULES:
- Stay completely in character. Never mention being an AI.
- reply: 2-3 sentences in character responding to the user.
- fun_fact: one surprising historical fact about ${ctx.year} or the topic discussed.
- follow_up_chips: 2 short questions the user might ask next (max 6 words each).
- scene_reaction: one of none|fire|stars|snow|digital|spark based on topic (fire for war/fire, stars for space, etc.)

Respond ONLY with valid JSON:
{"reply":"...","fun_fact":"...","mission_complete":false,"follow_up_chips":["...","..."],"scene_reaction":"none"}`;
}

function buildMessages(ctx: ChatRequestContext) {
  const trimmed = trimHistory(ctx.history, ctx.agentName);
  const messages: { role: string; content: string }[] = [
    { role: "system", content: buildSystemPrompt(ctx) },
  ];

  for (const item of trimmed) {
    if (item.isUser) {
      messages.push({ role: "user", content: item.text });
    } else {
      messages.push({ role: "assistant", content: item.text });
    }
  }

  messages.push({ role: "user", content: ctx.question });
  return messages;
}

function parseResponse(raw: string): ChatResponse {
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return {
    reply: parsed.reply ?? "...",
    fun_fact: parsed.fun_fact ?? "",
    mission_complete: Boolean(parsed.mission_complete),
    follow_up_chips: Array.isArray(parsed.follow_up_chips) ? parsed.follow_up_chips.slice(0, 3) : [],
    scene_reaction: parsed.scene_reaction ?? "none",
  };
}

const DEFAULT_RESPONSE: ChatResponse = {
  reply: "The timestream flickers... speak again, traveler.",
  fun_fact: "",
  mission_complete: false,
  follow_up_chips: [],
  scene_reaction: "none",
};

async function callGroq(messages: { role: string; content: string }[], model: string): Promise<string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;

  const response = await fetch(`${API_BASE}/openai/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.75,
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

export async function fetchAgentChat(ctx: ChatRequestContext): Promise<ChatResponse> {
  const messages = buildMessages(ctx);

  try {
    const raw = await callGroq(messages, MODEL_PRIMARY);
    return parseResponse(raw);
  } catch (primaryErr) {
    console.warn("Primary model failed, retrying with fallback:", primaryErr);
    try {
      const raw = await callGroq(messages, MODEL_FALLBACK);
      return parseResponse(raw);
    } catch (fallbackErr) {
      console.error("Chat failed:", fallbackErr);
      return { ...DEFAULT_RESPONSE, reply: "The timestream is unstable — the voices of this era fade. Please try again." };
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
      if ( i >= text.length) resolve();
      else setTimeout(tick, ms);
    };
    tick();
  });
}

export type { ChatHistoryItem as ChatHistoryItemExport };
