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
  [1940]: { emoji: "🇮🇳", headline: "Freedom Struggle & World War", detail: "World War II rages. In India, leaders face imprisonment as the nation demands freedom — Quit India is coming." },
  [1942]: { emoji: "🇮🇳", headline: "Quit India Movement", detail: "Gandhi launches 'Quit India.' Nehru, Patel, and others are jailed — yet the movement only grows stronger." },
  [1947]: { emoji: "🇮🇳", headline: "Independence at Midnight", detail: "At the stroke of midnight, August 15, India becomes free. Joy and partition's pain reshape the subcontinent forever." },
  [1950]: { emoji: "📜", headline: "Republic of India", detail: "India adopts its Constitution. Dr. Ambedkar's vision — justice, liberty, equality — becomes the law of the land." },
  [1969]: { emoji: "🌙", headline: "ISRO & the Space Dream", detail: "While the world watches Apollo 11, India's ISRO is building its own path — Aryabhata and Vikram Sarabhai's vision take flight." },
  [1974]: { emoji: "☢️", headline: "Peaceful Nuclear Test", detail: "India conducts Smiling Buddha at Pokhran. Science and sovereignty intersect in the Rajasthan desert." },
  [1991]: { emoji: "📈", headline: "Economic Liberalization", detail: "Manmohan Singh's reforms open India's economy. Bangalore, Mumbai, and Hyderabad begin their rise as global hubs." },
  [2008]: { emoji: "🛰️", headline: "Chandrayaan-1", detail: "India's first lunar mission discovers water on the Moon. ISRO joins the elite club of space powers." },
  [2014]: { emoji: "🚀", headline: "Mangalyaan Mars Orbit", detail: "ISRO reaches Mars on the first attempt. India proves frugal innovation can conquer the cosmos." },
  [2020]: { emoji: "🦠", headline: "COVID & Digital India", detail: "A pandemic tests the nation. UPI, Aarogya Setu, and vaccine drives show India's scale and digital backbone." },
  [2024]: { emoji: "🤖", headline: "India's AI Revolution", detail: "Generative AI sweeps Bengaluru and Hyderabad. India builds LLMs, chips ambition, and deploys AI from farms to hospitals." },
  [2070]: { emoji: "🌃", headline: "Bharat 2070", detail: "Solar megacities, Hindi-English AI guides, and lunar habitats — India leads the Global South into the post-carbon age." },
};

const RANGES: { from: number; to: number; ctx: YearContext }[] = [
  { from: -50000, to: -3301, ctx: { emoji: "🏔️", headline: "Ancient Bharat", detail: "Tribes and early settlements across the Himalayas, Deccan, and river valleys — the roots of Indian civilization." } },
  { from: -3300, to: -564, ctx: { emoji: "🏺", headline: "Indus to Vedic Age", detail: "From Harappan cities to Vedic hymns along the Saraswati and Ganga — scripture, ritual, and kingdoms emerge." } },
  { from: -563, to: 1199, ctx: { emoji: "☸️", headline: "Classical India", detail: "Mauryas, Guptas, Cholas, and Buddhist universities. Nalanda, Ajanta, and the Golden Age of Indian science and art." } },
  { from: 1200, to: 1756, ctx: { emoji: "🕌", headline: "Medieval Indian Empires", detail: "Delhi Sultanate, Vijayanagara, Mughals — Persian, Tamil, and Hindustani cultures weave a tapestry of power and poetry." } },
  { from: 1757, to: 1856, ctx: { emoji: "🏴", headline: "Company Raj", detail: "The East India Company controls trade and territory. Famines, railways, and English education transform Indian society." } },
  { from: 1858, to: 1918, ctx: { emoji: "✊", headline: "Colonial India Awakens", detail: "Crown rule replaces the Company. Reformers, poets, and early nationalists demand dignity — Tagore's pen, Tilak's voice." } },
  { from: 1919, to: 1939, ctx: { emoji: "🕊️", headline: "Gandhi's India", detail: "Non-cooperation, Salt March, and mass satyagraha. India learns civil disobedience as a weapon against empire." } },
  { from: 1941, to: 1946, ctx: { emoji: "🇮🇳", headline: "War & Freedom", detail: "Indian soldiers fight abroad while leaders are jailed at home. Independence feels inevitable — partition looms." } },
  { from: 1948, to: 1968, ctx: { emoji: "🇮🇳", headline: "Nations Reborn", detail: "India builds dams, institutes, and a democracy. Nehru's temples of modern India rise beside ancient ones." } },
  { from: 1969, to: 1984, ctx: { emoji: "🚀", headline: "Green & Space Revolution", detail: "ISRO launches satellites. Green Revolution feeds millions. India balances tradition with scientific ambition." } },
  { from: 1985, to: 2000, ctx: { emoji: "💻", headline: "Liberalization Dawn", detail: "Software exports begin. Bangalore's tech parks hum. MTV India and economic reform open a new chapter." } },
  { from: 2001, to: 2019, ctx: { emoji: "📱", headline: "Digital India Rises", detail: "Mobile phones reach every village. Aadhaar, UPI, and startups transform how a billion people live and pay." } },
  { from: 2021, to: 2069, ctx: { emoji: "🤖", headline: "AI Bharat", detail: "India scales AI for 22 languages, agriculture, and healthcare. Climate tech and space commerce define the century." } },
  { from: 2071, to: 9999, ctx: { emoji: "🔮", headline: "Future Bharat", detail: "Speculative India — arcology cities, Gaganyaan colonies, and AI guides who remember every era you have visited." } },
];

const DEFAULT: YearContext = {
  emoji: "🇮🇳",
  headline: "A Year in Bharat",
  detail: "Every year on the subcontinent holds epic stories — kingdoms, movements, science, and song. Ask a local to learn more.",
};

export function getYearContext(year: number): YearContext {
  if (EXACT[year]) return EXACT[year];
  for (const { from, to, ctx } of RANGES) {
    if (year >= from && year <= to) return ctx;
  }
  return DEFAULT;
}
