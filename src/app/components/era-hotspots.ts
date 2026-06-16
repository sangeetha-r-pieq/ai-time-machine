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
    { id: "cave", label: "Sacred Cave", lore: "Where the tribe gathers around fire and tells stories of the hunt.", left: "18%", top: "42%" },
    { id: "ridge", label: "Eastern Ridge", lore: "Another clan marks this territory. Crossing it breaks ancient law.", left: "72%", top: "38%" },
  ],
  ancient: [
    { id: "pyramid", label: "Great Pyramid", lore: "A tomb for the divine king, aligned with the stars themselves.", left: "28%", top: "35%" },
    { id: "nile", label: "The Nile", lore: "Egypt's lifeblood — without its floods, the kingdom would perish.", left: "55%", top: "55%" },
  ],
  classical: [
    { id: "agora", label: "The Agora", lore: "Citizens debate philosophy, politics, and the nature of virtue here.", left: "22%", top: "40%" },
    { id: "temple", label: "Temple of Athena", lore: "Marble columns rise where gods and mortals meet in prayer.", left: "65%", top: "32%" },
  ],
  medieval: [
    { id: "castle", label: "Castle Keep", lore: "Stone walls shelter nobles while peasants toil in the fields below.", left: "15%", top: "36%" },
    { id: "church", label: "Gothic Church", lore: "Stained glass and incense — the Church holds power over all souls.", left: "78%", top: "34%" },
  ],
  industrial: [
    { id: "factory", label: "Steam Factory", lore: "Coal smoke fills the sky as machines reshape human labor forever.", left: "35%", top: "38%" },
    { id: "rail", label: "Railway", lore: "Iron tracks connect cities — the world grows smaller by the mile.", left: "68%", top: "48%" },
  ],
  wartime: [
    { id: "bunker", label: "Air-Raid Shelter", lore: "Families huddle below as searchlights sweep the shattered skyline.", left: "25%", top: "40%" },
    { id: "ruins", label: "Bomb Ruins", lore: "What took generations to build, destroyed in a single night.", left: "70%", top: "42%" },
  ],
  analog: [
    { id: "suburb", label: "Suburbia", lore: "Levittown dreams — a car in every driveway, a TV in every living room.", left: "30%", top: "40%" },
    { id: "tower", label: "Water Tower", lore: "A landmark of the space age — Houston, we have a problem.", left: "82%", top: "36%" },
  ],
  digital: [
    { id: "tower", label: "Data Tower", lore: "Neon-lit skyscrapers house the servers powering the early internet.", left: "40%", top: "35%" },
    { id: "cafe", label: "Cyber Café", lore: "Modems screech as the world logs on for the very first time.", left: "62%", top: "45%" },
  ],
  present: [
    { id: "skyline", label: "Smart City", lore: "Glass towers bristle with sensors — every street is watched.", left: "50%", top: "32%" },
    { id: "park", label: "Urban Green", lore: "A rare patch of nature between the algorithms and the asphalt.", left: "20%", top: "48%" },
  ],
  future: [
    { id: "arcology", label: "Arcology Spire", lore: "Self-contained cities rise a kilometer into the smog-free sky.", left: "35%", top: "30%" },
    { id: "platform", label: "Hover Platform", lore: "Anti-grav transit glides silently between the organic towers.", left: "72%", top: "28%" },
  ],
};

export const ERA_PROMPT_CHIPS: Record<EraId, string[]> = {
  prehistoric: ["What's daily life like?", "Tell me about the hunt", "What dangers lurk here?"],
  ancient: ["Who rules this land?", "How were the pyramids built?", "What gods do you worship?"],
  classical: ["What is philosophy?", "Who leads the city?", "Describe the agora"],
  medieval: ["Who holds power?", "What is life in the castle?", "Tell me about the plague"],
  industrial: ["What powers the machines?", "How has life changed?", "Where does the smoke come from?"],
  wartime: ["What is happening?", "How do people survive?", "What news from the front?"],
  analog: ["What is on TV?", "Tell me about space", "What music is popular?"],
  digital: ["What is the internet?", "How do computers work?", "What is changing?"],
  present: ["What defines today?", "How does technology shape us?", "What comes next?"],
  future: ["What year is this really?", "How do people live now?", "What happened to Earth?"],
};
