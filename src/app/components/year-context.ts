export interface YearContext {
  emoji: string;
  headline: string;
  detail: string;
}

const EXACT: Record<number, YearContext> = {
  [-3300]: { emoji: "🏺", headline: "Early Civilizations", detail: "Egypt's Old Kingdom rises while Mesopotamia builds the first cities — writing and empire begin." },
  [-563]: { emoji: "☸️", headline: "Age of Philosophy", detail: "The Buddha teaches in India as Confucius and early Greek thinkers reshape ethics across Asia and Europe." },
  [-326]: { emoji: "⚔️", headline: "Alexander's Conquests", detail: "Alexander crosses into Asia. Greek, Persian, and Indian worlds collide along the Indus." },
  [-268]: { emoji: "🦁", headline: "Ashoka's Empire", detail: "Emperor Ashoka rules a vast Indian empire after Kalinga — while Rome is still a republic." },
  [1200]: { emoji: "🕌", headline: "Medieval World", detail: "Crusades rage in the Levant, Gothic cathedrals rise in Europe, and Delhi's sultanates grow in power." },
  [1526]: { emoji: "👑", headline: "Mughal Empire Begins", detail: "Babur wins at Panipat as Renaissance art flourishes in Europe and global trade expands." },
  [1600]: { emoji: "🏰", headline: "Age of Empires", detail: "Shakespeare writes, the Tokugawa shogunate begins in Japan, and colonial trade reshapes the globe." },
  [1757]: { emoji: "⚔️", headline: "Battle of Plassey", detail: "British power grows in India as the Seven Years' War redraws empires across Europe and America." },
  [1857]: { emoji: "🔥", headline: "Year of Revolt", detail: "The Indian Rebellion challenges British rule while industrial cities choke on coal smoke." },
  [1885]: { emoji: "✊", headline: "Reform & Resistance", detail: "The Indian National Congress forms as labour movements and colonial reform clash worldwide." },
  [1919]: { emoji: "🕊️", headline: "After the Great War", detail: "WWI ends in armistice. Jallianwala Bagh shocks India; Versailles redraws Europe." },
  [1930]: { emoji: "🧂", headline: "Salt March", detail: "Gandhi defies the salt tax as the Great Depression grips economies from Berlin to Bombay." },
  [1940]: { emoji: "🌍", headline: "World at War", detail: "WWII engulfs Europe and Asia. India demands freedom while London fights for survival." },
  [1942]: { emoji: "🇮🇳", headline: "Quit India", detail: "Gandhi launches Quit India as Allied and Axis powers battle across continents." },
  [1947]: { emoji: "🇮🇳", headline: "Independence & Partition", detail: "India and Pakistan are born at midnight — joy and tragedy reshape the subcontinent." },
  [1950]: { emoji: "📜", headline: "New Republics", detail: "India adopts its Constitution as the Cold War divides the world into rival blocs." },
  [1969]: { emoji: "🌙", headline: "One Giant Leap", detail: "Apollo 11 lands on the Moon while the world watches on television — science becomes spectacle." },
  [1974]: { emoji: "☢️", headline: "Nuclear Age", detail: "India tests a peaceful nuclear device as détente and oil shocks reshape global politics." },
  [1991]: { emoji: "📈", headline: "World Goes Online", detail: "The web opens to the public, the Soviet Union collapses, and India begins economic liberalization." },
  [2008]: { emoji: "📱", headline: "Smartphone Era", detail: "The iPhone and financial crisis arrive together — connectivity and uncertainty define the decade." },
  [2014]: { emoji: "🚀", headline: "New Space Race", detail: "Private rockets rise, Mars missions multiply, and social media reshapes politics worldwide." },
  [2020]: { emoji: "🦠", headline: "Pandemic Year", detail: "COVID-19 halts the planet. Remote work, vaccines, and digital life accelerate overnight." },
  [2024]: { emoji: "🤖", headline: "AI Everywhere", detail: "Generative AI spreads through work and culture as climate, war, and elections unsettle the globe." },
  [2070]: { emoji: "🌃", headline: "Transformed Planet", detail: "Climate tech, longevity medicine, and off-world settlement redefine what 'civilization' means." },
};

const RANGES: { from: number; to: number; ctx: YearContext }[] = [
  { from: -50000, to: -3301, ctx: { emoji: "🏔️", headline: "Ice Age World", detail: "Homo sapiens spreads across continents — hunting, painting caves, and adapting to a changing climate." } },
  { from: -3300, to: -564, ctx: { emoji: "🏺", headline: "First Empires", detail: "River civilizations from Egypt to the Indus build writing, law, and monumental architecture." } },
  { from: -563, to: 1199, ctx: { emoji: "☸️", headline: "Classical Age", detail: "Greece, Rome, Persia, India, and China develop philosophy, empire, and long-distance trade." } },
  { from: 1200, to: 1756, ctx: { emoji: "🕌", headline: "Medieval World", detail: "Cathedrals, khans, and caliphates — faith, plague, and commerce link Europe, Asia, and Africa." } },
  { from: 1757, to: 1856, ctx: { emoji: "🏭", headline: "Revolutions Begin", detail: "Industrial machines, American independence, and colonial expansion rewrite power across the globe." } },
  { from: 1857, to: 1918, ctx: { emoji: "✊", headline: "Age of Reform", detail: "Empires strain under nationalism, science, and the first total wars of the modern era." } },
  { from: 1919, to: 1939, ctx: { emoji: "🕊️", headline: "Between the Wars", detail: "Depression, fascism, and independence movements collide in a fragile interwar peace." } },
  { from: 1940, to: 1946, ctx: { emoji: "🌍", headline: "Total War", detail: "WWII kills tens of millions and ends with atomic weapons — the old world order is gone." } },
  { from: 1947, to: 1968, ctx: { emoji: "🚀", headline: "Postwar Boom", detail: "Rebuilding, decolonization, civil rights, and the space race define a hopeful, anxious age." } },
  { from: 1969, to: 1984, ctx: { emoji: "📺", headline: "Television Age", detail: "Moon landings, oil shocks, and Cold War proxy wars play out in living rooms worldwide." } },
  { from: 1985, to: 2000, ctx: { emoji: "💻", headline: "Digital Dawn", detail: "Personal computers, the web, and globalization connect — and stress — every economy." } },
  { from: 2001, to: 2019, ctx: { emoji: "📱", headline: "Connected World", detail: "Smartphones, social media, and emerging markets reshape how billions live and communicate." } },
  { from: 2021, to: 2069, ctx: { emoji: "🤖", headline: "Transition Era", detail: "AI, climate crisis, and geopolitical realignment make the mid-21st century a hinge in history." } },
  { from: 2071, to: 9999, ctx: { emoji: "🔮", headline: "Far Future", detail: "Humanity adapts to a warmer planet and a solar-system civilization — history keeps accelerating." } },
];

const DEFAULT: YearContext = {
  emoji: "🌍",
  headline: "A Moment in History",
  detail: "Every year sits inside a wider story — local lives, global forces, and choices that echo forward.",
};

export function getYearContext(year: number): YearContext {
  if (EXACT[year]) return EXACT[year];
  for (const { from, to, ctx } of RANGES) {
    if (year >= from && year <= to) return ctx;
  }
  return DEFAULT;
}
