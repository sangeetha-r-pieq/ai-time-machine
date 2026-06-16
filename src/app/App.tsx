import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { YearPicker } from "./components/YearPicker";
import { TravelAnimation } from "./components/TravelAnimation";
import { EraScene } from "./components/EraScene";
import { AgentChat } from "./components/AgentChat";
import { getEraConfig, formatYear } from "./components/era-config";
import { startAmbient, stopAmbient, playArrivalSound } from "./components/sounds";

type Phase = "picker" | "traveling" | "scene";

export default function App() {
  const [phase, setPhase] = useState<Phase>("picker");
  const [year, setYear] = useState(2024);
  const ambientRunning = useRef(false);

  const config = getEraConfig(year);

  const handleJump = (y: number) => {
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
  };

  const handleReturn = () => {
    stopAmbient();
    ambientRunning.current = false;
    setPhase("picker");
  };

  // Update ambient when era changes while in scene
  useEffect(() => {
    if (phase === "scene") {
      startAmbient(config.ambientFreq, config.ambientType, config.ambientGain);
      ambientRunning.current = true;
    }
  }, [config.id]);

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: "#050505" }}>
      <AnimatePresence mode="wait">

        {phase === "picker" && (
          <motion.div key="picker" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}>
            <YearPicker onJump={handleJump} />
          </motion.div>
        )}

        {phase === "traveling" && (
          <TravelAnimation key="travel" year={year} onComplete={handleArrived} />
        )}

        {phase === "scene" && (
          <motion.div key="scene" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>

            {/* Full-screen era scene */}
            <EraScene config={config} year={year} />

            {/* Top bar — minimal, absolute */}
            <div
              className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4"
              style={{ zIndex: 20, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)" }}
            >
              <div>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "18px", fontWeight: 300,
                  color: "#fff", letterSpacing: "-0.01em",
                }}>
                  {formatYear(year)}
                </div>
                <motion.div
                  key={config.id}
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
            <AgentChat config={config} year={year} onReturn={handleReturn} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
