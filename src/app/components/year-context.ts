export interface YearContext {
  emoji: string;
  headline: string;
  detail: string;
}

const EXACT: Record<number, YearContext> = {
  [-10000]: { emoji: "🦴", headline: "Dawn of Humanity", detail: "Ice Age ends. Hunter-gatherer tribes spread across continents — fire, stone tools, and cave art define life." },
  [-2560]: { emoji: "🔺", headline: "Pyramids of Giza", detail: "The Great Pyramid is rising on the Giza plateau — one of the greatest engineering feats in human history." },
  [-44]: { emoji: "🗡️", headline: "Death of Caesar", detail: "Julius Caesar is assassinated in Rome. The Republic dies with him — empire follows." },
  [476]: { emoji: "🏛️", headline: "Fall of Rome", detail: "The Western Roman Empire collapses. Europe enters the medieval age." },
  [1066]: { emoji: "⚔️", headline: "Battle of Hastings", detail: "William the Conqueror defeats Harold II. England's language, law, and culture are forever changed." },
  [1348]: { emoji: "☠️", headline: "The Black Death", detail: "Plague sweeps Europe — up to a third of the population perishes. Society, faith, and labor are transformed." },
  [1492]: { emoji: "⛵", headline: "Age of Discovery", detail: "Columbus reaches the Americas. A new era of global trade, colonization, and exchange begins." },
  [1776]: { emoji: "📜", headline: "American Independence", detail: "The United States declares independence. Enlightenment ideals of liberty spread across the world." },
  [1789]: { emoji: "🇫🇷", headline: "French Revolution", detail: "The Bastille falls. Monarchy, class, and the very idea of citizenship are rewritten in blood and hope." },
  [1861]: { emoji: "⚔️", headline: "American Civil War", detail: "North and South clash over slavery and union. The war reshapes America and abolishes slavery." },
  [1914]: { emoji: "💣", headline: "World War I Begins", detail: "Europe plunges into industrial-scale war. Empires fall and the modern world is born in trenches." },
  [1917]: { emoji: "✊", headline: "Russian Revolution", detail: "The Tsar is overthrown. Communism rises — the 20th century's great ideological struggle begins." },
  [1929]: { emoji: "📉", headline: "Great Depression", detail: "Markets crash worldwide. Unemployment soars and governments rethink economics and welfare." },
  [1939]: { emoji: "🌍", headline: "World War II Begins", detail: "Nazi Germany invades Poland. The deadliest conflict in human history is underway." },
  [1940]: { emoji: "🇮🇳", headline: "Freedom Struggle & Global War", detail: "World War II rages worldwide. In India, the independence movement intensifies — Gandhi, Nehru, and other leaders face imprisonment as the nation demands freedom from British rule." },
  [1942]: { emoji: "🇮🇳", headline: "Quit India Movement", detail: "Gandhi launches 'Quit India.' Leaders are jailed en masse — yet the freedom struggle only grows stronger." },
  [1944]: { emoji: "🪖", headline: "D-Day Landings", detail: "Allied forces storm Normandy beaches. The beginning of the end for Nazi occupation in Western Europe." },
  [1945]: { emoji: "☮️", headline: "End of World War II", detail: "Atomic bombs fall on Hiroshima and Nagasaki. The war ends — the nuclear age and Cold War begin." },
  [1947]: { emoji: "🇮🇳", headline: "Indian Independence", detail: "India gains freedom at midnight, August 15. A new nation is born — partition and hope collide." },
  [1969]: { emoji: "🌙", headline: "Apollo 11 Moon Landing", detail: "Neil Armstrong walks on the Moon. Humanity's greatest leap — 'one giant leap for mankind.'" },
  [1989]: { emoji: "🧱", headline: "Berlin Wall Falls", detail: "The Cold War thaws. Eastern Europe opens — the world order shifts overnight." },
  [1991]: { emoji: "🌐", headline: "Birth of the World Wide Web", detail: "Tim Berners-Lee's WWW goes public. The internet begins connecting every corner of the planet." },
  [2001]: { emoji: "🏙️", headline: "September 11 Attacks", detail: "Terror strikes New York and Washington. Global politics, security, and travel change forever." },
  [2008]: { emoji: "💰", headline: "Global Financial Crisis", detail: "Markets collapse. Banks fail. The world enters the deepest recession since the 1930s." },
  [2020]: { emoji: "🦠", headline: "COVID-19 Pandemic", detail: "A virus shuts down the world. Remote work, vaccines, and a new normal reshape daily life." },
  [2022]: { emoji: "🤖", headline: "Generative AI Breakthrough", detail: "ChatGPT launches publicly. AI moves from labs into everyday life — writing, coding, and creating." },
  [2024]: { emoji: "🤖", headline: "The AI Era", detail: "Artificial intelligence is everywhere — reshaping work, creativity, medicine, and how humans think. Every industry is racing to adapt." },
  [2025]: { emoji: "🤖", headline: "AI Everywhere", detail: "Agents, copilots, and autonomous systems embed into phones, cars, and offices. The question is no longer if AI matters — but how far it goes." },
  [2030]: { emoji: "🌱", headline: "Climate Crossroads", detail: "Renewables surpass fossil fuels in many regions. Net-zero targets loom — the planet's fate hangs in the balance." },
  [2050]: { emoji: "🏙️", headline: "Smart Megacities", detail: "Vertical farms, autonomous transit, and climate-adapted architecture define urban life. Earth heals slowly." },
  [2070]: { emoji: "🚀", headline: "Neo-Cities & Frontier Tech", detail: "Arcology spires pierce the sky. Quantum networks link Earth to orbital colonies. AI and biotech merge — humanity spreads beyond the planet." },
  [2075]: { emoji: "🌃", headline: "Neo-Tokyo Arcologies", detail: "Self-contained mega-towers house millions. Zero-point energy research hums beneath neon skylines." },
  [2100]: { emoji: "🔮", headline: "Post-Human Horizon", detail: "Mind-upload debates divide society. Mars hosts a self-governing colony. The line between human and machine blurs." },
  [2150]: { emoji: "🛸", headline: "Interplanetary Civilization", detail: "Humanity is a multi-world species. Earth, Mars, and orbital habitats trade culture, goods, and ideas across the solar system." },
};

const RANGES: { from: number; to: number; ctx: YearContext }[] = [
  { from: -50000, to: -3001, ctx: { emoji: "🦣", headline: "Prehistoric World", detail: "Humans live as hunters and gatherers — caves, mammoths, and the first fires that changed everything." } },
  { from: -3000, to: -501, ctx: { emoji: "🏺", headline: "Ancient Civilizations", detail: "Egypt, Mesopotamia, Greece, and Rome rise. Writing, law, and monumental architecture define the age." } },
  { from: -500, to: 499, ctx: { emoji: "🏛️", headline: "Classical Antiquity", detail: "Philosophers debate truth in Athens. Legions march from Rome. The foundations of Western thought are laid." } },
  { from: 500, to: 1499, ctx: { emoji: "🏰", headline: "Medieval Era", detail: "Castles, crusades, and cathedrals. Feudal lords rule while scholars preserve knowledge in monasteries." } },
  { from: 1500, to: 1759, ctx: { emoji: "🌍", headline: "Renaissance & Exploration", detail: "Art, science, and global exploration flourish. Old worlds meet new — for better and worse." } },
  { from: 1760, to: 1899, ctx: { emoji: "🏭", headline: "Industrial Revolution", detail: "Steam, steel, and factories transform society. Cities swell. The modern world is forged in smoke and iron." } },
  { from: 1900, to: 1938, ctx: { emoji: "⚔️", headline: "World Wars Era", detail: "Total war, revolution, and economic collapse reshape nations. The old order crumbles." } },
  { from: 1941, to: 1946, ctx: { emoji: "🌍", headline: "World War II", detail: "The deadliest war in history engulfs the planet. Colonies push for freedom as empires fight for survival." } },
  { from: 1948, to: 1949, ctx: { emoji: "☮️", headline: "Post-War Rebirth", detail: "Nations rebuild from rubble. India, Israel, and others are born. The UN is founded. A new order takes shape." } },
  { from: 1950, to: 1984, ctx: { emoji: "🚀", headline: "Space Age & Cold War", detail: "Sputnik orbits. Humans reach the Moon. Two superpowers stare each other down with nuclear arsenals." } },
  { from: 1985, to: 2009, ctx: { emoji: "💻", headline: "Digital Revolution", detail: "Personal computers, the internet, and mobile phones connect the world. Information becomes instant." } },
  { from: 2010, to: 2019, ctx: { emoji: "📱", headline: "Social & Mobile Era", detail: "Smartphones dominate. Social media reshapes politics, culture, and how humans relate to each other." } },
  { from: 2021, to: 2029, ctx: { emoji: "🤖", headline: "AI Acceleration", detail: "Machine learning leaps from labs to daily life. Every industry asks: adapt or fall behind." } },
  { from: 2031, to: 2069, ctx: { emoji: "🌐", headline: "Near Future", detail: "Climate tech, space commerce, and advanced AI reshape civilization. Humanity chooses its next chapter." } },
  { from: 2071, to: 9999, ctx: { emoji: "🔮", headline: "The Far Future", detail: "Speculative horizons — quantum cities, orbital colonies, and technologies humanity is only beginning to imagine." } },
];

const DEFAULT: YearContext = {
  emoji: "⏳",
  headline: "A Moment in Time",
  detail: "Every year holds stories waiting to be discovered. Step in and ask the locals what life is like.",
};

export function getYearContext(year: number): YearContext {
  if (EXACT[year]) return EXACT[year];

  for (const { from, to, ctx } of RANGES) {
    if (year >= from && year <= to) return ctx;
  }

  return DEFAULT;
}
