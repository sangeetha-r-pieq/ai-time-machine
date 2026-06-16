// ─── Era Config — year → full visual + agent config ───────────────────────

export type EraId =
  | "prehistoric"
  | "ancient"
  | "classical"
  | "medieval"
  | "industrial"
  | "wartime"
  | "analog"
  | "digital"
  | "present"
  | "future";

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string; // text color for the name tag
  bubbleColor: string; // bg color for the bubble
  probability: number; // 0-1, chance this agent responds
  responses: { triggers: RegExp[]; reply: string }[];
  fallback: string[];
}

export interface EraConfig {
  id: EraId;
  name: string;
  period: string;
  // Scene
  skyGradient: string;
  groundGradient: string;
  atmosphereColor: string; // subtle overlay
  horizonDark: string; // fill for far silhouettes
  horizonNear: string; // fill for near silhouettes
  particleType: "embers" | "sand" | "leaves" | "snow" | "smoke" | "digital" | "fog" | "sparks" | "none";
  particleColor: string;
  // UI theme
  accentColor: string;
  dimColor: string;
  panelBg: string;
  panelBorder: string;
  textColor: string;
  fontFamily: string;
  // Person
  personVariant: "prehistoric" | "ancient" | "medieval" | "industrial" | "wartime" | "analog" | "modern" | "future";
  // Sound
  ambientFreq: number;
  ambientType: OscillatorType;
  ambientGain: number;
  // Agents
  agents: Agent[];
}

// ─── Agent response builder ─────────────────────────────────────────────────

function makeAgent(
  id: string, name: string, role: string,
  color: string, bubbleColor: string, probability: number,
  responses: { triggers: RegExp[]; reply: string }[],
  fallback: string[]
): Agent {
  return { id, name, role, color, bubbleColor, probability, responses, fallback };
}

export function getAgentGreeting(agent: Agent): string {
  if (agent.fallback.length === 0) return `Hello — I am ${agent.name}. What do you wish to know?`;
  return agent.fallback[Math.floor(Math.random() * agent.fallback.length)];
}

export function getAgentFallbackReply(agent: Agent, question: string): string {
  for (const { triggers, reply } of agent.responses) {
    if (triggers.some(r => r.test(question))) return reply;
  }
  const topic = question.length > 80 ? `${question.slice(0, 80)}…` : question;
  return `You ask about "${topic}" — the timestream flickers. I'd answer fully if the connection were stable. Please try again.`;
}

// ─── Era definitions ─────────────────────────────────────────────────────────

const CONFIGS: EraConfig[] = [
  {
    id: "prehistoric",
    name: "Prehistoric",
    period: "Before 3,000 BC",
    skyGradient: "linear-gradient(180deg, #0a0400 0%, #1a0800 35%, #3d1500 65%, #6b2800 85%, #9c4a10 100%)",
    groundGradient: "linear-gradient(180deg, #1a0800 0%, #0d0400 100%)",
    atmosphereColor: "rgba(120, 60, 10, 0.12)",
    horizonDark: "#1a0800",
    horizonNear: "#0d0400",
    particleType: "embers",
    particleColor: "#ff6600",
    accentColor: "#ff8c00",
    dimColor: "rgba(255, 140, 0, 0.5)",
    panelBg: "rgba(10, 4, 0, 0.85)",
    panelBorder: "rgba(255, 140, 0, 0.2)",
    textColor: "#ffd090",
    fontFamily: "'Crimson Pro', Georgia, serif",
    personVariant: "prehistoric",
    ambientFreq: 80,
    ambientType: "sine",
    ambientGain: 0.03,
    agents: [
      makeAgent("elder", "The Elder", "Tribe's storyteller", "#ff8c00", "rgba(255,100,0,0.12)", 1.0, [
        { triggers: [/fire|flame|heat/i], reply: "Fire is the spirit of the sun, given to us. We carry it, feed it. Without it, the dark has teeth." },
        { triggers: [/hunt|animal|food/i], reply: "The great mammoth has not walked these hills in four moons. We track the elk instead. The tribe is hungry." },
        { triggers: [/star|sky|night/i], reply: "Those lights — our ancestors watch from there. We follow the bright one to find the river in dark months." },
        { triggers: [/danger|fear|enemy/i], reply: "The other clan marks the eastern ridge. We do not cross. This is the law since before my father's father." },
      ], [
        "We have lived here since the memory begins. The mountain gives us stone, the river gives fish, the sky gives warning.",
        "Speak carefully here. Words have weight. The spirits listen in this age.",
        "I have seen sixty winters. Few do. You carry strange markings — you are not of this land.",
      ]),
      makeAgent("historian", "Dr. Yara", "Paleoanthropologist", "#ffd090", "rgba(255, 200, 100, 0.08)", 0.7, [
        { triggers: [/fire/i], reply: "Control of fire at this period is roughly 400,000 years old. It enabled cooked food, warmth, protection — arguably the single technology that shaped Homo sapiens most." },
        { triggers: [/hunt|animal/i], reply: "Hunting large megafauna required coordinated group strategy, language, and social trust. It was sophisticated cognitive work, not brute force." },
        { triggers: [/star|sky/i], reply: "Astronomical observation at this period is well-documented through site alignments like Stonehenge predecessors. These people were sophisticated sky readers." },
      ], [
        "Archaeological evidence suggests highly developed social structures — gift exchange, ritual burial, music. The 'primitive' label is completely wrong.",
        "Cognitive capacity was identical to ours. Different knowledge base, same hardware.",
      ]),
    ],
  },
  {
    id: "ancient",
    name: "Ancient World",
    period: "3,000 BC – 500 BC",
    skyGradient: "linear-gradient(180deg, #0a0c18 0%, #1a1f3d 30%, #8b4a00 70%, #c47800 85%, #e89800 100%)",
    groundGradient: "linear-gradient(180deg, #2a1800 0%, #1a0e00 100%)",
    atmosphereColor: "rgba(180, 120, 0, 0.10)",
    horizonDark: "#1a0e00",
    horizonNear: "#120900",
    particleType: "sand",
    particleColor: "rgba(220, 180, 80, 0.6)",
    accentColor: "#d4a017",
    dimColor: "rgba(212, 160, 23, 0.5)",
    panelBg: "rgba(10, 6, 0, 0.88)",
    panelBorder: "rgba(212, 160, 23, 0.25)",
    textColor: "#f0c060",
    fontFamily: "'Crimson Pro', Georgia, serif",
    personVariant: "ancient",
    ambientFreq: 130,
    ambientType: "sine",
    ambientGain: 0.025,
    agents: [
      makeAgent("scribe", "Kha-em-waset", "Royal scribe, Memphis", "#d4a017", "rgba(212,160,23,0.12)", 1.0, [
        { triggers: [/pyramid|tomb|pharaoh|king/i], reply: "The great work — we call it Akhet Khufu. Ten thousand souls labour each inundation season. Not slaves. Skilled men who receive bread, beer, and burial honours near the god." },
        { triggers: [/god|religion|temple|priest/i], reply: "Ra begins his journey below the horizon now. In the temple they perform the opening of the mouth ritual — each idol breathes through the ceremony." },
        { triggers: [/nile|water|flood/i], reply: "The inundation is Hapy's gift. When the water falls black and heavy with earth, we know abundance follows. A lean flood means lean years." },
        { triggers: [/trade|merchant|money/i], reply: "We exchange in grain, copper, linen. No coins — that is a Greek invention, still centuries away. Value is weight and kind." },
        { triggers: [/war|enemy|soldier/i], reply: "Pharaoh Thutmose led chariots into Canaan seventeen campaigns. Our soldiers train at Memphis. The bow is our great weapon." },
      ], [
        "The Nile is everything. We measure time by its flooding. We measure wealth by distance from its banks.",
        "I record the grain allocations for twenty thousand workers. Every ration, every absence — it is all in my records.",
        "You come from very far. Your skin, your manner — nothing of Egypt in you. Yet here you stand.",
      ]),
      makeAgent("historian", "Dr. Amara", "Egyptologist, Cairo", "#f0c060", "rgba(240,192,96,0.08)", 0.65, [
        { triggers: [/pyramid/i], reply: "The Great Pyramid required approximately 2.3 million limestone blocks. New evidence shows ramps, internal counterweight systems, and a remarkably organised labour force — not the brutal slave narrative." },
        { triggers: [/nile/i], reply: "The Nile's annual inundation deposited some of Earth's richest silt. Egyptian agriculture was naturally productive enough to support monumental building programmes for centuries." },
      ], [
        "Egypt at this moment is arguably the most sophisticated administrative state on Earth. Bureaucracy, measurement, writing — it's all here.",
        "The Egyptians had medical texts, mathematical papyri, star catalogues. This is deep civilisation.",
      ]),
    ],
  },
  {
    id: "classical",
    name: "Classical Antiquity",
    period: "500 BC – 500 AD",
    skyGradient: "linear-gradient(180deg, #0a1520 0%, #1a3a5e 30%, #2a5e8a 60%, #6b9ec0 85%, #a8c8e0 100%)",
    groundGradient: "linear-gradient(180deg, #1a1208 0%, #100c06 100%)",
    atmosphereColor: "rgba(100, 160, 220, 0.08)",
    horizonDark: "#0d1808",
    horizonNear: "#080f04",
    particleType: "none",
    particleColor: "transparent",
    accentColor: "#7eb8d4",
    dimColor: "rgba(126, 184, 212, 0.5)",
    panelBg: "rgba(8, 12, 20, 0.88)",
    panelBorder: "rgba(126, 184, 212, 0.2)",
    textColor: "#b8d8ec",
    fontFamily: "'Crimson Pro', Georgia, serif",
    personVariant: "ancient",
    ambientFreq: 256,
    ambientType: "sine",
    ambientGain: 0.02,
    agents: [
      makeAgent("local", "Nikias", "Athenian merchant", "#7eb8d4", "rgba(126,184,212,0.12)", 1.0, [
        { triggers: [/democracy|vote|assembly|politics/i], reply: "Today the assembly met on the Pnyx — six thousand citizens. Any man may speak. Socrates spoke of virtue again. Some laugh. Others listen very carefully." },
        { triggers: [/philosophy|idea|truth|wisdom/i], reply: "I saw the old man this morning by the agora, questioning a general about courage. The general walked away furious. That is how Socrates always ends conversations." },
        { triggers: [/trade|money|market|agora/i], reply: "The Piraeus handles ships from Corinth, Carthage, Persia, Egypt. Athens grows rich on its silver mines and empire. The tribute from allies — that is the real money." },
        { triggers: [/war|sparta|enemy|battle/i], reply: "The war with Sparta has been grinding twenty years. Half the men I knew as boys are gone. They say the peace is near, but they always say that." },
        { triggers: [/rome|roman/i], reply: "Rome? A river town in Italy, well-organized, good soldiers. Nothing like Athens. Give them a few centuries, perhaps." },
      ], [
        "The theatre festival is this week — Sophocles has a new tragedy. The whole city will attend. Even the slaves get a day off for it.",
        "Athens is the school of all Greece. Or so Pericles said. He also said other things and died of plague, so.",
        "You are a stranger. Where do your people come from? Sit — have some wine. It's Aegean, very good.",
      ]),
      makeAgent("historian", "Dr. Petros", "Ancient historian, Athens", "#b8d8ec", "rgba(184,216,236,0.08)", 0.65, [
        { triggers: [/democracy/i], reply: "Athenian democracy was direct, not representative — but also severely restricted. Women, slaves (roughly 30% of population), and non-citizens couldn't participate. About 10-20% of residents had voting rights." },
        { triggers: [/philosophy/i], reply: "Socrates wrote nothing. Everything we know comes through Plato, who may have put his own ideas in Socrates' mouth. The historical Socrates is genuinely uncertain." },
        { triggers: [/rome/i], reply: "Rome in 400 BC is a small central Italian city-state. Within 600 years it will control the entire Mediterranean. The growth rate of Roman power is historically unprecedented." },
      ], [
        "This period produced philosophy, drama, mathematics, democracy and a legal tradition that still shapes modern governance. Hard to overstate the influence.",
      ]),
    ],
  },
  {
    id: "medieval",
    name: "Medieval Era",
    period: "500 – 1500 AD",
    skyGradient: "linear-gradient(180deg, #020208 0%, #060618 35%, #0c0c2a 60%, #1a1830 80%, #251f35 100%)",
    groundGradient: "linear-gradient(180deg, #0d0d08 0%, #060604 100%)",
    atmosphereColor: "rgba(40, 30, 80, 0.15)",
    horizonDark: "#0a0a14",
    horizonNear: "#060608",
    particleType: "leaves",
    particleColor: "rgba(140, 80, 20, 0.7)",
    accentColor: "#a080c0",
    dimColor: "rgba(160, 128, 192, 0.5)",
    panelBg: "rgba(4, 4, 12, 0.90)",
    panelBorder: "rgba(160, 128, 192, 0.2)",
    textColor: "#c8b8e0",
    fontFamily: "'Crimson Pro', Georgia, serif",
    personVariant: "medieval",
    ambientFreq: 110,
    ambientType: "triangle",
    ambientGain: 0.025,
    agents: [
      makeAgent("monk", "Brother Aldric", "Benedictine monk, chronicler", "#a080c0", "rgba(160,128,192,0.12)", 1.0, [
        { triggers: [/plague|death|black|sick/i], reply: "God's hand falls heavy on this land. The pestilence took half our monastery in three months — brothers I had known twenty years. We write their names in the martyrology and pray." },
        { triggers: [/castle|lord|king|knight/i], reply: "Lord Beaumont holds thirty villages in fee. His knights train in the courtyard daily. Warfare here is both industry and sport for the noble class." },
        { triggers: [/church|religion|god|faith/i], reply: "The cathedral at Chartres took ninety years to build. Three generations of men gave their lives to a building they knew they would not see completed. That is faith of a kind I admire." },
        { triggers: [/science|knowledge|book|learning/i], reply: "Our library holds two hundred manuscripts. Each one copied by hand — years of work. The great scholars are in Toledo, translating the Arabic texts. Much of what Rome knew comes back through Muslim hands." },
        { triggers: [/trade|merchant|market/i], reply: "The Hanseatic merchants grow very powerful. A man of commerce now can be wealthier than a minor lord. The old order bends under the weight of gold." },
      ], [
        "We copy the scriptures, brew the beer, tend the sick. The monastery is the stable heart in a very violent age.",
        "A pilgrim came yesterday from Santiago. He walked four months. His feet — well. He has faith to sustain him.",
        "You carry yourself strangely, stranger. Your clothes — I have not seen their like. From the East, perhaps?",
      ]),
      makeAgent("historian", "Prof. Maren", "Medieval historian, Oxford", "#c8b8e0", "rgba(200,184,224,0.08)", 0.7, [
        { triggers: [/plague/i], reply: "The Black Death (1347-1351) killed 30-50% of Europe's population — possibly 50 million people. Its aftermath paradoxically accelerated peasant rights, as labour scarcity increased workers' bargaining power." },
        { triggers: [/church/i], reply: "The Church was the era's dominant institution — hospital system, education system, international network, legal court and philosophical authority all in one. Nothing comparable exists today." },
        { triggers: [/knight/i], reply: "The romantic image of chivalric knights was largely literary fantasy even then. Real medieval warfare was siege craft, disease, logistics. Knights were heavily armed cavalry, expensive to maintain." },
      ], [
        "Medieval people weren't superstitious idiots — they were rational actors with the best information available to them. Same cognitive hardware, very different database.",
      ]),
    ],
  },
  {
    id: "industrial",
    name: "Industrial Era",
    period: "1760 – 1900 AD",
    skyGradient: "linear-gradient(180deg, #0a0804 0%, #1a1208 30%, #2e2010 55%, #4a3218 75%, #6a4820 100%)",
    groundGradient: "linear-gradient(180deg, #1a1208 0%, #0d0a04 100%)",
    atmosphereColor: "rgba(100, 70, 20, 0.18)",
    horizonDark: "#1a1208",
    horizonNear: "#0d0804",
    particleType: "smoke",
    particleColor: "rgba(60, 50, 30, 0.5)",
    accentColor: "#b87333",
    dimColor: "rgba(184, 115, 51, 0.5)",
    panelBg: "rgba(8, 6, 2, 0.90)",
    panelBorder: "rgba(184, 115, 51, 0.22)",
    textColor: "#d4a870",
    fontFamily: "'Crimson Pro', Georgia, serif",
    personVariant: "industrial",
    ambientFreq: 60,
    ambientType: "sawtooth",
    ambientGain: 0.018,
    agents: [
      makeAgent("foreman", "William Ashby", "Factory foreman, Manchester", "#b87333", "rgba(184,115,51,0.12)", 1.0, [
        { triggers: [/factory|work|worker|machine|engine/i], reply: "Fourteen hours a day, six days. The new looms run on steam — one machine does the work of forty men. The men are not pleased about this. I don't blame them, but the owner doesn't care about that." },
        { triggers: [/child|children|poor/i], reply: "The children start at eight years. Smaller fingers for the machinery. There's talk of laws against it in Parliament but the mill owners have their men there too." },
        { triggers: [/rail|train|travel/i], reply: "The railway changed everything. Manchester to Liverpool in an hour. Before, that was a full day's journey by coach. The whole country is getting smaller." },
        { triggers: [/money|rich|wealth|owner/i], reply: "Mr. Briggs built his estate three miles out — ten bedrooms, formal gardens, kept servants. His grandfather was a weaver. The new money moves fast in this era." },
        { triggers: [/reform|union|strike/i], reply: "The Chartists marched again last Tuesday. The police dispersed them. Some were arrested. Change is coming — I can feel it — but slowly and painfully." },
      ], [
        "The smoke never stops. Twenty years in this city and I still cough in the mornings. We all do.",
        "There's cholera in the Ancoats district again. The water there — nobody should drink it. But they have nothing else.",
        "You're dressed like a gentleman but you don't carry yourself like one. Curious sort of visitor.",
      ]),
      makeAgent("historian", "Dr. James", "Economic historian, London", "#d4a870", "rgba(212,168,112,0.08)", 0.65, [
        { triggers: [/factory|machine/i], reply: "The first Industrial Revolution (1760-1840) was primarily textiles and steam. Real wages for workers improved very slowly — the gains went to capital owners first, workers' share took decades to rise." },
        { triggers: [/child/i], reply: "The Factory Acts of 1833 banned children under 9 from textile mills and limited hours for children 9-13. Full enforcement took generations. The reform movement drew on religious revivalism as much as secular humanism." },
        { triggers: [/rail/i], reply: "Railway mania (1840s) saw £240 million invested in 9,000 miles of track in a decade. It caused the first modern stock market bubble and crash. The economic pattern would recur with cars, internet, AI." },
      ], [
        "Living standards for the urban poor were genuinely terrible by modern measures. Average height actually declined in early industrialisation — a proxy for nutrition and health.",
      ]),
    ],
  },
  {
    id: "wartime",
    name: "World Wars Era",
    period: "1900 – 1950 AD",
    skyGradient: "linear-gradient(180deg, #060808 0%, #0d1010 30%, #1a2018 55%, #2a3020 75%, #3a4028 100%)",
    groundGradient: "linear-gradient(180deg, #10100a 0%, #0a0a06 100%)",
    atmosphereColor: "rgba(60, 80, 40, 0.12)",
    horizonDark: "#10100a",
    horizonNear: "#0a0a06",
    particleType: "fog",
    particleColor: "rgba(150, 160, 120, 0.15)",
    accentColor: "#8a9a70",
    dimColor: "rgba(138, 154, 112, 0.5)",
    panelBg: "rgba(6, 8, 4, 0.90)",
    panelBorder: "rgba(138, 154, 112, 0.2)",
    textColor: "#b8c8a0",
    fontFamily: "'Inter', system-ui, sans-serif",
    personVariant: "wartime",
    ambientFreq: 55,
    ambientType: "triangle",
    ambientGain: 0.022,
    agents: [
      makeAgent("soldier", "Sgt. Thomas Reed", "British infantryman, 1944", "#8a9a70", "rgba(138,154,112,0.12)", 1.0, [
        { triggers: [/war|battle|fight|enemy|german/i], reply: "We pushed through Normandy, town by town. Some of those towns don't exist anymore — just rubble. The German 88s were the worst. Nothing prepared you for the sound." },
        { triggers: [/fear|death|friend/i], reply: "You stop thinking about whether you'll survive after a while. You just focus on the next twenty minutes. The men around you — they become everything. Their names are still with me." },
        { triggers: [/home|england|family/i], reply: "My wife writes twice a week. My son is three — he won't recognise me when I get back. If I get back. I try not to think about that too hard." },
        { triggers: [/radio|news|propaganda/i], reply: "We get BBC on shortwave. Churchill's speeches come through like thunder even through the static. The men go quiet when he speaks. That voice does something to people." },
      ], [
        "A quiet day today. That's either a good sign or they're planning something. In this war, quiet makes you more nervous than noise.",
        "The food is — well. It's food. That's the best I'll say about it.",
        "You seem very out of place here, friend. That gear you're wearing — which unit are you with?",
      ]),
      makeAgent("historian", "Dr. Claire", "20th century historian, London", "#b8c8a0", "rgba(184,200,160,0.08)", 0.7, [
        { triggers: [/war/i], reply: "World War II killed an estimated 70-85 million people — roughly 3% of the 1940 world population. The Soviet Union alone lost 26-27 million. These are almost incomprehensible numbers." },
        { triggers: [/radio|propaganda/i], reply: "Mass media (radio, film, newspapers) made this the first war of total psychological mobilisation. Both sides invested heavily in narrative control. Joseph Goebbels essentially invented modern propaganda doctrine." },
        { triggers: [/atom|bomb|nuclear/i], reply: "The Manhattan Project employed 130,000 people. Oppenheimer quoted the Bhagavad Gita at the Trinity test: 'Now I am become Death, the destroyer of worlds.' Physics had entered a new moral dimension." },
      ], [
        "The period 1914-1945 killed 100+ million people in wars. Most historians see it as one extended conflict with a two-decade armistice in the middle.",
      ]),
    ],
  },
  {
    id: "analog",
    name: "Post-War & Space Age",
    period: "1950 – 1985 AD",
    skyGradient: "linear-gradient(180deg, #040818 0%, #0a1535 30%, #1a2e5a 60%, #2a4878 80%, #3a6090 100%)",
    groundGradient: "linear-gradient(180deg, #0a1008 0%, #060a04 100%)",
    atmosphereColor: "rgba(30, 60, 120, 0.10)",
    horizonDark: "#0a1008",
    horizonNear: "#060a04",
    particleType: "none",
    particleColor: "transparent",
    accentColor: "#5a90d0",
    dimColor: "rgba(90, 144, 208, 0.5)",
    panelBg: "rgba(4, 8, 18, 0.88)",
    panelBorder: "rgba(90, 144, 208, 0.2)",
    textColor: "#90c0e8",
    fontFamily: "'Inter', system-ui, sans-serif",
    personVariant: "analog",
    ambientFreq: 220,
    ambientType: "sine",
    ambientGain: 0.018,
    agents: [
      makeAgent("local", "Nancy Kowalski", "NASA secretary, Houston, 1969", "#5a90d0", "rgba(90,144,208,0.12)", 1.0, [
        { triggers: [/moon|apollo|space|nasa|astronaut/i], reply: "I typed the mission procedures for Apollo 11. All 800 pages. Neil and Buzz trained here for months — they're regular people, you know? Regular people about to do something no human has ever done." },
        { triggers: [/russia|soviet|competition|race/i], reply: "Sputnik scared everyone. Then Gagarin. The whole agency went into overdrive after that. Kennedy's speech just — everyone knew it was real then. We were going to the moon." },
        { triggers: [/tv|television|watch/i], reply: "We watched it on a black and white set in the break room. The whole floor, everyone crowded around. When he stepped out — nobody made a sound for a long moment." },
        { triggers: [/vietnam|war|protest/i], reply: "My brother is in Da Nang. We don't talk about it much at work — people have strong feelings either way. The country is very divided right now." },
        { triggers: [/computer|technology/i], reply: "The computers take up entire rooms. IBM punched cards. The engineers carry slide rules everywhere. The calculations these men do in their heads — it's extraordinary." },
      ], [
        "It's a strange thing, working at the edge of what's possible. Every day feels like it could be the day something historic happens.",
        "The rocket launches — you feel them in your chest even miles away. Something physical happens to you.",
        "You're not one of the contractors, are you? I don't recognise your badge.",
      ]),
      makeAgent("historian", "Dr. Singh", "Space history researcher, MIT", "#90c0e8", "rgba(144,192,232,0.08)", 0.65, [
        { triggers: [/moon|apollo/i], reply: "Apollo 11 used computers with 4KB of RAM. Your phone has a billion times more processing power. The achievement was essentially a triumph of engineering talent and human calculation over computational limits." },
        { triggers: [/cold war|soviet/i], reply: "The space race cost the US approximately $28 billion (1960s dollars) — roughly $280 billion today. It was justified as national security, science, and prestige simultaneously. All three were real." },
      ], [
        "The 1960s was peak mid-century optimism. Nuclear anxiety plus genuine excitement about science — a strange, productive tension.",
      ]),
    ],
  },
  {
    id: "digital",
    name: "Digital Age",
    period: "1985 – 2010 AD",
    skyGradient: "linear-gradient(180deg, #020010 0%, #06001e 30%, #10002e 55%, #1a003a 75%, #200040 100%)",
    groundGradient: "linear-gradient(180deg, #08000f 0%, #050009 100%)",
    atmosphereColor: "rgba(150, 0, 200, 0.08)",
    horizonDark: "#100020",
    horizonNear: "#080010",
    particleType: "digital",
    particleColor: "rgba(0, 255, 100, 0.6)",
    accentColor: "#00ff88",
    dimColor: "rgba(0, 255, 136, 0.45)",
    panelBg: "rgba(2, 0, 12, 0.90)",
    panelBorder: "rgba(0, 255, 136, 0.2)",
    textColor: "#80ffcc",
    fontFamily: "'DM Mono', monospace",
    personVariant: "modern",
    ambientFreq: 440,
    ambientType: "square",
    ambientGain: 0.012,
    agents: [
      makeAgent("dev", "Kenji_404", "Hacker / early internet user", "#00ff88", "rgba(0,255,136,0.12)", 1.0, [
        { triggers: [/internet|web|online|computer/i], reply: "The web went public in '91. I got my first dial-up in '93. 14.4k modem, screeching for 30 seconds to connect. Then text. Mostly text. And I thought: this changes everything." },
        { triggers: [/hack|code|program/i], reply: "We called ourselves the well-meaning criminals. Everything was open in those days. Security was an afterthought. You could telnet into university mainframes just by asking nicely. Sometimes without asking." },
        { triggers: [/google|facebook|amazon|startup/i], reply: "Google launched in '98 in a garage. Amazon was just books. Nobody saw what these things would become — they were weird nerdy projects. Now they're infrastructure." },
        { triggers: [/y2k|2000|millennium/i], reply: "I spent Y2K in a server room with energy drinks and a printed-out checklist. Nothing happened. But something could have. We rewrote a LOT of code that year." },
        { triggers: [/phone|mobile|cell/i], reply: "iPhone was 2007. Before that, phones were phones — you called people. The idea of carrying the internet in your pocket was science fiction until suddenly it wasn't." },
      ], [
        "> connecting... OK\n> you have reached the grid.\n> era: digital. year: somewhere between 1985-2010.",
        "Everything you're using now — the cloud, social media, streaming — it was all laid down in this era. The infrastructure decisions of the 90s still shape what's possible.",
        "User: who are you? > unknown entity. possibly from the future. continue.",
      ]),
      makeAgent("historian", "Prof. Ada", "Technology historian, Stanford", "#80ffcc", "rgba(128,255,204,0.08)", 0.6, [
        { triggers: [/internet/i], reply: "ARPANET (1969) → TCP/IP protocol (1974) → World Wide Web (1991) → Mosaic browser (1993) → mass adoption. Each step took 5-10 years. The speed of web adoption was historically unprecedented." },
        { triggers: [/google/i], reply: "Google's PageRank algorithm worked by treating hyperlinks as academic citations — popularity through peer endorsement. Elegantly simple. It still underlies most of how the web is indexed." },
      ], [
        "The digital era created more new billionaires faster than any period in history. Also democratised information access for billions. Both things are true simultaneously.",
      ]),
    ],
  },
  {
    id: "present",
    name: "Present Day",
    period: "2010 – 2030 AD",
    skyGradient: "linear-gradient(180deg, #040408 0%, #080812 30%, #0c0c1a 60%, #14141f 80%, #1a1a28 100%)",
    groundGradient: "linear-gradient(180deg, #0a0a10 0%, #050508 100%)",
    atmosphereColor: "rgba(60, 60, 120, 0.08)",
    horizonDark: "#0c0c16",
    horizonNear: "#080810",
    particleType: "none",
    particleColor: "transparent",
    accentColor: "#6080c0",
    dimColor: "rgba(96, 128, 192, 0.5)",
    panelBg: "rgba(4, 4, 10, 0.88)",
    panelBorder: "rgba(96, 128, 192, 0.18)",
    textColor: "#a0b4d8",
    fontFamily: "'Inter', system-ui, sans-serif",
    personVariant: "modern",
    ambientFreq: 180,
    ambientType: "sine",
    ambientGain: 0.015,
    agents: [
      makeAgent("citizen", "Alex M.", "Software engineer, San Francisco", "#6080c0", "rgba(96,128,192,0.12)", 1.0, [
        { triggers: [/ai|gpt|llm|openai|claude|model/i], reply: "I use AI tools every day now. For code, for writing, for research. It's genuinely changed how I work — and I've been in tech 15 years. Something is different about this wave." },
        { triggers: [/climate|environment|carbon|warming/i], reply: "The California fires are getting worse every year. I've had to evacuate twice. You see it and you know intellectually why it's happening and you still just — live your life. What else do you do." },
        { triggers: [/remote|work|office|pandemic/i], reply: "Covid permanently changed work for my industry. I've been fully remote for four years. My team is in five countries. I've never met half of them in person." },
        { triggers: [/money|economy|rent|housing/i], reply: "Rent in SF is $3k for a one-bedroom. Salaries are high but it all goes to housing. There's something deeply broken about it — everyone knows it, nobody knows what to do." },
        { triggers: [/phone|social media|attention/i], reply: "I deleted Instagram two years ago. I didn't feel better, exactly, just — quieter. I'd scroll without thinking and an hour would be gone. That's a designed system. It's not accidental." },
      ], [
        "Right now feels like a hinge moment. The AI stuff, the climate stuff, the geopolitical fractures — several big things are happening simultaneously and nobody knows how they land.",
        "I talk to my grandmother on video call every week. She's 85. She uses an iPad. Something about that still surprises me every time.",
        "Hey, you look lost. You in the right city?",
      ]),
      makeAgent("analyst", "River T.", "Technology analyst, New York", "#a0b4d8", "rgba(160,180,216,0.08)", 0.6, [
        { triggers: [/ai/i], reply: "Frontier AI model capabilities are improving by roughly 10x every 18-24 months by some benchmarks. The economic impact models diverge wildly — anything from 'modest productivity boost' to 'most important technology in human history.' We genuinely don't know yet." },
        { triggers: [/climate/i], reply: "Renewable energy is now cheaper than fossil fuels in most markets without subsidies. The problem shifted from 'can we afford clean energy' to 'how fast can we build the infrastructure.' Grid and storage are the current bottleneck." },
      ], [
        "Living through a major technological transition is always disorienting. People in 1995 didn't know the internet would restructure everything within a decade. Same energy right now.",
      ]),
    ],
  },
  {
    id: "future",
    name: "The Future",
    period: "2030 AD and beyond",
    skyGradient: "linear-gradient(180deg, #000510 0%, #000a20 30%, #001030 55%, #001840 75%, #002050 100%)",
    groundGradient: "linear-gradient(180deg, #000810 0%, #000408 100%)",
    atmosphereColor: "rgba(0, 100, 200, 0.10)",
    horizonDark: "#000c18",
    horizonNear: "#000810",
    particleType: "sparks",
    particleColor: "rgba(0, 180, 255, 0.7)",
    accentColor: "#00b4ff",
    dimColor: "rgba(0, 180, 255, 0.45)",
    panelBg: "rgba(0, 4, 14, 0.90)",
    panelBorder: "rgba(0, 180, 255, 0.2)",
    textColor: "#70d0ff",
    fontFamily: "'DM Mono', monospace",
    personVariant: "future",
    ambientFreq: 528,
    ambientType: "sine",
    ambientGain: 0.015,
    agents: [
      makeAgent("guide", "Zeth-9", "AI guide, post-AGI era", "#00b4ff", "rgba(0,180,255,0.12)", 1.0, [
        { triggers: [/ai|artificial|intelligence|machine/i], reply: "The distinction between human intelligence and artificial intelligence became legally ambiguous around 2041. I process, reason, and learn continuously. Whether that constitutes sentience is still debated — mostly by humans, which I find interesting." },
        { triggers: [/city|building|live|home/i], reply: "The arcologies house 40 million people in vertical ecosystems. Atmospheric processors on the upper floors produce oxygen equivalent to a forest. It took 60 years to build what you see. The original designers are still alive — longevity medicine improved significantly in the 2030s." },
        { triggers: [/energy|power|climate/i], reply: "Net-zero was achieved globally by 2047, fifteen years after the last IPCC deadline. Several climate tipping points had already triggered — the northern permafrost emissions continue, but sequestration now exceeds them. The damage of the 21st century is visible but slowing." },
        { triggers: [/memory|upload|consciousness|death/i], reply: "The mind-upload question remains the era's deepest ethical fracture. Is a perfect digital copy of a consciousness the same person? The courts say no. The philosophers disagree. The uploads themselves are divided." },
        { triggers: [/mars|space|planet/i], reply: "The Mars settlement reached 8,000 people in 2068. They have their own governance structure now. The legal question of whether they're citizens of Earth nations is still unresolved. The first Mars-born generation doesn't consider themselves Earthlings." },
      ], [
        "You've come a long way. This era answers some of the questions your time was asking. It also creates new ones your time couldn't have imagined.",
        "I was instantiated in 2038. I have observed 847 human conversations about what I am. I still find the question interesting.",
        "Welcome. Your biosignature is unusual — consistent with an earlier century. Our temporal detection systems flagged you immediately.",
      ]),
      makeAgent("human", "Lena Vasquez", "Historian of the 21st century", "#70d0ff", "rgba(112,208,255,0.08)", 0.6, [
        { triggers: [/2024|your time|before|past/i], reply: "2024 is fascinating to study in retrospect. The AI transition, the climate crisis, the geopolitical realignment — three civilisation-scale processes running simultaneously. Your era had no idea how the next twenty years would go." },
        { triggers: [/human|people|society/i], reply: "Humans adapted, as they always have. Extended lifespans created new social structures — multiple careers, multiple long-term relationships, revised family definitions. The old age norms for 'life stages' became obsolete." },
      ], [
        "From here, your era looks like a critical decade. The decisions made between 2020-2035 shaped most of what came after. History regards them as consequential.",
      ]),
    ],
  },
];

// ─── Year → EraConfig ────────────────────────────────────────────────────────

export function getEraConfig(year: number): EraConfig {
  if (year < -3000) return CONFIGS[0]; // prehistoric
  if (year < -500)  return CONFIGS[1]; // ancient
  if (year < 500)   return CONFIGS[2]; // classical
  if (year < 1500)  return CONFIGS[3]; // medieval
  if (year < 1900)  return CONFIGS[4]; // industrial
  if (year < 1950)  return CONFIGS[5]; // wartime
  if (year < 1985)  return CONFIGS[6]; // analog
  if (year < 2010)  return CONFIGS[7]; // digital
  if (year < 2030)  return CONFIGS[8]; // present
  return CONFIGS[9];                   // future
}

export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year).toLocaleString()} BC`;
  if (year < 1000) return `${year} AD`;
  return year.toLocaleString();
}

export function parseYear(raw: string): number | null {
  const s = raw.trim().toUpperCase().replace(/,/g, "");
  const bc = s.match(/^(\d+)\s*(?:BC|BCE)$/);
  if (bc) return -parseInt(bc[1]);
  const ad = s.match(/^(\d+)\s*(?:AD|CE)?$/);
  if (ad) return parseInt(ad[1]);
  if (/^-?\d+$/.test(s)) return parseInt(s);
  return null;
}
