import type { EraId } from "./era-config";

export interface StoredMessage {
  id: string;
  agentId: string;
  agentName: string;
  agentColor: string;
  bubbleColor: string;
  text: string;
  funFact?: string;
  isUser?: boolean;
  imageUrl?: string;
}

export interface StoredChat {
  messages: StoredMessage[];
  missionComplete: boolean;
  selectedAgentId: string;
}

const PREFIX = "ai-time-machine-chat-";

export function loadChat(eraId: EraId, year: number): StoredChat | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${eraId}-${year}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveChat(eraId: EraId, year: number, chat: StoredChat): void {
  localStorage.setItem(`${PREFIX}${eraId}-${year}`, JSON.stringify(chat));
}

export function clearChat(eraId: EraId, year: number): void {
  localStorage.removeItem(`${PREFIX}${eraId}-${year}`);
}
