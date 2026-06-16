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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="shrink-0 px-4 pt-2.5 pb-2"
    >
      <div
        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl"
        style={{
          background: theme === "dark"
            ? `linear-gradient(90deg, ${accentColor}14, transparent)`
            : `linear-gradient(90deg, ${accentColor}10, transparent)`,
          border: `1px solid ${accentColor}22`,
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>{ctx.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
            {formatYear(year)} · {ctx.headline}
          </div>
          <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
            {ctx.detail}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
