export interface YearContext {
  emoji: string;
  headline: string;
  detail: string;
}

const EXACT: Record<number, YearContext> = {
  [-3300]: { emoji: "🏺", headline: "Indus Valley Civilization", detail: "Great cities like Mohenjo-daro and Harappa thrive — advanced drainage, seals, and trade across the subcontinent." },
  [-563]: { emoji: "☸️", headline: "Birth of the Buddha", detail: "Siddhartha Gautama is born in Lumbini. A spiritual revolution begins that will reshape India and Asia." },
  [-326]: { emoji: "⚔️", headline: "Alexander at the Indus", detail: "Alexander's army reaches the Beas river. Chanakya watches empires clash — the Maurya age approaches." },
  [-268]: { emoji: "🦁", headline: "Ashoka's Empire", detail: "Emperor Ashoka rules from Pataliputra. After Kalinga, he turns to Dharma — pillars and stupas mark the land." },
  [1200]: { emoji: "🕌", headline: "Delhi Sultanate Rises", detail: "Turkic dynasties establish Muslim rule in North India. New architecture, languages, and trade routes emerge." },
  [1526]: { emoji: "👑", headline: "Mughal Empire Begins", detail: "Babur defeats Ibrahim Lodi at Panipat. The Mughal era opens — art, administration, and fusion cultures flourish." },
  [1600]: { emoji: "🏰", headline: "Taj Mahal Era", detail: "Under Shah Jahan, Mughal India reaches architectural glory. Trade with the world flows through Surat and Bengal." },
  [1757]: { emoji: "⚔️", headline: "Battle of Plassey", detail: "East India Company power grows after Plassey. The subcontinent enters the long arc of colonial rule." },
  [1857]: { emoji: "🔥", headline: "First War of Independence", detail: "Sepoys and citizens rise against the East India Company. The rebellion is crushed — but the cry for freedom never dies." },
  [1885]: { emoji: "✊", headline: "Indian National Congress", detail: "The INC is founded in Bombay. A modern political movement for Indian self-rule takes organized shape." },
  [1919]: { emoji: "🕊️", headline: "Jallianwala Bagh", detail: "Hundreds are killed in Amritsar. Gandhi's non-violent resistance gains unstoppable moral force across India." },
  [1930]: { emoji: "🧂", headline: "Salt March", detail: "Gandhi walks 240 miles to Dandi to make salt. Millions defy the British salt tax — a turning point in the freedom struggle." },
  [1940]: { emoji: "🇮🇳", headline: "Freedom Struggle & World War", detail: "World War II rages across Europe and Asia. In India, leaders face imprisonment as the nation demands freedom — Quit India is coming." },
  [1942]: { emoji: "🇮🇳", headline: "Quit India Movement", detail: "Gandhi launches 'Quit India.' Nehru, Patel, and others are jailed — yet the movement only grows stronger." },
  [1947]: { emoji: "🇮🇳", headline: "Independence at Midnight", detail: "At the stroke of midnight, August 15, India becomes free. Joy and partition's pain reshape the subcontinent forever." },
  [1950]: { emoji: "📜", headline: "Republic of India", detail: "India adopts its Constitution. Dr. Ambedkar's vision — justice, liberty, equality — becomes the law of the land." },
  [1969]: { emoji: "🌙", headline: "India's Space Dream & the Moon Race", detail: "ISRO builds toward Aryabhata while Apollo 11 grips the world — India chooses its own path among the stars." },
  [1974]: { emoji: "☢️", headline: "Peaceful Nuclear Test", detail: "India conducts Smiling Buddha at Pokhran. Science and sovereignty intersect in the Rajasthan desert." },
  [1991]: { emoji: "📈", headline: "Economic Liberalization", detail: "Manmohan Singh's reforms open India's economy. Bangalore, Mumbai, and Hyderabad begin their rise as global hubs." },
  [2008]: { emoji: "🛰️", headline: "Chandrayaan-1", detail: "India's first lunar mission discovers water on the Moon. ISRO joins the elite club of space powers." },
  [2014]: { emoji: "🚀", headline: "Mangalyaan Mars Orbit", detail: "ISRO reaches Mars on the first attempt. India proves frugal innovation can conquer the cosmos." },
  [2020]: { emoji: "🦠", headline: "COVID & Digital India", detail: "A pandemic tests the nation. UPI, Aarogya Setu, and vaccine drives show India's scale and digital backbone." },
  [2024]: { emoji: "🤖", headline: "India's AI Revolution & a Global Wave", detail: "Generative AI sweeps Bengaluru and Hyderabad while the world races for LLMs — India builds for 22 languages and its own chip ambition." },
  [2070]: { emoji: "🌃", headline: "Bharat 2070 & a Connected World", detail: "Solar megacities rise in India while lunar habitats and climate tech link the Global South to a post-carbon age." },
};

const RANGES: { from: number; to: number; ctx: YearContext }[] = [
  { from: -50000, to: -3301, ctx: { emoji: "🏔️", headline: "Ancient Bharat & Early Humanity", detail: "Tribes settle across the Himalayas, Deccan, and river valleys — while early humans spread across Asia and beyond." } },
  { from: -3300, to: -564, ctx: { emoji: "🏺", headline: "Indus Valley & the Ancient World", detail: "Harappan cities trade with Mesopotamia and Egypt while Vedic culture rises along the Ganga." } },
  { from: -563, to: 1199, ctx: { emoji: "☸️", headline: "Classical India & Asia", detail: "Mauryas, Guptas, and Cholas shape the subcontinent while Buddhism and trade link India to Central Asia and China." } },
  { from: 1200, to: 1756, ctx: { emoji: "🕌", headline: "Medieval Indian Empires", detail: "Delhi Sultanate, Vijayanagara, Mughals — Persian, Tamil, and Hindustani cultures weave a tapestry of power and poetry." } },
  { from: 1757, to: 1856, ctx: { emoji: "🏴", headline: "Company Raj", detail: "The East India Company controls trade and territory. Famines, railways, and English education transform Indian society." } },
  { from: 1858, to: 1918, ctx: { emoji: "✊", headline: "Colonial India Awakens", detail: "Crown rule replaces the Company. Reformers, poets, and early nationalists demand dignity — Tagore's pen, Tilak's voice." } },
  { from: 1919, to: 1939, ctx: { emoji: "🕊️", headline: "Gandhi's India", detail: "Non-cooperation, Salt March, and mass satyagraha. India learns civil disobedience as a weapon against empire." } },
  { from: 1941, to: 1946, ctx: { emoji: "🇮🇳", headline: "War & Freedom", detail: "Indian soldiers fight abroad while leaders are jailed at home. Independence feels inevitable — partition looms." } },
  { from: 1948, to: 1968, ctx: { emoji: "🇮🇳", headline: "Nations Reborn", detail: "India builds dams, institutes, and a democracy. Nehru's temples of modern India rise beside ancient ones." } },
  { from: 1969, to: 1984, ctx: { emoji: "🚀", headline: "Green Revolution & the Space Age", detail: "ISRO launches satellites and the Green Revolution feeds millions — India joins a world transformed by science and the Cold War." } },
  { from: 1985, to: 2000, ctx: { emoji: "💻", headline: "Liberalization & the Digital World", detail: "Bangalore's tech parks connect India to a global internet boom. Economic reform opens a new chapter at home and abroad." } },
  { from: 2001, to: 2019, ctx: { emoji: "📱", headline: "Digital India & a Connected Planet", detail: "UPI and mobile reach every village while India joins the global startup and smartphone revolution." } },
  { from: 2021, to: 2069, ctx: { emoji: "🤖", headline: "AI Bharat & the World", detail: "India scales AI for agriculture and healthcare while competing in a global race for chips, climate tech, and space." } },
  { from: 2071, to: 9999, ctx: { emoji: "🔮", headline: "Future India & Tomorrow's World", detail: "Arcology cities and lunar colonies — India shapes a future shared with a warming, interconnected planet." } },
];

const DEFAULT: YearContext = {
  emoji: "🌍",
  headline: "India & the World",
  detail: "Every year, Bharat's story runs alongside Asia and the wider world. Ask a local how India lived this moment — then explore what happened beyond.",
};

export function getYearContext(year: number): YearContext {
  if (EXACT[year]) return EXACT[year];
  for (const { from, to, ctx } of RANGES) {
    if (year >= from && year <= to) return ctx;
  }
  return DEFAULT;
}
