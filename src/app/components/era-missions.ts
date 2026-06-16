import type { EraId } from "./era-config";

export interface EraMission {
  title: string;
  goal: string;
  keywords: string[];
}

export const ERA_MISSIONS: Record<EraId, EraMission> = {
  prehistoric: {
    title: "Survive the Dawn",
    goal: "Learn how this tribe hunts, finds fire, and survives.",
    keywords: ["hunt", "fire", "food", "tribe", "survive", "animal"],
  },
  ancient: {
    title: "Secrets of the Nile",
    goal: "Discover how pharaohs rule and pyramids are built.",
    keywords: ["pharaoh", "pyramid", "nile", "god", "tomb", "scribe"],
  },
  classical: {
    title: "Wisdom of the Agora",
    goal: "Explore philosophy, democracy, or daily life in the polis.",
    keywords: ["philosophy", "socrates", "athens", "democracy", "agora", "virtue"],
  },
  medieval: {
    title: "Life Behind Castle Walls",
    goal: "Understand feudal power, faith, and plague-era survival.",
    keywords: ["castle", "king", "church", "plague", "knight", "lord"],
  },
  industrial: {
    title: "Smoke and Progress",
    goal: "Learn how machines and factories changed human labor.",
    keywords: ["factory", "steam", "machine", "coal", "rail", "industry"],
  },
  wartime: {
    title: "Echoes of War",
    goal: "Understand what people endured during the world wars.",
    keywords: ["war", "soldier", "bomb", "front", "freedom", "survive"],
  },
  analog: {
    title: "Race to the Stars",
    goal: "Explore space exploration and life in the Cold War era.",
    keywords: ["moon", "space", "apollo", "nasa", "rocket", "satellite"],
  },
  digital: {
    title: "Birth of the Web",
    goal: "Discover how computers and the internet changed the world.",
    keywords: ["internet", "computer", "web", "online", "digital", "software"],
  },
  present: {
    title: "The AI Age",
    goal: "Understand how artificial intelligence shapes modern life.",
    keywords: ["ai", "artificial", "technology", "future", "machine", "chat"],
  },
  future: {
    title: "Tomorrow's Horizon",
    goal: "Learn how humanity lives in the far future.",
    keywords: ["future", "mars", "colony", "quantum", "arcology", "energy"],
  },
};
