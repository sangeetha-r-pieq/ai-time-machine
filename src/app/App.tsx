import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { YearPicker } from "./components/YearPicker";
import { TravelAnimation } from "./components/TravelAnimation";
import { EraScene } from "./components/EraScene";
import { AgentChat } from "./components/AgentChat";
import { getEraConfig, formatYear, type EraId } from "./components/era-config";
import { useWideLayout } from "./hooks/useWideLayout";
import { getEraBackgroundUrl } from "./components/india-content";
import { startAmbient, stopAmbient, playArrivalSound } from "./components/sounds";
import { fireStampCelebration, fireSouvenirCelebration, fireCompleteCollectionCelebration } from "./components/celebrations";
import { X, Lock, Compass } from "lucide-react";

type Phase = "picker" | "traveling" | "scene";

interface Souvenir {
  id: string;
  name: string;
  emoji: string;
  eraId: string;
  eraName: string;
  description: string;
}

const SOUVENIRS: Record<string, Souvenir> = {
  prehistoric: {
    id: "prehistoric",
    name: "Cave Painting Charcoal",
    emoji: "🎨",
    eraId: "prehistoric",
    eraName: "Prehistoric Era",
    description: "A charcoal rubbing from a 15,000-year-old hunting scene — humanity's oldest art."
  },
  ancient: {
    id: "ancient",
    name: "Papyrus Scroll Fragment",
    emoji: "📜",
    eraId: "ancient",
    eraName: "Ancient World",
    description: "A scrap of papyrus recording grain rations for pyramid workers — bureaucracy in ink."
  },
  classical: {
    id: "classical",
    name: "Athenian Obol Coin",
    emoji: "🪙",
    eraId: "classical",
    eraName: "Classical Antiquity",
    description: "A silver coin from the agora — payment for olives, wine, or a seat at the theatre."
  },
  medieval: {
    id: "medieval",
    name: "Illuminated Manuscript Page",
    emoji: "📖",
    eraId: "medieval",
    eraName: "Medieval Era",
    description: "A monk's painstaking copy of a gospel — gold leaf and devotion on vellum."
  },
  industrial: {
    id: "industrial",
    name: "Steam Engine Valve",
    emoji: "⚙️",
    eraId: "industrial",
    eraName: "Industrial Era",
    description: "A brass valve from a Manchester mill loom — the machine age in your palm."
  },
  wartime: {
    id: "wartime",
    name: "Field Ration Tin",
    emoji: "🥫",
    eraId: "wartime",
    eraName: "World Wars Era",
    description: "A dented tin from the Normandy campaign — bully beef and biscuits, 1944."
  },
  analog: {
    id: "analog",
    name: "Apollo 11 Mission Patch",
    emoji: "🚀",
    eraId: "analog",
    eraName: "Space Age",
    description: "An embroidered patch from the mission that put humans on the Moon — July 1969."
  },
  digital: {
    id: "digital",
    name: "Floppy Disk",
    emoji: "💾",
    eraId: "digital",
    eraName: "Digital Age",
    description: "A 3.5-inch disk labeled 'www v1.0' — the web fit on 1.44 megabytes once."
  },
  present: {
    id: "present",
    name: "Neural Net Keychain",
    emoji: "🤖",
    eraId: "present",
    eraName: "Present Day",
    description: "A novelty charm shaped like a transformer block — the AI era's lucky token."
  },
  future: {
    id: "future",
    name: "Mars Colony Badge",
    emoji: "🌙",
    eraId: "future",
    eraName: "The Future",
    description: "An ID badge from the first permanent Mars research habitat — humanity's second home."
  }
};

export default function App() {
  const isWide = useWideLayout();
  const [phase, setPhase] = useState<Phase>("picker");
  const [year, setYear] = useState(2024);
  const [travelFromYear, setTravelFromYear] = useState(2024);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [sceneReaction, setSceneReaction] = useState(0);
  const [souvenirReveal, setSouvenirReveal] = useState<Souvenir | null>(null);
  const ambientRunning = useRef(false);

  // Theme State
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("time-travel-theme") as "light" | "dark") || "dark";
  });

  // Gamification States
  const [stamps, setStamps] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("time-travel-stamps") || "[]");
    } catch {
      return [];
    }
  });

  const [inventory, setInventory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("time-travel-inventory") || "[]");
    } catch {
      return [];
    }
  });

  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<"passport" | "inventory">("passport");

  // Toast System
  const [toast, setToast] = useState<{ message: string; submessage?: string; icon?: string } | null>(null);

  const showNotification = (message: string, submessage?: string, icon?: string) => {
    setToast({ message, submessage, icon });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync Theme with body class and local storage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("time-travel-theme", theme);
  }, [theme]);

  const config = getEraConfig(year);

  const handleJump = (y: number) => {
    setTravelFromYear(year);
    setYear(y);
    setPhase("traveling");
  };

  const handleArrived = () => {
    setPhase("scene");
    if (!ambientRunning.current) {
      startAmbient(config.ambientFreq, config.ambientType, config.ambientGain);
      ambientRunning.current = true;
    }
    playArrivalSound(config.ambientFreq);

    // Auto stamp the passport when arriving at a new era
    if (!stamps.includes(config.id)) {
      const newStamps = [...stamps, config.id];
      setStamps(newStamps);
      localStorage.setItem("time-travel-stamps", JSON.stringify(newStamps));
      fireStampCelebration(config.id);
      showNotification("🗺️ Stamp Earned!", `The ${config.name} has been stamped in your Temporal Passport.`, "🗺️");
      if (newStamps.length === 10) {
        setTimeout(() => fireCompleteCollectionCelebration(), 600);
      }
    }
  };

  const handleReturn = () => {
    stopAmbient();
    ambientRunning.current = false;
    setPhase("picker");
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleAwardSouvenir = (eraId: string) => {
    if (inventory.includes(eraId)) return;

    const item = SOUVENIRS[eraId];
    if (!item) return;

    const newInventory = [...inventory, eraId];
    setInventory(newInventory);
    localStorage.setItem("time-travel-inventory", JSON.stringify(newInventory));

    fireSouvenirCelebration(eraId as EraId);
    setSouvenirReveal(item);
    showNotification(
      "🏆 Souvenir Unlocked!",
      `You secured the '${item.name}' artifact from the ${item.eraName}!`,
      item.emoji
    );
    if (newInventory.length === 10) {
      setTimeout(() => fireCompleteCollectionCelebration(), 800);
    }
  };

  // Update ambient when era changes while in scene
  useEffect(() => {
    if (phase === "scene") {
      startAmbient(config.ambientFreq, config.ambientType, config.ambientGain);
      ambientRunning.current = true;
    }
  }, [config.id]);

  const ERAS_LIST = [
    { id: "prehistoric", name: "Prehistoric Era", period: "Before 3,000 BC" },
    { id: "ancient", name: "Ancient World", period: "3,000 BC – 500 BC" },
    { id: "classical", name: "Classical Antiquity", period: "500 BC – 500 AD" },
    { id: "medieval", name: "Medieval Era", period: "500 – 1500 AD" },
    { id: "industrial", name: "Industrial Era", period: "1760 – 1900 AD" },
    { id: "wartime", name: "World Wars Era", period: "1900 – 1950 AD" },
    { id: "analog", name: "Post-War & Space Age", period: "1950 – 1985 AD" },
    { id: "digital", name: "Digital Age", period: "1985 – 2010 AD" },
    { id: "present", name: "Present Day", period: "2010 – 2030 AD" },
    { id: "future", name: "The Future", period: "2030 AD and beyond" }
  ];

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: "var(--background)", color: "var(--text-primary)", transition: "background 0.3s, color 0.3s" }}>
      <AnimatePresence mode="wait">
        {phase === "picker" && (
          <motion.div key="picker" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}>
            <YearPicker
              onJump={handleJump}
              theme={theme}
              onToggleTheme={toggleTheme}
              stampsCount={stamps.length}
              onOpenDashboard={() => setShowDashboard(true)}
            />
          </motion.div>
        )}

        {phase === "traveling" && (
          <TravelAnimation key="travel" year={year} fromYear={travelFromYear} onComplete={handleArrived} />
        )}

        {phase === "scene" && (
          <motion.div key="scene" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>

            <EraScene
              config={config}
              year={year}
              backgroundUrl={getEraBackgroundUrl(config.id, year)}
              isTalking={agentSpeaking}
              sceneReaction={sceneReaction}
            />

            {/* Top bar — minimal, absolute */}
            <div
              className="absolute top-0 left-0 flex items-center justify-between px-5 py-4"
              style={{
                zIndex: 20,
                right: isWide ? "min(440px, 42vw)" : 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
              }}
            >
              <div>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "18px", fontWeight: 300,
                  color: "#fff", letterSpacing: "-0.01em",
                }}>
                  {formatYear(year)}
                </div>
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: config.accentColor, marginTop: 2 }}
                >
                  {config.name.toUpperCase()} · {config.period}
                </motion.div>
              </div>

              {/* Agent names listed */}
              <div className="flex flex-col items-end gap-1">
                {config.agents.map(a => (
                  <div key={a.id} style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", color: a.color, opacity: 0.7 }}>
                    {a.name} — {a.role}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat panel overlay */}
            <AgentChat
              config={config}
              year={year}
              onReturn={handleReturn}
              onAwardSouvenir={handleAwardSouvenir}
              onAgentSpeaking={setAgentSpeaking}
              onSceneReaction={() => setSceneReaction(n => n + 1)}
              theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traveler Dashboard Modal */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            style={{ zIndex: 100 }}
            onClick={() => setShowDashboard(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl rounded-2xl flex flex-col overflow-hidden max-h-[85vh] shadow-2xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-color)",
                color: "var(--card-foreground)",
              }}
            >
              {/* Modal Header */}
              <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: "var(--border-color-subtle)" }}>
                <div>
                  <h2 className="text-xl font-light tracking-wide flex items-center gap-2">
                    <Compass className="text-purple-500" size={18} />
                    Traveler Dashboard
                  </h2>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    Tracking your journeys across the threads of time.
                  </p>
                </div>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Controls */}
              <div className="flex border-b" style={{ borderColor: "var(--border-color-subtle)" }}>
                <button
                  onClick={() => setDashboardTab("passport")}
                  className="flex-1 py-3 text-xs tracking-wider uppercase font-mono transition-colors relative"
                  style={{
                    color: dashboardTab === "passport" ? "var(--text-primary)" : "var(--text-secondary)",
                    background: dashboardTab === "passport" ? "var(--glass-bg)" : "transparent",
                  }}
                >
                  Passport Stamps ({stamps.length})
                  {dashboardTab === "passport" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500" />
                  )}
                </button>
                <button
                  onClick={() => setDashboardTab("inventory")}
                  className="flex-1 py-3 text-xs tracking-wider uppercase font-mono transition-colors relative"
                  style={{
                    color: dashboardTab === "inventory" ? "var(--text-primary)" : "var(--text-secondary)",
                    background: dashboardTab === "inventory" ? "var(--glass-bg)" : "transparent",
                  }}
                >
                  Souvenirs ({inventory.length})
                  {dashboardTab === "inventory" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {dashboardTab === "passport" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ERAS_LIST.map(era => {
                      const visited = stamps.includes(era.id);
                      return (
                        <div
                          key={era.id}
                          className="p-4 rounded-xl flex items-center justify-between transition-colors"
                          style={{
                            background: visited ? "var(--glass-bg)" : "transparent",
                            border: "1px solid var(--border-color-subtle)",
                            opacity: visited ? 1 : 0.45,
                          }}
                        >
                          <div>
                            <div className="font-mono text-xs font-semibold tracking-tight">
                              {era.name}
                            </div>
                            <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                              {era.period}
                            </div>
                          </div>
                          <div>
                            {visited ? (
                              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-[9px] font-bold">
                                APPROVED
                              </div>
                            ) : (
                              <Lock size={12} style={{ color: "var(--text-muted)" }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {dashboardTab === "inventory" && (
                  <div className="space-y-3">
                    {ERAS_LIST.map(era => {
                      const collected = inventory.includes(era.id);
                      const item = SOUVENIRS[era.id];

                      if (!item) return null;

                      return (
                        <div
                          key={era.id}
                          className="p-4 rounded-xl flex items-start gap-4 transition-colors"
                          style={{
                            background: collected ? "var(--glass-bg)" : "transparent",
                            border: "1px solid var(--border-color-subtle)",
                            opacity: collected ? 1 : 0.45,
                          }}
                        >
                          <div className="text-2xl mt-1 select-none">
                            {collected ? item.emoji : "❓"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-semibold tracking-tight">
                                {collected ? item.name : "Undiscovered Souvenir"}
                              </h4>
                              <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                                {era.name}
                              </span>
                            </div>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {collected ? item.description : "Travel to this era and start chatting with the locals to retrieve this souvenir."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Souvenir Reveal Modal */}
      <AnimatePresence>
        {souvenirReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 120, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setSouvenirReveal(null)}
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={e => e.stopPropagation()}
              className="text-center p-8 rounded-2xl max-w-sm w-full"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-color)",
                perspective: 800,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {souvenirReveal.emoji}
              </motion.div>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                Artifact Secured
              </div>
              <h3 className="text-lg font-light mb-2">{souvenirReveal.name}</h3>
              <p className="text-xs leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {souvenirReveal.description}
              </p>
              <button
                onClick={() => setSouvenirReveal(null)}
                className="font-mono text-xs tracking-wider uppercase px-6 py-2 rounded-full cursor-pointer"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--border-color)" }}
              >
                Collect
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 p-4 rounded-xl flex items-start gap-3 shadow-2xl pointer-events-none max-w-sm z-[110]"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            {toast.icon && (
              <div className="text-2xl select-none shrink-0 mt-0.5">
                {toast.icon}
              </div>
            )}
            <div>
              <div className="font-mono text-xs font-bold tracking-tight">
                {toast.message}
              </div>
              {toast.submessage && (
                <div className="text-[11px] mt-1 leading-normal" style={{ color: "var(--text-secondary)" }}>
                  {toast.submessage}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
