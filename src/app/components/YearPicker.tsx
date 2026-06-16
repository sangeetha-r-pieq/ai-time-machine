import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown, Zap, Sun, Moon, BookOpen } from "lucide-react";
import { getEraConfig, formatYear, parseYear } from "./era-config";
import { getYearContext } from "./year-context";
import { SceneParticles } from "./SceneParticles";
import { playPingSound } from "./sounds";

const PRESETS = [
  { label: "10,000 BC", year: -10000 },
  { label: "2,560 BC", year: -2560 },
  { label: "44 BC", year: -44 },
  { label: "1066 AD", year: 1066 },
  { label: "1348 AD", year: 1348 },
  { label: "1776 AD", year: 1776 },
  { label: "1944 AD", year: 1944 },
  { label: "1969 AD", year: 1969 },
  { label: "1991 AD", year: 1991 },
  { label: "2024 AD", year: 2024 },
  { label: "2075 AD", year: 2075 },
  { label: "2150 AD", year: 2150 },
];

interface Props {
  onJump: (year: number) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  stampsCount: number;
  onOpenDashboard: () => void;
}

export function YearPicker({
  onJump,
  theme,
  onToggleTheme,
  stampsCount,
  onOpenDashboard,
}: Props) {
  const [year, setYear] = useState(2024);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const era = getEraConfig(year);
  const yearContext = getYearContext(year);

  const step = (delta: number) => {
    const abs = Math.abs(year);
    const inc = abs > 10000 ? 1000 : abs > 1000 ? 100 : abs > 200 ? 10 : 1;
    setYear(y => y + delta * inc);
    playPingSound(400 + Math.abs(year) % 200);
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
    <div className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      {/* Live era preview background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          className="fixed inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0" style={{ background: era.skyGradient }} />
          {era.atmosphereColor && (
            <div className="absolute inset-0" style={{ background: era.atmosphereColor }} />
          )}
          <SceneParticles type={era.particleType} color={era.particleColor} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 40%, var(--background) 100%)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle accent radial */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: theme === "dark"
            ? `radial-gradient(ellipse 50% 40% at 50% 60%, ${era.accentColor}18, transparent)`
            : `radial-gradient(ellipse 50% 40% at 50% 60%, ${era.accentColor}12, transparent)`
        }}
      />

      {/* Top Navigation Bar */}
      <div
        className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-30"
        style={{ borderBottom: "1px solid var(--border-color-subtle)" }}
      >
        {/* Wordmark (Left) */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "var(--text-primary)",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          CHRONOS
        </div>

        {/* Dashboard & Theme Actions (Right) */}
        <div className="flex items-center gap-3">
          {/* Traveler Passport Dashboard */}
          <motion.button
            onClick={onOpenDashboard}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.08em",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "var(--glass-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <BookOpen size={11} />
            Passport
            <span
              style={{
                marginLeft: "2px",
                padding: "1px 6px",
                borderRadius: "10px",
                background: "var(--border-color)",
                fontSize: "9px",
                color: "var(--text-secondary)",
              }}
            >
              {stampsCount}
            </span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={onToggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "var(--glass-bg)",
              border: "1px solid var(--border-color-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)",
            }}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={13} /> : <Sun size={13} />}
          </motion.button>
        </div>
      </div>

      {/* Year context banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${yearContext.headline}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 right-0 z-20 px-5"
          style={{ top: 72 }}
        >
          <div
            className="mx-auto max-w-lg px-4 py-3 rounded-xl text-center"
            style={{
              background: theme === "dark" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.75)",
              border: `1px solid ${era.accentColor}44`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: era.accentColor,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {yearContext.emoji} {yearContext.headline}
            </div>
            <div
              style={{
                fontSize: "12px",
                lineHeight: 1.55,
                color: "var(--text-secondary)",
              }}
            >
              {yearContext.detail}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Year selector */}
      <motion.div
        className="flex flex-col items-center gap-5 relative z-10 mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <button
          onClick={() => step(1)}
          style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 8, transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
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
                color: "var(--text-primary)",
                width: "360px",
                letterSpacing: "-0.02em",
                borderBottom: "1px solid var(--border-color)",
              }}
            />
          ) : (
            <div
              onClick={startEdit}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(48px, 8vw, 88px)",
                fontWeight: 300,
                color: "var(--text-primary)",
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
          style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 8, transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
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
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", color: era.accentColor, textTransform: "uppercase" }}>
            {era.name}  ·  {era.period}
          </div>
        </motion.div>
      </motion.div>

      {/* Presets */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mt-12 px-4 relative z-10"
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
              background: year === p.year ? "var(--glass-bg-hover)" : "transparent",
              border: `1px solid ${year === p.year ? "var(--border-color)" : "var(--border-color-subtle)"}`,
              color: year === p.year ? "var(--text-primary)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (year !== p.year) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-color)"; } }}
            onMouseLeave={e => { if (year !== p.year) { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-color-subtle)"; } }}
          >
            {p.label}
          </button>
        ))}
      </motion.div>

      {/* Begin Journey */}
      <motion.button
        onClick={() => onJump(year)}
        className="flex items-center gap-2 mt-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "12px 32px",
          borderRadius: 40,
          background: `${era.accentColor}22`,
          border: `1px solid ${era.accentColor}66`,
          color: "var(--text-primary)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          letterSpacing: "0.2em",
          cursor: "pointer",
          transition: "all 0.2s",
          textTransform: "uppercase",
          boxShadow: `0 0 20px ${era.accentColor}22`,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${era.accentColor}33`; e.currentTarget.style.borderColor = era.accentColor; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${era.accentColor}22`; e.currentTarget.style.borderColor = `${era.accentColor}66`; }}
      >
        <Zap size={14} />
        Begin Journey
      </motion.button>

      {/* Hint */}
      <div
        className="absolute bottom-8"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.1em" }}
      >
        click year to type · scroll to change · any year from -50,000 to 9,999
      </div>
    </div>
  );
}
