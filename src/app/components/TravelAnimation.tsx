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
  ancient: "Ancient World",
  classical: "Classical",
  medieval: "Medieval",
  industrial: "Industrial",
  wartime: "World Wars",
  analog: "Space Age",
  digital: "Digital Age",
  present: "Present Day",
  future: "Future",
};

interface Props {
  year: number;
  fromYear?: number;
  onComplete: () => void;
}

function TimeRocket({ accent, flipped }: { accent: string; flipped?: boolean }) {
  return (
    <svg viewBox="0 0 140 90" width={140} height={90} style={{ display: "block", filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.4))", transform: flipped ? "scaleX(-1)" : "none" }}>
      <motion.g
        animate={{
          y: [0, -4, 1, -3, 0],
          x: [0, 1, -1, 0.5, 0],
        }}
        transition={{
          y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 0.15, repeat: Infinity, ease: "linear" },
        }}
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

export function TravelAnimation({ year, fromYear = 2026, onComplete }: Props) {
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

  // ── Direction-based palettes ──────────────────────────────────────────
  const bgGradient = forward
    ? "linear-gradient(180deg, #020818 0%, #0a1a40 40%, #0d2855 100%)"    // cool deep blue
    : "linear-gradient(180deg, #1a0a00 0%, #2d1800 40%, #3d2000 100%)";   // warm amber/sepia

  const streakColor = forward ? "#38bdf8" : "#f59e0b";    // cyan vs amber
  const glowColor   = forward ? "#06b6d4" : "#d97706";
  const vortexColor = forward ? "rgba(56,189,248,0.12)" : "rgba(245,158,11,0.12)";

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{ background: bgGradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Film grain overlay (backward only) ── */}
      {!forward && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            opacity: 0.35,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* ── Pulsing time vortex rings ── */}
      {[1, 2, 3, 4].map(ring => (
        <motion.div
          key={`vortex-${ring}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ring * 160,
            height: ring * 160,
            border: `1.5px solid ${vortexColor}`,
            left: "50%",
            top: "42%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: forward ? [0.4, 1.8] : [1.8, 0.4],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: ring * 0.35,
            ease: "easeOut",
          }}
        />
      ))}

      {/* ── Radial speed streaks (exploding for forward, imploding/sucking for backward) ── */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360;
        return (
          <div
            key={`radial-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "42%",
              transformOrigin: "top center",
              transform: `rotate(${angle}deg)`,
            }}
          >
            <motion.div
              style={{
                width: 2,
                height: "35vh",
                background: `linear-gradient(${forward ? "to bottom" : "to top"}, ${streakColor}aa, transparent)`,
                transformOrigin: "top center",
              }}
              animate={{
                y: forward ? ["0vh", "35vh"] : ["35vh", "0vh"],
                scaleY: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 0.8 + (i % 4) * 0.15,
                repeat: Infinity,
                delay: i * 0.03,
                ease: forward ? "easeOut" : "easeIn",
              }}
            />
          </div>
        );
      })}

      {/* ── Stars (move direction matches travel) ── */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 3) % 100}%`,
            background: forward ? "#fff" : "#fbbf24",
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            x: forward ? [0, -20] : [0, 20],
          }}
          transition={{
            duration: 1.5 + (i % 5) * 0.3,
            repeat: Infinity,
            delay: i * 0.05,
          }}
        />
      ))}

      {/* ── Horizontal speed lines ── */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${10 + i * 6}%`,
            height: i % 3 === 0 ? 2 : 1,
            background: `linear-gradient(90deg, transparent, ${streakColor}${i % 2 === 0 ? "66" : "44"}, transparent)`,
            width: `${20 + (i % 4) * 5}%`,
          }}
          animate={{ x: forward ? ["120vw", "-40vw"] : ["-40vw", "120vw"] }}
          transition={{
            duration: 0.7 + i * 0.05,
            repeat: Infinity,
            delay: i * 0.06,
            ease: "linear",
          }}
        />
      ))}

      {/* ── Era flipbook cards streaking past ── */}
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

      {/* ── Flying rocket ── */}
      <motion.div
        className="absolute z-20"
        style={{ top: "42%" }}
        initial={{ x: forward ? "-20vw" : "120vw" }}
        animate={{ x: forward ? "120vw" : "-20vw" }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      >
        <TimeRocket accent={destEra.accentColor} flipped={!forward} />
      </motion.div>

      {/* ── Center flipbook highlight ── */}
      <AnimatePresence mode="wait">
        {erasInPath.length > 0 && (
          <motion.div
            key={erasInPath[flipIndex]}
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.5, rotate: forward ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2, rotate: forward ? 10 : -10 }}
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

      {/* ── Year odometer ── */}
      <motion.div className="relative z-30 text-center" style={{ marginTop: "auto", marginBottom: "12vh" }}>
        <motion.div
          key={displayYear}
          initial={{ opacity: 0.5, y: forward ? 6 : -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.12 }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "clamp(36px, 7vw, 72px)",
            fontWeight: 400,
            color: "#fff",
            letterSpacing: "-0.02em",
            textShadow: `0 0 30px ${glowColor}, 3px 3px 0 #2D3436`,
          }}
        >
          {formatYear(displayYear)}
        </motion.div>
        <motion.div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: forward ? "rgba(56,189,248,0.75)" : "rgba(251,191,36,0.75)",
            marginTop: 10,
            textTransform: "uppercase",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {forward ? "Traveling forward →" : "← Rewinding time"}
        </motion.div>
      </motion.div>

      {/* ── Sepia vignette overlay (backward only) ── */}
      {!forward && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(139,69,19,0.25) 100%)",
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* ── Cool edge glow (forward only) ── */}
      {forward && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(6,182,212,0.12) 100%)",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

