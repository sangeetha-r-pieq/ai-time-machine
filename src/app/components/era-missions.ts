import type { EraId } from "./era-config";

export interface EraMission {
  title: string;
  goal: string;
  keywords: string[];
}

export const ERA_MISSIONS: Record<EraId, EraMission> = {
  prehistoric: {
    title: "Fire & Survival",
    goal: "Learn how early humans hunted, made fire, and organized tribes.",
    keywords: ["hunt", "cave", "fire", "tribe", "survive", "animal"],
  },
  ancient: {
    title: "River of Kings",
    goal: "Discover how ancient Egypt built monuments and ran an empire.",
    keywords: ["pyramid", "pharaoh", "nile", "temple", "scribe", "trade"],
  },
  classical: {
    title: "Birth of Democracy",
    goal: "Explore Athens, philosophy, and the classical Mediterranean world.",
    keywords: ["athens", "democracy", "socrates", "sparta", "rome", "philosophy"],
  },
  medieval: {
    title: "Age of Faith & Plague",
    goal: "Understand feudal life, the church, and the Black Death.",
    keywords: ["plague", "castle", "monk", "crusade", "guild", "king"],
  },
  industrial: {
    title: "Steam & Smoke",
    goal: "See how factories, railways, and reform changed modern cities.",
    keywords: ["factory", "steam", "rail", "worker", "manchester", "reform"],
  },
  wartime: {
    title: "Total War",
    goal: "Understand WWII through soldiers, civilians, and global conflict.",
    keywords: ["war", "normandy", "german", "bomb", "home", "soldier"],
  },
  analog: {
    title: "Race to the Moon",
    goal: "Explore the space race, Apollo 11, and Cold War science.",
    keywords: ["moon", "apollo", "nasa", "space", "soviet", "rocket"],
  },
  digital: {
    title: "World Wide Web",
    goal: "Discover how personal computers and the internet reshaped society.",
    keywords: ["internet", "computer", "software", "dot-com", "email", "web"],
  },
  present: {
    title: "Hinge Decade",
    goal: "Learn how AI, climate, and global politics define the 2020s.",
    keywords: ["ai", "climate", "remote", "economy", "social", "technology"],
  },
  future: {
    title: "After the Transition",
    goal: "Imagine post-AGI cities, climate recovery, and life beyond Earth.",
    keywords: ["future", "mars", "climate", "city", "ai", "consciousness"],
  },
};
