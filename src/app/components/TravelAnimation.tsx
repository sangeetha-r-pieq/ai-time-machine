import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { formatYear } from "./era-config";
import { playTravelSound } from "./sounds";

interface Props {
  year: number;
  fromYear?: number;
  onComplete: () => void;
}

export function TravelAnimation({ year, fromYear = 2024, onComplete }: Props) {
  const [displayYear, setDisplayYear] = useState(fromYear);

  useEffect(() => {
    playTravelSound();
    const steps = 14;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const t = step / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayYear(Math.round(fromYear + (year - fromYear) * eased));
      if (step >= steps) clearInterval(interval);
    }, 180);

    const t = setTimeout(onComplete, 2800);
    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, fromYear]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "#000" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
          transition={{ duration: 2.4, delay: i * 0.28, ease: "easeOut" }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{ background: "#fff" }}
        animate={{ opacity: [0, 0, 0.95, 0.95, 0] }}
        transition={{ duration: 2.8, times: [0, 0.45, 0.55, 0.65, 1] }}
      />

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

      {/* Odometer year digits */}
      <motion.div className="relative z-10 text-center">
        <motion.div
          key={displayYear}
          initial={{ opacity: 0.6, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: 300,
            color: "#fff",
            letterSpacing: "-0.02em",
            textShadow: "0 0 40px rgba(255,255,255,0.8)",
            mixBlendMode: "difference",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatYear(displayYear)}
        </motion.div>
        <motion.div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.6)",
            marginTop: 12,
          }}
          animate={{ opacity: [0.4, 1, 1, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          INITIATING TEMPORAL JUMP
        </motion.div>
        <motion.div
          className="mt-4 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              style={{ width: 3, height: 12, background: "rgba(255,255,255,0.4)", borderRadius: 1 }}
              animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, delay: i * 0.08, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
