import type { EraId } from "./era-config";

export interface EraMission {
  title: string;
  goal: string;
  keywords: string[];
}

export const ERA_MISSIONS: Record<EraId, EraMission> = {
  prehistoric: {
    title: "Bhimbetka Echoes",
    goal: "Learn how early Indians hunted, painted caves, and survived the land.",
    keywords: ["hunt", "cave", "fire", "tribe", "Bhimbetka", "survive"],
  },
  ancient: {
    title: "Secrets of the Indus",
    goal: "Discover how Harappan cities were planned and how people lived.",
    keywords: ["Indus", "Harappa", "Mohenjo", "drainage", "seal", "trade"],
  },
  classical: {
    title: "Empire of Dharma",
    goal: "Explore Ashoka, Nalanda, or the Gupta golden age.",
    keywords: ["Ashoka", "Maurya", "Gupta", "Nalanda", "Buddha", "stupa"],
  },
  medieval: {
    title: "Temples & Sultanates",
    goal: "Understand Vijayanagara, Mughals, or Delhi Sultanate life.",
    keywords: ["Mughal", "Vijayanagara", "temple", "Delhi", "Hampi", "bazaar"],
  },
  industrial: {
    title: "Railways & Resistance",
    goal: "Learn how colonial rule and industry changed Indian cities.",
    keywords: ["railway", "cotton", "Mumbai", "Calcutta", "colonial", "mill"],
  },
  wartime: {
    title: "Road to Freedom",
    goal: "Understand Quit India, WWII, and the independence struggle.",
    keywords: ["Gandhi", "freedom", "Quit India", "Nehru", "jail", "independence"],
  },
  analog: {
    title: "ISRO Dream",
    goal: "Explore India's space program and post-independence science.",
    keywords: ["ISRO", "space", "rocket", "Sarabhai", "satellite", "moon"],
  },
  digital: {
    title: "Bangalore Rising",
    goal: "Discover how IT and liberalization transformed India.",
    keywords: ["Bangalore", "software", "IT", "liberalization", "computer", "startup"],
  },
  present: {
    title: "Digital Bharat",
    goal: "Learn how AI, UPI, and tech hubs shape modern India.",
    keywords: ["AI", "UPI", "startup", "Bengaluru", "digital", "ISRO"],
  },
  future: {
    title: "Bharat 2070",
    goal: "Imagine India's cities, climate tech, and space future.",
    keywords: ["future", "Mumbai", "solar", "Mars", "Hindi", "climate"],
  },
};
