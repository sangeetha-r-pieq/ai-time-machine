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
}

export interface StoredChat {
  messages: StoredMessage[];
  missionComplete: boolean;
  selectedAgentId: string;
}

const PREFIX = "ai-time-machine-chat-";

export function loadChat(eraId: EraId): StoredChat | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${eraId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveChat(eraId: EraId, chat: StoredChat): void {
  localStorage.setItem(`${PREFIX}${eraId}`, JSON.stringify(chat));
}

export function clearChat(eraId: EraId): void {
  localStorage.removeItem(`${PREFIX}${eraId}`);
}
