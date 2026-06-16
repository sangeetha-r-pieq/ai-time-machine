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
    { id: "cave", label: "Cave Shelter", lore: "Charcoal paintings of hunters and animals — some of humanity's oldest art.", left: "22%", top: "42%" },
    { id: "river", label: "River Crossing", lore: "Fresh water and game trails made rivers the highways of the ancient world.", left: "68%", top: "48%" },
  ],
  ancient: [
    { id: "pyramid", label: "Great Pyramid", lore: "Khufu's pyramid — millions of limestone blocks, built by organised labour over decades.", left: "35%", top: "38%" },
    { id: "nile", label: "Nile Inundation", lore: "The annual flood deposited rich silt — Egypt's agriculture depended on it.", left: "62%", top: "45%" },
  ],
  classical: [
    { id: "agora", label: "Athenian Agora", lore: "Market and assembly — where citizens debated war, taxes, and philosophy.", left: "28%", top: "36%" },
    { id: "temple", label: "Parthenon", lore: "Athena's temple on the Acropolis — symbol of Athenian power and pride.", left: "70%", top: "40%" },
  ],
  medieval: [
    { id: "castle", label: "Castle Keep", lore: "Stone walls, moats, and feudal lords — power concentrated in fortified heights.", left: "20%", top: "38%" },
    { id: "cathedral", label: "Cathedral", lore: "Gothic spires took generations to build — faith made visible in stone.", left: "75%", top: "34%" },
  ],
  industrial: [
    { id: "mill", label: "Cotton Mill", lore: "Steam looms ran day and night — one machine could replace dozens of hand weavers.", left: "40%", top: "42%" },
    { id: "rail", label: "Railway Station", lore: "Trains shrank distances — Manchester to Liverpool in an hour instead of a day.", left: "65%", top: "48%" },
  ],
  wartime: [
    { id: "trench", label: "Front Line", lore: "Trenches stretched hundreds of miles — mud, barbed wire, and artillery defined the war.", left: "30%", top: "40%" },
    { id: "radio", label: "Field Radio", lore: "BBC broadcasts reached soldiers on shortwave — Churchill's voice carried morale.", left: "72%", top: "36%" },
  ],
  analog: [
    { id: "launch", label: "Launch Pad", lore: "Saturn V stood 363 feet tall — the rocket that would carry humans to the Moon.", left: "35%", top: "38%" },
    { id: "mission", label: "Mission Control", lore: "Houston tracked every second of Apollo 11 — engineers with slide rules and nerve.", left: "68%", top: "44%" },
  ],
  digital: [
    { id: "server", label: "Server Room", lore: "Racks of machines connected the early commercial internet — the web went live in 1991.", left: "38%", top: "36%" },
    { id: "office", label: "Dot-Com Office", lore: "Startups burned venture cash on beanbags and bandwidth — boom and bust followed.", left: "62%", top: "46%" },
  ],
  present: [
    { id: "datacenter", label: "AI Data Center", lore: "GPU clusters train models that now write code, images, and conversation.", left: "45%", top: "34%" },
    { id: "city", label: "Global City", lore: "Remote teams span continents — work, rent, and politics feel permanently unsettled.", left: "22%", top: "48%" },
  ],
  future: [
    { id: "arcology", label: "Arcology Tower", lore: "Self-sustaining megastructures house millions — forests grow on upper floors.", left: "35%", top: "30%" },
    { id: "mars", label: "Mars Settlement", lore: "The first Mars-born generation debates whether they are still Earth citizens.", left: "72%", top: "28%" },
  ],
};

export const ERA_PROMPT_CHIPS: Record<EraId, string[]> = {
  prehistoric: ["How did people hunt?", "What is cave art for?", "How did tribes survive winter?"],
  ancient: ["Who built the pyramids?", "How did Egyptians live?", "What did they trade?"],
  classical: ["How did Athenian democracy work?", "Who was Socrates?", "What caused the Peloponnesian War?"],
  medieval: ["What was feudal life like?", "How bad was the Black Death?", "Why were cathedrals built?"],
  industrial: ["What was factory work like?", "How did railways change life?", "Who fought for reform?"],
  wartime: ["What was D-Day like?", "How did civilians cope?", "Why was WWII so deadly?"],
  analog: ["What was Apollo 11 like?", "How did the space race start?", "What computers did NASA use?"],
  digital: ["How did the web begin?", "What was the dot-com boom?", "When did email go mainstream?"],
  present: ["How is AI changing work?", "What's the climate outlook?", "How did COVID change society?"],
  future: ["What is life like in 2070?", "Will humans live on Mars?", "How was climate solved?"],
};
