import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap, Sun, Moon, BookOpen, Clock, Keyboard } from "lucide-react";
import { getEraConfig, formatYear, parseYear } from "./era-config";
import { getYearContext } from "./year-context";
import { getEraBackgroundUrl } from "./india-content";
import { SceneParticles } from "./SceneParticles";
import { playPingSound } from "./sounds";

const PRESETS = [
  { label: "10,000 BC", year: -10000 },
  { label: "2500 BC", year: -2500 },
  { label: "322 BC", year: -322 },
  { label: "1526 AD", year: 1526 },
  { label: "1857 AD", year: 1857 },
  { label: "1947 AD", year: 1947 },
  { label: "1969 AD", year: 1969 },
  { label: "1991 AD", year: 1991 },
  { label: "2024 AD", year: 2024 },
  { label: "2075 AD", year: 2075 },
];

const TOTAL_ERAS = 10;

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
  const [bgLoaded, setBgLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const era = getEraConfig(year);
  const yearContext = useMemo(() => getYearContext(year), [year]);
  const backgroundUrl = useMemo(() => getEraBackgroundUrl(era.id, year), [era.id, year]);

  useEffect(() => {
    setBgLoaded(false);
  }, [backgroundUrl]);

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

  const selectPreset = (y: number) => {
    setYear(y);
    playPingSound(500 + Math.abs(y) % 300);
  };

  const goPreset = (delta: -1 | 1) => {
    let idx = PRESETS.findIndex(p => p.year === year);
    if (idx === -1) {
      const nextIdx = PRESETS.findIndex(p => p.year > year);
      idx = delta > 0
        ? (nextIdx === -1 ? PRESETS.length - 1 : nextIdx)
        : (nextIdx <= 0 ? 0 : nextIdx - 1);
    } else {
      idx = Math.max(0, Math.min(PRESETS.length - 1, idx + delta));
    }
    selectPreset(PRESETS[idx].year);
  };

  const scrollTimeline = (delta: -1 | 1) => {
    timelineRef.current?.scrollBy({ left: delta * 220, behavior: "smooth" });
  };

  useEffect(() => {
    const el = timelineRef.current?.querySelector(`[data-preset="${year}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [year]);

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-hidden" style={{ background: "var(--background)", color: "var(--text-primary)" }}>

      {/* ── Background layers ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${era.id}-${theme}`}
          className="fixed inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* AI India scene */}
          <img
            key={backgroundUrl}
            src={backgroundUrl}
            alt=""
            loading="lazy"
            onLoad={() => setBgLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: bgLoaded ? (theme === "light" ? 0.38 : 0.5) : 0 }}
          />

          {/* Era tint */}
          {theme === "light" ? (
            <>
              <div className="absolute inset-0" style={{ background: `linear-gradient(165deg, ${era.accentColor}14 0%, rgba(255,255,255,0.55) 45%, rgba(248,250,252,0.7) 100%)` }} />
              <div className="absolute inset-0" style={{ background: era.skyGradient, opacity: 0.05 }} />
            </>
          ) : (
            <>
              <div className="absolute inset-0" style={{ background: era.skyGradient, opacity: 0.55 }} />
              {era.atmosphereColor && <div className="absolute inset-0" style={{ background: era.atmosphereColor }} />}
            </>
          )}

          <SceneParticles type={era.particleType} color={era.particleColor} />

          {/* Readability vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: theme === "light"
                ? "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, rgba(255,255,255,0.75) 100%)"
                : "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 20%, rgba(5,5,5,0.85) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: theme === "light"
                ? "linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 30%, transparent 60%, rgba(248,250,252,0.9) 100%)"
                : "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 55%, rgba(5,5,5,0.95) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Accent glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 38%, ${era.accentColor}${theme === "light" ? "18" : "28"}, transparent 70%)`,
        }}
      />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-30">
        {/* Progress teaser */}
        <div className="flex items-center gap-3">
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            {stampsCount > 0 ? `${stampsCount} / ${TOTAL_ERAS} eras explored` : "Pick a year to begin"}
          </div>
          {stampsCount > 0 && (
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: TOTAL_ERAS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i < stampsCount ? era.accentColor : "var(--border-color-subtle)",
                    opacity: i < stampsCount ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
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
              backdropFilter: "blur(8px)",
            }}
          >
            <BookOpen size={11} />
            Passport
            <span style={{ marginLeft: "2px", padding: "1px 6px", borderRadius: "10px", background: "var(--border-color)", fontSize: "9px", color: "var(--text-secondary)" }}>
              {stampsCount}
            </span>
          </motion.button>

          <motion.button
            onClick={onToggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "var(--glass-bg)", border: "1px solid var(--border-color-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-primary)", backdropFilter: "blur(8px)",
            }}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={13} /> : <Sun size={13} />}
          </motion.button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pb-28 pt-16 overflow-y-auto">

        {/* Hero title */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={16} style={{ color: era.accentColor, opacity: 0.8 }} />
            <h1
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(14px, 2.5vw, 18px)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              AI Time Machine
            </h1>
          </div>
          <p
            style={{
              fontFamily: era.fontFamily,
              fontSize: "13px",
              color: "var(--text-secondary)",
              margin: 0,
              letterSpacing: "0.03em",
            }}
          >
            Stories Across Time
          </p>
        </motion.div>

        {/* Year selector */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <button
            onClick={() => step(1)}
            style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 8, transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = era.accentColor)}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <ChevronUp size={24} />
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous year"
              style={{ color: "var(--text-muted)", background: "var(--glass-bg)", border: "1px solid var(--border-color-subtle)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "color 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = era.accentColor; e.currentTarget.style.borderColor = era.accentColor; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-color-subtle)"; }}
            >
              <ChevronLeft size={22} />
            </button>

            <div onWheel={onWheel} style={{ cursor: "text" }}>
              <AnimatePresence mode="wait">
                {editing ? (
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onBlur={commit}
                    onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
                    className="text-center bg-transparent outline-none"
                    placeholder="e.g. 1947 or 500 BC"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "clamp(36px, 7vw, 72px)",
                      fontWeight: 300,
                      color: "var(--text-primary)",
                      width: "min(360px, 70vw)",
                      letterSpacing: "-0.02em",
                      borderBottom: `2px solid ${era.accentColor}`,
                    }}
                  />
                ) : (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.25 }}
                    onClick={startEdit}
                    title="Click to type a year"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "clamp(52px, 9vw, 96px)",
                      fontWeight: 300,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                      minWidth: "200px",
                      textAlign: "center",
                      userSelect: "none",
                      textShadow: theme === "dark" ? `0 0 40px ${era.accentColor}44` : "none",
                    }}
                  >
                    {formatYear(year)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next year"
              style={{ color: "var(--text-muted)", background: "var(--glass-bg)", border: "1px solid var(--border-color-subtle)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "color 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = era.accentColor; e.currentTarget.style.borderColor = era.accentColor; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-color-subtle)"; }}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <button
            type="button"
            onClick={startEdit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: 20,
              background: "var(--glass-bg)",
              border: `1px solid ${era.accentColor}44`,
              color: era.accentColor,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            <Keyboard size={12} />
            Type year
          </button>

          <button
            onClick={() => step(-1)}
            style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 8, transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = era.accentColor)}
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
              {era.name} · {era.period}
            </div>
          </motion.div>
        </motion.div>

        {/* Year context card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${yearContext.headline}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="mt-5 mx-auto text-center max-w-md px-5 py-4 rounded-2xl"
            style={{
              background: theme === "light" ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.55)",
              border: `1px solid ${era.accentColor}33`,
              backdropFilter: "blur(12px)",
              boxShadow: `0 8px 32px ${era.accentColor}12`,
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: 6 }}>{yearContext.emoji}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", color: era.accentColor, marginBottom: 6 }}>
              {yearContext.headline}
            </div>
            <div style={{ fontFamily: era.fontFamily, fontSize: "13px", lineHeight: 1.65, color: "var(--text-secondary)" }}>
              {yearContext.detail}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline strip */}
        <motion.div
          className="mt-8 w-full max-w-2xl flex items-center gap-2 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            type="button"
            onClick={() => goPreset(-1)}
            aria-label="Previous era"
            style={{ color: "var(--text-muted)", background: "var(--glass-bg)", border: "1px solid var(--border-color-subtle)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, backdropFilter: "blur(8px)" }}
            onMouseEnter={e => { e.currentTarget.style.color = era.accentColor; e.currentTarget.style.borderColor = era.accentColor; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-color-subtle)"; }}
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={timelineRef}
            className="flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
            onWheel={e => { if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) scrollTimeline(e.deltaY > 0 ? 1 : -1); }}
          >
            <div className="flex gap-2 pb-1 min-w-max px-1">
            {PRESETS.map(p => {
              const ctx = getYearContext(p.year);
              const presetEra = getEraConfig(p.year);
              const active = year === p.year;
              const accent = active ? presetEra.accentColor : "var(--border-color-subtle)";
              return (
                <motion.button
                  key={p.year}
                  data-preset={p.year}
                  onClick={() => selectPreset(p.year)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "10px 12px",
                    borderRadius: 14,
                    minWidth: 88,
                    background: active
                      ? `${presetEra.accentColor}${theme === "light" ? "22" : "33"}`
                      : theme === "light" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${accent}`,
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>{ctx.emoji}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.06em", color: active ? presetEra.accentColor : "var(--text-primary)", fontWeight: active ? 600 : 400 }}>
                    {p.label}
                  </span>
                  <span style={{ fontFamily: era.fontFamily, fontSize: "8px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.3, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ctx.headline}
                  </span>
                </motion.button>
              );
            })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => goPreset(1)}
            aria-label="Next era"
            style={{ color: "var(--text-muted)", background: "var(--glass-bg)", border: "1px solid var(--border-color-subtle)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, backdropFilter: "blur(8px)" }}
            onMouseEnter={e => { e.currentTarget.style.color = era.accentColor; e.currentTarget.style.borderColor = era.accentColor; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-color-subtle)"; }}
          >
            <ChevronRight size={18} />
          </button>
        </motion.div>

        {/* Begin Journey */}
        <motion.button
          onClick={() => onJump(year)}
          className="flex items-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "14px 36px",
            borderRadius: 40,
            background: `${era.accentColor}${theme === "light" ? "28" : "33"}`,
            border: `1px solid ${era.accentColor}`,
            color: "var(--text-primary)",
            fontFamily: "'DM Mono', monospace",
            fontSize: "12px",
            letterSpacing: "0.2em",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: `0 0 28px ${era.accentColor}33`,
            backdropFilter: "blur(8px)",
          }}
        >
          <Zap size={14} style={{ color: era.accentColor }} />
          Begin Journey
        </motion.button>
      </div>

      {/* Hint */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center z-10"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.1em" }}
      >
        ← → to change year · ↑ ↓ to step · type any year from -50,000 to 9,999
      </div>
    </div>
  );
};
