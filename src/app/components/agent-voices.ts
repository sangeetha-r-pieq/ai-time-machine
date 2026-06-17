import type { EraId } from "./era-config";

export type AgentGender = "male" | "female";

export interface AgentVoiceProfile {
  gender: AgentGender;
  pitch: number;
  rate: number;
}

const GENDER: Record<string, AgentGender> = {
  "prehistoric-elder": "male",
  "prehistoric-historian": "female",
  "ancient-scribe": "male",
  "ancient-historian": "female",
  "classical-local": "male",
  "classical-historian": "male",
  "medieval-monk": "male",
  "medieval-historian": "female",
  "industrial-foreman": "male",
  "industrial-historian": "male",
  "wartime-soldier": "male",
  "wartime-historian": "female",
  "analog-local": "female",
  "analog-historian": "male",
  "digital-dev": "male",
  "digital-historian": "female",
  "present-citizen": "male",
  "present-analyst": "female",
  "future-guide": "male",
  "future-human": "female",
};

export function getAgentGender(eraId: EraId, agentId: string): AgentGender {
  return GENDER[`${eraId}-${agentId}`] ?? "male";
}

export function getAgentVoiceProfile(eraId: EraId, agentId: string): AgentVoiceProfile {
  const gender = getAgentGender(eraId, agentId);
  return {
    gender,
    pitch: gender === "female" ? 1.14 : 0.86,
    rate: gender === "female" ? 1.05 : 0.92,
  };
}

export function genderLabel(gender: AgentGender): string {
  return gender === "female" ? "Female" : "Male";
}

export function genderIcon(gender: AgentGender): string {
  return gender === "female" ? "👩" : "👨";
}
