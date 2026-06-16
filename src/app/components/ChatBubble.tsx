import { motion } from "motion/react";
import type { ReactNode } from "react";

const OUTLINE = "#2D3436";

interface ChatBubbleProps {
  isUser: boolean;
  background: string;
  borderColor: string;
  shadowColor?: string;
  children: ReactNode;
}

export function ChatBubble({ isUser, background, borderColor, shadowColor = OUTLINE, children }: ChatBubbleProps) {
  return (
    <div className={`relative ${isUser ? "ml-2" : "mr-2"}`}>
      {/* Comic tail */}
      <div
        className="absolute bottom-2"
        style={{
          [isUser ? "right" : "left"]: -6,
          width: 0,
          height: 0,
          borderTop: "8px solid transparent",
          borderBottom: "8px solid transparent",
          ...(isUser
            ? { borderLeft: `10px solid ${borderColor}` }
            : { borderRight: `10px solid ${borderColor}` }),
        }}
      />
      <div
        className="absolute bottom-2.5"
        style={{
          [isUser ? "right" : "left"]: -3,
          width: 0,
          height: 0,
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          ...(isUser
            ? { borderLeft: `8px solid ${background}` }
            : { borderRight: `8px solid ${background}` }),
        }}
      />

      <div
        style={{
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background,
          border: `2px solid ${borderColor}`,
          boxShadow: `3px 3px 0 ${shadowColor}`,
          color: "var(--text-primary)",
          fontSize: "13px",
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface TypingBubbleProps {
  background: string;
  borderColor: string;
  dotColor: string;
}

export function TypingBubble({ background, borderColor, dotColor }: TypingBubbleProps) {
  return (
    <ChatBubble isUser={false} background={background} borderColor={borderColor}>
      <div className="flex gap-1.5 items-center h-5 px-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, border: `1.5px solid ${OUTLINE}` }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </div>
    </ChatBubble>
  );
}

interface FunFactCardProps {
  accentColor: string;
  children: ReactNode;
}

export function FunFactCard({ accentColor, children }: FunFactCardProps) {
  return (
    <div
      className="mt-2 px-3 py-2 text-[10px] leading-relaxed"
      style={{
        background: "#FFFDE7",
        border: `2px solid ${accentColor}`,
        boxShadow: `2px 2px 0 ${OUTLINE}`,
        borderRadius: "4px 12px 12px 12px",
        color: "#37474F",
        transform: "rotate(-0.5deg)",
      }}
    >
      {children}
    </div>
  );
}
