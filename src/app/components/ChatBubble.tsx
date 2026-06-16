import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface ChatBubbleProps {
  isUser: boolean;
  accentColor: string;
  theme: "light" | "dark";
  children: ReactNode;
}

export function ChatBubble({ isUser, accentColor, theme, children }: ChatBubbleProps) {
  const isDark = theme === "dark";

  if (isUser) {
    return (
      <div
        style={{
          padding: "11px 16px",
          borderRadius: "20px 20px 6px 20px",
          background: `linear-gradient(135deg, ${accentColor}ee, ${accentColor}bb)`,
          color: "#fff",
          fontSize: "14px",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          boxShadow: `0 4px 16px ${accentColor}44`,
          maxWidth: "100%",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "11px 16px",
        borderRadius: "20px 20px 20px 6px",
        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.92)",
        border: isDark ? `1px solid ${accentColor}33` : `1px solid ${accentColor}22`,
        borderLeft: `3px solid ${accentColor}`,
        color: "var(--text-primary)",
        fontSize: "14px",
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.25)"
          : `0 4px 20px ${accentColor}12, 0 1px 3px rgba(0,0,0,0.06)`,
        backdropFilter: "blur(8px)",
        maxWidth: "100%",
      }}
    >
      {children}
    </div>
  );
}

interface TypingBubbleProps {
  accentColor: string;
  theme: "light" | "dark";
}

export function TypingBubble({ accentColor, theme }: TypingBubbleProps) {
  return (
    <ChatBubble isUser={false} accentColor={accentColor} theme={theme}>
      <div className="flex gap-1.5 items-center h-5 px-0.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.7,
            }}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </ChatBubble>
  );
}

interface FunFactCardProps {
  accentColor: string;
  theme: "light" | "dark";
  children: ReactNode;
}

export function FunFactCard({ accentColor, theme, children }: FunFactCardProps) {
  const isDark = theme === "dark";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex gap-2 items-start px-3 py-2.5 rounded-xl text-[12px] leading-relaxed"
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`
          : `linear-gradient(135deg, ${accentColor}12, #fffef5)`,
        border: `1px solid ${accentColor}33`,
        color: "var(--text-secondary)",
      }}
    >
      <Sparkles size={14} style={{ color: accentColor, flexShrink: 0, marginTop: 1 }} />
      <div>{children}</div>
    </motion.div>
  );
}

/** Large character avatar for message rows */
export function CharacterAvatar({
  emoji,
  color,
  size = 40,
  active,
}: {
  emoji: string;
  color: string;
  size?: number;
  active?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        background: `linear-gradient(145deg, ${color}28, ${color}12)`,
        border: `2px solid ${active ? color : `${color}55`}`,
        boxShadow: active ? `0 0 12px ${color}44` : `0 2px 8px ${color}22`,
        flexShrink: 0,
      }}
    >
      {emoji}
    </div>
  );
}
