import type { EraId } from "./era-config";

export interface Hotspot {
  id: string;
  label: string;
  lore: string;
  left: string;
  top: string;
}

export const ERA_HOTSPOTS: Record<EraId, Hotspot[]> = {
  prehistoric: [
    { id: "cave", label: "Bhimbetka Caves", lore: "Rock shelters in Madhya Pradesh — 30,000-year-old paintings of hunters and dancers.", left: "22%", top: "42%" },
    { id: "river", label: "Narmada Valley", lore: "Early hominid tools found here — among India's oldest archaeological sites.", left: "68%", top: "48%" },
  ],
  ancient: [
    { id: "bath", label: "Great Bath", lore: "Mohenjo-daro's public bath — engineering marvel of the Indus Valley Civilization.", left: "35%", top: "38%" },
    { id: "granary", label: "Harappan Granary", lore: "Stored surplus grain for a city of 40,000 — proof of advanced urban planning.", left: "62%", top: "45%" },
  ],
  classical: [
    { id: "pillar", label: "Ashoka Pillar", lore: "Lion capital of Sarnath — later adopted as India's national emblem.", left: "28%", top: "36%" },
    { id: "nalanda", label: "Nalanda University", lore: "The world's first residential university — scholars arrived from across Asia.", left: "70%", top: "40%" },
  ],
  medieval: [
    { id: "hampi", label: "Hampi Bazaar", lore: "Vijayanagara's market sold spices, horses, and gems from three continents.", left: "20%", top: "38%" },
    { id: "qutb", label: "Qutb Minar", lore: "Delhi's victory tower — symbol of Sultanate power rising in North India.", left: "75%", top: "34%" },
  ],
  industrial: [
    { id: "dock", label: "Bombay Docks", lore: "Cotton and opium trade made Mumbai the urbs prima of British India.", left: "40%", top: "42%" },
    { id: "rail", label: "First Railway", lore: "1853: India's first train ran from Bombay to Thane — 34 km that changed everything.", left: "65%", top: "48%" },
  ],
  wartime: [
    { id: "jail", label: "Aga Khan Palace", lore: "Gandhi, Kasturba, and Sarojini Naidu were imprisoned here during Quit India.", left: "30%", top: "40%" },
    { id: "redfort", label: "Red Fort", lore: "Nehru hoisted the tricolor here on August 15, 1947 — 'Tryst with Destiny.'", left: "72%", top: "36%" },
  ],
  analog: [
    { id: "isro", label: "Thumba Launch", lore: "1963: India's first rocket launched from a fishing village in Kerala.", left: "35%", top: "38%" },
    { id: "green", label: "Punjab Fields", lore: "Green Revolution wheat transformed India from famine to food exporter.", left: "68%", top: "44%" },
  ],
  digital: [
    { id: "infy", label: "Electronic City", lore: "Bangalore's IT corridor — Infosys and Wipro put India on the global software map.", left: "38%", top: "36%" },
    { id: "cafe", label: "Cyber Café", lore: "Dial-up modems connected middle-class India to the world wide web.", left: "62%", top: "46%" },
  ],
  present: [
    { id: "metro", label: "Metro & UPI", lore: "A billion digital payments a month — India skipped cards and went straight to QR.", left: "45%", top: "34%" },
    { id: "isro2", label: "Chandrayaan-3", lore: "India lands near the Moon's south pole — first nation to do so.", left: "22%", top: "48%" },
  ],
  future: [
    { id: "arcology", label: "Mumbai Arcology", lore: "Self-sustaining towers house millions — monsoon-proof, solar-powered megastructures.", left: "35%", top: "30%" },
    { id: "lunar", label: "Gaganyaan Base", lore: "Indian astronauts maintain a research outpost on the lunar surface.", left: "72%", top: "28%" },
  ],
};

export const ERA_PROMPT_CHIPS: Record<EraId, string[]> = {
  prehistoric: ["Tell me about Bhimbetka", "How did tribes survive?", "What animals lived here?"],
  ancient: ["How did Harappans live?", "Explain the Great Bath", "What did they trade?"],
  classical: ["Who was Emperor Ashoka?", "Tell me about Nalanda", "What is the Gupta age?"],
  medieval: ["Describe Hampi bazaar", "Who were the Mughals?", "Life in Delhi Sultanate?"],
  industrial: ["How did railways change India?", "Life in colonial Mumbai?", "What is satyagraha?"],
  wartime: ["Tell me about Quit India", "Where was Gandhi jailed?", "What happened in 1947?"],
  analog: ["How did ISRO begin?", "What was Green Revolution?", "Life after independence?"],
  digital: ["Why Bangalore for IT?", "What changed in 1991?", "Early internet in India?"],
  present: ["How is AI used in India?", "Explain UPI revolution", "Latest ISRO missions?"],
  future: ["What is Bharat in 2070?", "Indian cities of the future?", "India on the Moon?"],
};
