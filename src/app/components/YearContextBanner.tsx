import { motion } from "motion/react";
import { formatYear } from "./era-config";
import { getYearContext } from "./year-context";

interface Props {
  year: number;
  accentColor: string;
  theme: "light" | "dark";
}

export function YearContextBanner({ year, accentColor, theme }: Props) {
  const ctx = getYearContext(year);

  return (
    <motion.div
      key={`${year}-${ctx.headline}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="shrink-0 px-4 pt-3 pb-2 border-b"
      style={{ borderColor: "var(--border-color-subtle)" }}
    >
      <div
        className="px-3 py-2.5 rounded-xl text-center"
        style={{
          background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          border: `1px solid ${accentColor}44`,
        }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: accentColor }}
        >
          {formatYear(year)} · {ctx.emoji} {ctx.headline}
        </div>
        <div className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {ctx.detail}
        </div>
      </div>
    </motion.div>
  );
}
