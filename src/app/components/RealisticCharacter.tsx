import { useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";

interface Props {
  portraitUrl: string;
  agentName: string;
  accentColor: string;
  isTalking?: boolean;
  isWalking?: boolean;
  facingLeft?: boolean;
  speakPulse?: number;
  size?: "md" | "lg";
  showLabel?: boolean;
}

const FEATHER_MASK =
  "radial-gradient(ellipse 88% 92% at 50% 38%, black 42%, transparent 78%)";

function SilhouetteFallback({ accentColor, tall }: { accentColor: string; tall: number }) {
  return (
    <svg viewBox="0 0 100 150" width="100%" height={tall} style={{ display: "block", opacity: 0.7 }}>
      <ellipse cx="50" cy="32" rx="18" ry="22" fill={accentColor} opacity="0.25" />
      <path d="M 30 58 Q 50 50 70 58 L 68 120 Q 50 128 32 120 Z" fill={accentColor} opacity="0.2" />
    </svg>
  );
}

export function RealisticCharacter({
  portraitUrl,
  agentName,
  accentColor,
  isTalking,
  isWalking,
  facingLeft,
  speakPulse = 0,
  size = "md",
  showLabel = true,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const headControls = useAnimation();

  const w = size === "lg" ? 200 : 160;
  const h = size === "lg" ? 280 : 230;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [portraitUrl]);

  useEffect(() => {
    if (!speakPulse) return;
    setMouthOpen(v => (v + 1) % 4);
    void headControls.start({
      rotateZ: [0, speakPulse % 2 === 0 ? 1.2 : -1.2, 0],
      transition: { duration: 0.12 },
    });
  }, [speakPulse, headControls]);

  useEffect(() => {
    if (!isTalking) {
      setMouthOpen(0);
      return;
    }
    const blink = window.setInterval(() => {
      if (Math.random() > 0.7) {
        void headControls.start({ scaleY: [1, 0.97, 1], transition: { duration: 0.15 } });
      }
    }, 2400);
    return () => window.clearInterval(blink);
  }, [isTalking, headControls]);

  const active = isTalking || isWalking;
  const mouthHeights = [0.35, 0.55, 0.75, 0.5];

  return (
    <div className="relative flex flex-col items-center" style={{ width: w, minHeight: h + (showLabel ? 24 : 0) }}>
      {isTalking && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
          style={{ top: -36 }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(220,38,38,0.9)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 8,
              letterSpacing: "0.15em",
              color: "#fff",
              fontWeight: 600,
            }}
            animate={{ opacity: [1, 0.65, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            LIVE
          </motion.span>
          <div className="flex items-end gap-0.5 h-4">
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                style={{ width: 3, borderRadius: 2, background: accentColor }}
                animate={{ height: [4, 10 + (speakPulse % 3) * 2, 5, 12, 4] }}
                transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.07 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="relative"
        animate={headControls}
        style={{
          width: w,
          height: h,
          transform: facingLeft ? "scaleX(-1)" : undefined,
        }}
      >
        {isTalking && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background: `radial-gradient(ellipse at 50% 35%, ${accentColor}33 0%, transparent 65%)`,
              zIndex: 1,
            }}
            animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.04, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}

        <motion.div
          className="absolute inset-0"
          animate={{
            y: active ? [0, -5, 0] : [0, -2, 0],
            scale: isTalking ? [1, 1.015, 1] : 1,
          }}
          transition={
            active
              ? { duration: isWalking ? 0.38 : 0.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {(!loaded || failed) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <SilhouetteFallback accentColor={accentColor} tall={h * 0.75} />
              {!loaded && !failed && (
                <div
                  className="absolute bottom-6 left-0 right-0 text-center px-2"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 7,
                    letterSpacing: "0.12em",
                    color: accentColor,
                    textTransform: "uppercase",
                  }}
                >
                  Connecting…
                </div>
              )}
            </div>
          )}

          {!failed && (
            <img
              src={portraitUrl}
              alt={agentName}
              loading="eager"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.6s ease",
                objectFit: "cover",
                objectPosition: "center 12%",
                maskImage: FEATHER_MASK,
                WebkitMaskImage: FEATHER_MASK,
                filter: isTalking
                  ? "brightness(1.06) contrast(1.04) saturate(1.05)"
                  : "brightness(0.97) saturate(0.95)",
              }}
            />
          )}

          {isTalking && loaded && (
            <>
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "58%",
                  width: 28,
                  height: 14 * mouthHeights[mouthOpen],
                  marginLeft: -14,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.28)",
                  mixBlendMode: "multiply",
                  zIndex: 3,
                }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 0.15 }}
              />
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "52%",
                  width: 80,
                  height: 80,
                  marginLeft: -40,
                  borderRadius: "50%",
                  border: `1px solid ${accentColor}44`,
                  zIndex: 2,
                }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 0.35, repeat: Infinity }}
              />
            </>
          )}
        </motion.div>
      </motion.div>

      {showLabel && (
        <div
          className="mt-2 text-center pointer-events-none"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: accentColor,
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          {agentName}
          {isTalking && (
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 7, marginLeft: 6 }}>speaking</span>
          )}
        </div>
      )}
    </div>
  );
}
