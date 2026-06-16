import { useState, useRef } from "react";
import { motion } from "motion/react";
import { ChevronUp, ChevronDown, Zap } from "lucide-react";
import { getEraConfig, formatYear, parseYear } from "./era-config";

const PRESETS = [
  { label: "10,000 BC", year: -10000 },
  { label: "2560 BC", year: -2560 },
  { label: "44 BC", year: -44 },
  { label: "1066", year: 1066 },
  { label: "1348", year: 1348 },
  { label: "1776", year: 1776 },
  { label: "1944", year: 1944 },
  { label: "1969", year: 1969 },
  { label: "1991", year: 1991 },
  { label: "2024", year: 2024 },
  { label: "2075", year: 2075 },
  { label: "2150", year: 2150 },
];

interface Props {
  onJump: (year: number) => void;
}

export function YearPicker({ onJump }: Props) {
  const [year, setYear] = useState(2024);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const era = getEraConfig(year);

  const step = (delta: number) => {
    const abs = Math.abs(year);
    const inc = abs > 10000 ? 1000 : abs > 1000 ? 100 : abs > 200 ? 10 : 1;
    setYear(y => y + delta * inc);
  };

  const startEdit = () => {
    setDraft(year < 0 ? `${Math.abs(year)} BC` : String(year));
    setEditing(true);
    setTimeout(() => { inputRef.current?.select(); }, 10);
  };

  const commit = () => {
    const v = parseYear(draft);
    if (v !== null) setYear(v);
    setEditing(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    step(e.deltaY > 0 ? -1 : 1);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center" style={{ background: "#050505" }}>
      {/* Subtle background radial */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(80,80,160,0.06), transparent)" }}
      />

      {/* Wordmark */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}
      >
        CHRONOS · AI TIME MACHINE
      </motion.div>

      {/* Year selector */}
      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <button
          onClick={() => step(1)}
          style={{ color: "rgba(255,255,255,0.18)", background: "none", border: "none", cursor: "pointer", padding: 8, transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
        >
          <ChevronUp size={24} />
        </button>

        <div onWheel={onWheel} style={{ cursor: "text" }}>
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
              className="text-center bg-transparent outline-none"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(48px, 8vw, 88px)",
                fontWeight: 300,
                color: "#ffffff",
                width: "360px",
                letterSpacing: "-0.02em",
                borderBottom: "1px solid rgba(255,255,255,0.25)",
              }}
            />
          ) : (
            <div
              onClick={startEdit}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(48px, 8vw, 88px)",
                fontWeight: 300,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                minWidth: "300px",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              {formatYear(year)}
            </div>
          )}
        </div>

        <button
          onClick={() => step(-1)}
          style={{ color: "rgba(255,255,255,0.18)", background: "none", border: "none", cursor: "pointer", padding: 8, transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
        >
          <ChevronDown size={24} />
        </button>

        {/* Era label */}
        <motion.div
          key={era.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
            {era.name}  ·  {era.period}
          </div>
        </motion.div>
      </motion.div>

      {/* Presets */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mt-12"
        style={{ maxWidth: 560 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {PRESETS.map(p => (
          <button
            key={p.year}
            onClick={() => setYear(p.year)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.08em",
              padding: "5px 12px",
              borderRadius: 20,
              background: year === p.year ? "rgba(255,255,255,0.1)" : "transparent",
              border: `1px solid ${year === p.year ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}`,
              color: year === p.year ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (year !== p.year) { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; } }}
            onMouseLeave={e => { if (year !== p.year) { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; } }}
          >
            {p.label}
          </button>
        ))}
      </motion.div>

      {/* Begin Journey */}
      <motion.button
        onClick={() => onJump(year)}
        className="flex items-center gap-2 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "12px 32px",
          borderRadius: 40,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          letterSpacing: "0.2em",
          cursor: "pointer",
          transition: "all 0.2s",
          textTransform: "uppercase",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
      >
        <Zap size={14} />
        Begin Journey
      </motion.button>

      {/* Hint */}
      <div
        className="absolute bottom-8"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em" }}
      >
        click year to type · scroll to change · any year from -50,000 to 9,999
      </div>
    </div>
  );
}
