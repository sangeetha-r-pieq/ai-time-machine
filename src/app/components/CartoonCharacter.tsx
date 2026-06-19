import { motion } from "motion/react";
import type { EraConfig } from "./era-config";

type PersonVariant = EraConfig["personVariant"];

const SKIN = "#FFD5B8";
const OUTLINE = "#2D3436";
const HAIR = "#4A3728";
const CHEEK = "#FFAB91";

interface Props {
  variant: PersonVariant;
  accentColor: string;
  isTalking?: boolean;
  avatarEmoji?: string;
}

function Face({ talking }: { talking?: boolean }) {
  return (
    <>
      <circle cx="50" cy="38" r="22" fill={SKIN} stroke={OUTLINE} strokeWidth="2.5" />
      <ellipse cx="50" cy="32" rx="20" ry="14" fill={HAIR} />
      <circle cx="42" cy="38" r="4" fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="58" cy="38" r="4" fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="43" cy="39" r="2" fill={OUTLINE} />
      <circle cx="59" cy="39" r="2" fill={OUTLINE} />
      <circle cx="35" cy="44" r="3" fill={CHEEK} opacity="0.55" />
      <circle cx="65" cy="44" r="3" fill={CHEEK} opacity="0.55" />
      {talking ? (
        <motion.ellipse
          cx="50"
          cy="48"
          rx="5"
          fill={OUTLINE}
          animate={{ ry: [1.5, 4.5, 1.5] }}
          transition={{ duration: 0.22, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <path d="M 43 47 Q 50 53 57 47" fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      )}
    </>
  );
}

function Body({ fill }: { fill: string }) {
  return (
    <>
      <path d="M 34 58 Q 50 54 66 58 L 70 98 Q 50 102 30 98 Z" fill={fill} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="38" y="98" width="10" height="22" rx="4" fill="#5D4037" stroke={OUTLINE} strokeWidth="2" />
      <rect x="52" y="98" width="10" height="22" rx="4" fill="#5D4037" stroke={OUTLINE} strokeWidth="2" />
    </>
  );
}

function Accessories({ variant, accent }: { variant: PersonVariant; accent: string }) {
  if (variant === "prehistoric") {
    return (
      <>
        <line x1="72" y1="20" x2="72" y2="95" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
        <polygon points="72,14 68,24 76,24" fill="#8D6E63" stroke={OUTLINE} strokeWidth="1.5" />
      </>
    );
  }
  if (variant === "ancient") {
    return (
      <>
        <rect x="38" y="56" width="24" height="6" rx="2" fill="#FFD54F" stroke={OUTLINE} strokeWidth="1.5" />
        <circle cx="50" cy="30" r="3" fill="#E53935" />
      </>
    );
  }
  if (variant === "medieval") {
    return (
      <path d="M 30 58 Q 50 50 70 58 L 68 72 Q 50 68 32 72 Z" fill="#FF8F00" stroke={OUTLINE} strokeWidth="2" opacity="0.9" />
    );
  }
  if (variant === "industrial") {
    return (
      <>
        <rect x="32" y="22" width="36" height="10" rx="3" fill="#455A64" stroke={OUTLINE} strokeWidth="2" />
        <rect x="36" y="60" width="28" height="5" fill="#FFD54F" stroke={OUTLINE} strokeWidth="1" />
      </>
    );
  }
  if (variant === "wartime") {
    return (
      <>
        <ellipse cx="50" cy="24" rx="18" ry="8" fill="#546E7A" stroke={OUTLINE} strokeWidth="2" />
        <rect x="44" y="56" width="12" height="8" rx="1" fill="#FF9933" stroke={OUTLINE} strokeWidth="1.5" />
      </>
    );
  }
  if (variant === "analog") {
    return (
      <>
        <rect x="36" y="34" width="28" height="8" rx="3" fill="none" stroke={OUTLINE} strokeWidth="2" />
        <circle cx="50" cy="38" r="2" fill={accent} />
        <rect x="40" y="56" width="20" height="14" rx="2" fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      </>
    );
  }
  if (variant === "future") {
    return (
      <>
        <path d="M 32 34 Q 50 26 68 34 L 66 42 Q 50 36 34 42 Z" fill={accent} stroke={OUTLINE} strokeWidth="2" opacity="0.7" />
        <rect x="38" y="56" width="24" height="12" rx="3" fill={accent} stroke={OUTLINE} strokeWidth="1.5" opacity="0.5" />
      </>
    );
  }
  return (
    <>
      <path d="M 28 58 L 22 88 L 32 88 Z" fill={accent} stroke={OUTLINE} strokeWidth="2" opacity="0.8" />
      <rect x="42" y="62" width="16" height="20" rx="2" fill="#37474F" stroke={OUTLINE} strokeWidth="1.5" />
      <rect x="44" y="64" width="12" height="8" rx="1" fill={accent} opacity="0.6" />
    </>
  );
}

export function CartoonCharacter({ variant, accentColor, isTalking, avatarEmoji }: Props) {
  return (
    <div className="relative" style={{ width: 100, height: 130 }}>
      {isTalking && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: -52, minWidth: 56 }}
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
        >
          <div
            style={{
              background: "#fff",
              border: `2.5px solid ${OUTLINE}`,
              borderRadius: 14,
              padding: "6px 12px",
              boxShadow: `3px 3px 0 ${OUTLINE}`,
              textAlign: "center",
            }}
          >
            {avatarEmoji ? (
              <span style={{ fontSize: 16 }}>{avatarEmoji}</span>
            ) : (
              <div className="flex gap-1 justify-center items-center h-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    style={{ width: 5, height: 5, borderRadius: "50%", background: accentColor }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              width: 12,
              height: 12,
              background: "#fff",
              border: `2.5px solid ${OUTLINE}`,
              borderTop: "none",
              borderLeft: "none",
              transform: "rotate(45deg)",
              margin: "-7px auto 0",
              boxShadow: "2px 2px 0 #2D3436",
            }}
          />
        </motion.div>
      )}

      <svg viewBox="0 0 100 130" width={100} height={130} style={{ display: "block", overflow: "visible" }}>
        <Body fill={accentColor} />
        <Face talking={isTalking} />
        <Accessories variant={variant} accent={accentColor} />
      </svg>
    </div>
  );
}
