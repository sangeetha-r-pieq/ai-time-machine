import type { EraId } from "./era-config";

export interface IndiaAgentIdentity {
  name: string;
  role: string;
}

const IDENTITY: Record<string, IndiaAgentIdentity> = {
  "prehistoric-elder": { name: "Veer", role: "Tribal elder of the Narmada valley" },
  "prehistoric-historian": { name: "Dr. Ananya", role: "Archaeologist, Bhimbetka" },
  "ancient-scribe": { name: "Dholavira", role: "Harappan scribe, Mohenjo-daro" },
  "ancient-historian": { name: "Dr. Priya", role: "Indus Valley researcher" },
  "classical-local": { name: "Arjun", role: "Merchant of Pataliputra" },
  "classical-historian": { name: "Prof. Meera", role: "Historian of Maurya India" },
  "medieval-monk": { name: "Swami Kartik", role: "Monk at a Vijayanagara temple" },
  "medieval-historian": { name: "Dr. Lakshmi", role: "Medieval India scholar" },
  "industrial-foreman": { name: "Rahim", role: "Bombay cotton mill worker, 1880s" },
  "industrial-historian": { name: "Dr. Roy", role: "Colonial India historian" },
  "wartime-soldier": { name: "Subedar Vikram", role: "Indian soldier, freedom struggle era" },
  "wartime-historian": { name: "Dr. Nandini", role: "Independence movement researcher" },
  "analog-local": { name: "Lakshmi", role: "ISRO technician, Thumba 1969" },
  "analog-historian": { name: "Dr. Sarabhai Jr.", role: "Space history archivist" },
  "digital-dev": { name: "Raj", role: "Bangalore software engineer, 1995" },
  "digital-historian": { name: "Prof. Iyer", role: "IT revolution chronicler" },
  "present-citizen": { name: "Ananya K.", role: "AI product manager, Bengaluru" },
  "present-analyst": { name: "Rohan S.", role: "Tech policy analyst, Delhi" },
  "future-guide": { name: "Kiran-7", role: "AI guide, Bharat 2070" },
  "future-human": { name: "Mira Patel", role: "Historian of 21st-century India" },
};

const GREETINGS: Record<string, string[]> = {
  "prehistoric-elder": [
    "The fire remembers old stories. You walk in from a strange time — sit, and ask.",
    "Our ancestors painted these walls ten thousand years ago. What do you seek here?",
  ],
  "ancient-scribe": [
    "Welcome to the city of brick and bath. I record trade and seals — what brings you?",
    "The Great Bath gleams in the morning sun. Ask what you will of our age.",
  ],
  "classical-local": [
    "Namaste, traveler. Pataliputra's markets are busy today — what do you wish to know?",
    "The Maurya roads stretch far. I trade along them — ask your question.",
  ],
  "medieval-monk": [
    "Blessings upon you. The temple bells ring for evening prayer — how may I help?",
    "Hampi's stones have seen empires rise and fall. Speak your question.",
  ],
  "industrial-foreman": [
    "The mill whistles never stop in Bombay. You look like you're from another time — ask away.",
    "The trains run to Thane now. Britain rules, but India breathes. What do you want to know?",
  ],
  "wartime-soldier": [
    "Freedom is in the air — can you feel it? Ask me anything about these years.",
    "The tricolor flies in hearts if not yet on every flag. What brings you here?",
  ],
  "analog-local": [
    "The rocket stands on the pad at Thumba! Aryabhata launches soon — what do you ask?",
    "Dr. Sarabhai says India will reach the stars. I'm proud to be here. Your question?",
  ],
  "digital-dev": [
    "Welcome to Bangalore! The Y2K deadline looms and our code ships worldwide. Ask me anything.",
    "Infosys, Wipro — the world is discovering Indian software. What do you want to know?",
  ],
  "present-citizen": [
    "Hey! Bengaluru's buzzing with AI startups. UPI, Chandrayaan, LLMs — what interests you?",
    "Namaste from 2026! India builds AI for 22 languages now. What's your question?",
  ],
  "future-guide": [
    "Welcome, time traveler. Bharat 2070 holds answers your era is still seeking. Ask.",
    "I've watched every era of Indian history. What do you wish to understand?",
  ],
};

const KEYWORD_REPLIES: Record<string, { triggers: RegExp[]; reply: string }[]> = {
  "present-citizen": [
    { triggers: [/ai|gpt|llm|model|chatbot/i], reply: "We build AI for Indian languages — Hindi, Tamil, Bengali, all twenty-two. Startups in Koramangala ship models to the world. It's not Silicon Valley's story anymore; it's ours." },
    { triggers: [/upi|payment|digital/i], reply: "UPI crossed a billion transactions a month. My grandmother in Mysore pays the vegetable vendor by scanning a QR code. That happened in one decade." },
    { triggers: [/isro|space|chandrayaan|mars|moon/i], reply: "Chandrayaan found water on the Moon. Mangalyaan reached Mars first try. ISRO does it cheaper than anyone — frugal innovation, they call it." },
  ],
  "wartime-soldier": [
    { triggers: [/gandhi|non.?violence|satyagraha/i], reply: "Gandhi's call changed everything. 'Do or Die' in 1942 — we knew freedom was near, even from jail." },
    { triggers: [/partition|1947|independence|freedom/i], reply: "August 15, 1947 — midnight freedom. Joy and grief together. Millions crossed borders. We won, but the cost was immense." },
    { triggers: [/nehru|patel|bose|ina/i], reply: "Nehru, Patel, Subhas Bose — different paths, same dream. The INA shook the empire. We all played our part." },
  ],
  "analog-local": [
    { triggers: [/isro|rocket|satellite|space|aryabhata/i], reply: "We launched from a fishing village in Kerala with bullock carts carrying parts! Rohini went up on SLV-3. India joined the space club." },
    { triggers: [/sarabhai|bhabha|kalam/i], reply: "Dr. Sarabhai dreamed this into being. Vikram Sarabhai said we must be second to none in space. We believed him." },
  ],
  "digital-dev": [
    { triggers: [/y2k|software|outsourc|bangalore|bengaluru/i], reply: "Y2K panic meant the world needed Indian programmers fast. Bangalore didn't sleep for months. We fixed their clocks and built an industry." },
    { triggers: [/1991|liberal|reform|economy/i], reply: "1991 changed everything — Manmohan Singh opened the economy. Suddenly software exports were India's future." },
  ],
};

export function getIndiaAgentIdentity(eraId: EraId, agentId: string): IndiaAgentIdentity {
  return IDENTITY[`${eraId}-${agentId}`] ?? { name: agentId, role: "Local guide" };
}

export function getIndiaGreeting(eraId: EraId, agentId: string): string {
  const lines = GREETINGS[`${eraId}-${agentId}`];
  if (lines?.length) return lines[Math.floor(Math.random() * lines.length)];
  const id = getIndiaAgentIdentity(eraId, agentId);
  return `Namaste, I am ${id.name}. Ask me about India in this era — and how it connects to the wider world.`;
}

export function getIndiaFallbackReply(eraId: EraId, agentId: string, question: string, year: number): string {
  const keyed = KEYWORD_REPLIES[`${eraId}-${agentId}`];
  if (keyed) {
    for (const { triggers, reply } of keyed) {
      if (triggers.some(r => r.test(question))) return reply;
    }
  }
  const id = getIndiaAgentIdentity(eraId, agentId);
  const topic = question.length > 80 ? `${question.slice(0, 80)}…` : question;
  return `You ask about "${topic}" — let me start with how India experienced ${year}, then we can explore the wider world too. As ${id.name}, I'd answer fully if the timestream were stable — please try again.`;
}
