import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { formatYear, getEraConfig, type EraId } from "./era-config";
import { playTravelSound } from "./sounds";

const ERA_ORDER: EraId[] = [
  "prehistoric", "ancient", "classical", "medieval", "industrial",
  "wartime", "analog", "digital", "present", "future",
];

const ERA_EMOJI: Record<EraId, string> = {
  prehistoric: "🏔️",
  ancient: "🏺",
  classical: "☸️",
  medieval: "🕌",
  industrial: "🚂",
  wartime: "🇮🇳",
  analog: "🚀",
  digital: "💻",
  present: "🤖",
  future: "🔮",
};

const ERA_LABEL: Record<EraId, string> = {
  prehistoric: "Prehistoric",
  ancient: "Indus Valley",
  classical: "Classical",
  medieval: "Medieval",
  industrial: "Colonial",
  wartime: "Freedom",
  analog: "Space Age",
  digital: "IT Boom",
  present: "Digital Bharat",
  future: "Future",
};

interface Props {
  year: number;
  fromYear?: number;
  onComplete: () => void;
}

function TimeRocket({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 140 90" width={140} height={90} style={{ display: "block", filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.4))" }}>
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Flame */}
        <motion.ellipse
          cx="18" cy="52" rx="10" ry="14"
          fill="#FF6B35"
          animate={{ rx: [8, 12, 8], ry: [12, 16, 12], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <motion.ellipse
          cx="18" cy="54" rx="6" ry="10"
          fill="#FFD54F"
          animate={{ rx: [4, 7, 4] }}
          transition={{ duration: 0.25, repeat: Infinity }}
        />
        {/* Body */}
        <ellipse cx="55" cy="48" rx="42" ry="28" fill={accent} stroke="#2D3436" strokeWidth="3" />
        {/* Tricolor stripe */}
        <rect x="28" y="44" width="54" height="6" fill="#FF9933" stroke="#2D3436" strokeWidth="1" />
        <rect x="28" y="50" width="54" height="6" fill="#fff" stroke="#2D3436" strokeWidth="1" />
        <rect x="28" y="56" width="54" height="6" fill="#138808" stroke="#2D3436" strokeWidth="1" />
        {/* Window / clock */}
        <circle cx="72" cy="42" r="14" fill="#E3F2FD" stroke="#2D3436" strokeWidth="2.5" />
        <circle cx="72" cy="42" r="2" fill="#2D3436" />
        <line x1="72" y1="42" x2="72" y2="33" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" />
        <line x1="72" y1="42" x2="78" y2="45" stroke="#2D3436" strokeWidth="1.5" strokeLinecap="round" />
        {/* Nose cone */}
        <polygon points="97,48 130,48 115,28" fill="#FF6B35" stroke="#2D3436" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Fin */}
        <polygon points="30,58 18,72 30,68" fill="#455A64" stroke="#2D3436" strokeWidth="2" />
        <polygon points="30,38 18,24 30,28" fill="#455A64" stroke="#2D3436" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

export function TravelAnimation({ year, fromYear = 2024, onComplete }: Props) {
  const [displayYear, setDisplayYear] = useState(fromYear);
  const [flipIndex, setFlipIndex] = useState(0);

  const destEra = getEraConfig(year);
  const fromEra = getEraConfig(fromYear);

  const erasInPath = useMemo(() => {
    const fromIdx = ERA_ORDER.indexOf(fromEra.id);
    const toIdx = ERA_ORDER.indexOf(destEra.id);
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    const slice = ERA_ORDER.slice(start, end + 1);
    return fromYear <= year ? slice : [...slice].reverse();
  }, [fromEra.id, destEra.id, fromYear, year]);

  useEffect(() => {
    playTravelSound();
    const steps = 16;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const t = step / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayYear(Math.round(fromYear + (year - fromYear) * eased));
      if (erasInPath.length > 1) {
        setFlipIndex(Math.min(erasInPath.length - 1, Math.floor(eased * erasInPath.length)));
      }
      if (step >= steps) clearInterval(interval);
    }, 170);

    const t = setTimeout(onComplete, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, fromYear, erasInPath.length]);

  const forward = year >= fromYear;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #1a1040 50%, #0d0820 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 3) % 100}%`,
          }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 1.5 + (i % 5) * 0.3, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}

      {/* Speed lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-0.5 rounded-full"
          style={{
            top: `${15 + i * 7}%`,
            background: `linear-gradient(90deg, transparent, ${destEra.accentColor}88, transparent)`,
            width: "30%",
          }}
          animate={{ x: forward ? ["120vw", "-40vw"] : ["-40vw", "120vw"] }}
          transition={{ duration: 0.8 + i * 0.06, repeat: Infinity, delay: i * 0.08, ease: "linear" }}
        />
      ))}

      {/* Era flipbook cards streaking past */}
      {erasInPath.map((eraId, i) => (
        <motion.div
          key={eraId}
          className="absolute flex flex-col items-center gap-1 pointer-events-none"
          style={{ top: `${22 + (i % 4) * 14}%` }}
          initial={{ x: forward ? "110vw" : "-30vw", opacity: 0, rotate: forward ? 8 : -8 }}
          animate={{ x: forward ? "-30vw" : "110vw", opacity: [0, 1, 1, 0], rotate: 0 }}
          transition={{ duration: 1.8, delay: i * 0.22, ease: "easeInOut" }}
        >
          <div
            style={{
              background: "#fff",
              border: "3px solid #2D3436",
              borderRadius: 16,
              padding: "12px 16px",
              boxShadow: "4px 4px 0 #2D3436",
              textAlign: "center",
              minWidth: 80,
            }}
          >
            <div style={{ fontSize: 32 }}>{ERA_EMOJI[eraId]}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.08em", color: "#555", marginTop: 4, textTransform: "uppercase" }}>
              {ERA_LABEL[eraId]}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Flying rocket */}
      <motion.div
        className="absolute z-20"
        style={{ top: "42%" }}
        initial={{ x: forward ? "-20vw" : "120vw" }}
        animate={{ x: forward ? "120vw" : "-20vw" }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      >
        <TimeRocket accent={destEra.accentColor} />
      </motion.div>

      {/* Center flipbook highlight */}
      <AnimatePresence mode="wait">
        {erasInPath.length > 0 && (
          <motion.div
            key={erasInPath[flipIndex]}
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: "18vh" }}
          >
            <div
              style={{
                background: "#fff",
                border: "3px solid #2D3436",
                borderRadius: 20,
                padding: "16px 24px",
                boxShadow: `5px 5px 0 #2D3436`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48 }}>{ERA_EMOJI[erasInPath[flipIndex]]}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: destEra.accentColor, marginTop: 6, textTransform: "uppercase" }}>
                {ERA_LABEL[erasInPath[flipIndex]]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Year odometer */}
      <motion.div className="relative z-30 text-center" style={{ marginTop: "auto", marginBottom: "12vh" }}>
        <motion.div
          key={displayYear}
          initial={{ opacity: 0.5, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.12 }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "clamp(36px, 7vw, 72px)",
            fontWeight: 400,
            color: "#fff",
            letterSpacing: "-0.02em",
            textShadow: `0 0 30px ${destEra.accentColor}, 3px 3px 0 #2D3436`,
          }}
        >
          {formatYear(displayYear)}
        </motion.div>
        <motion.div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.65)",
            marginTop: 10,
            textTransform: "uppercase",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {forward ? "Traveling forward →" : "Traveling backward ←"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
