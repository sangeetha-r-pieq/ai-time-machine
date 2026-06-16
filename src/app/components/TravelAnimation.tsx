import { useEffect } from "react";
import { motion } from "motion/react";
import { formatYear } from "./era-config";
import { playTravelSound } from "./sounds";

interface Props {
  year: number;
  onComplete: () => void;
}

export function TravelAnimation({ year, onComplete }: Props) {
  useEffect(() => {
    playTravelSound();
    const t = setTimeout(onComplete, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "#000" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Radial burst expanding rings */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: "rgba(255,255,255,0.3)", width: 20, height: 20 }}
          animate={{
            width: ["20px", "200vw"],
            height: ["20px", "200vw"],
            opacity: [0.8, 0],
            borderColor: ["rgba(255,255,255,0.8)", "rgba(255,255,255,0)"],
          }}
          transition={{
            duration: 2.4,
            delay: i * 0.28,
            ease: "easeOut",
          }}
        />
      ))}

      {/* White flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "#fff" }}
        animate={{ opacity: [0, 0, 0.95, 0.95, 0] }}
        transition={{ duration: 2.8, times: [0, 0.45, 0.55, 0.65, 1] }}
      />

      {/* Streaking lines */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * 360;
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: "2px",
                height: "0px",
                background: "rgba(255,255,255,0.6)",
                left: "50%",
                top: "50%",
                transformOrigin: "top center",
                transform: `rotate(${angle}deg)`,
              }}
              animate={{ height: ["0px", "60vmax"], opacity: [1, 0] }}
              transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
            />
          );
        })}
      </div>

      {/* Year label */}
      <motion.div
        className="relative z-10 text-center"
        animate={{
          scale: [0.5, 1.2, 1],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 2.8, times: [0, 0.35, 0.7, 1] }}
      >
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "clamp(32px, 6vw, 64px)",
          fontWeight: 300,
          color: "#fff",
          letterSpacing: "-0.02em",
          textShadow: "0 0 40px rgba(255,255,255,0.8)",
          mixBlendMode: "difference",
        }}>
          {formatYear(year)}
        </div>
        <motion.div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.6)",
            marginTop: 12,
          }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.8, times: [0.2, 0.5, 0.7, 1] }}
        >
          INITIATING TEMPORAL JUMP
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
