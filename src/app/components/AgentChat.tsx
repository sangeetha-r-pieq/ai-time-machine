import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { type EraConfig, type Agent, formatYear } from "./era-config";
import { playPingSound } from "./sounds";

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  agentColor: string;
  bubbleColor: string;
  text: string;
  isUser?: boolean;
}

import { fetchGroqReply } from "../api";

async function getAgentReply(agent: Agent, year: number, question: string): Promise<string> {
  // If it matches a strict trigger, we can optionally still use the fast local fallback,
  // but to use AI we'll just call Groq.
  const aiReply = await fetchGroqReply(agent.name, agent.role, year, question);
  if (aiReply !== "...") return aiReply;
  
  // Fallback if Groq fails
  for (const { triggers, reply } of agent.responses) {
    if (triggers.some(r => r.test(question))) return reply;
  }
  const fb = agent.fallback;
  return fb[Math.floor(Math.random() * fb.length)];
}

interface Props {
  config: EraConfig;
  year: number;
  onReturn: () => void;
}

export function AgentChat({ config, year, onReturn }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevEra = useRef(config.id);

  // Arrival message when era changes
  useEffect(() => {
    if (prevEra.current !== config.id) {
      setMessages([]);
      prevEra.current = config.id;
    }
    const primary = config.agents[0];
    const arrival = primary.responses[0]?.reply ?? primary.fallback[0];
    // Use fallback as arrival message (first fallback is often introductory)
    const introMsg: Message = {
      id: `arrival-${config.id}`,
      agentId: primary.id,
      agentName: primary.name,
      agentColor: primary.color,
      bubbleColor: primary.bubbleColor,
      text: primary.fallback[Math.floor(Math.random() * primary.fallback.length)],
    };
    setTimeout(() => {
      setMessages([introMsg]);
      playPingSound(config.ambientFreq * 2);
    }, 700);
  }, [config.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      agentId: "user",
      agentName: "You",
      agentColor: "rgba(255,255,255,0.45)",
      bubbleColor: "rgba(255,255,255,0.07)",
      text,
      isUser: true,
    };
    setMessages(prev => [...prev, userMsg]);
    setBusy(true);

    // Queue agents to respond
    const queue: { agent: Agent; delay: number }[] = [];
    config.agents.forEach((agent, idx) => {
      if (Math.random() < agent.probability) {
        queue.push({ agent, delay: 700 + idx * 900 + Math.random() * 400 });
      }
    });
    // Always ensure at least primary responds
    if (!queue.find(q => q.agent.id === config.agents[0].id)) {
      queue.unshift({ agent: config.agents[0], delay: 700 });
    }

    const lastDelay = Math.max(...queue.map(q => q.delay));
    queue.forEach(({ agent, delay }) => {
      setTimeout(async () => {
        const reply = await getAgentReply(agent, year, text);
        setMessages(prev => [...prev, {
          id: `${Date.now()}-${agent.id}`,
          agentId: agent.id,
          agentName: agent.name,
          agentColor: agent.color,
          bubbleColor: agent.bubbleColor,
          text: reply,
        }]);
        playPingSound(config.ambientFreq * 2);
      }, delay);
    });

    // We can't strictly know when all async calls finish based on lastDelay anymore,
    // so let's just use a reasonably long timeout or keep busy true until the last promise resolves.
    // For simplicity, we just add 2000ms.
    setTimeout(() => setBusy(false), lastDelay + 2500);
  };

  return (
    <div
      className="absolute left-0 right-0 bottom-0 flex flex-col"
      style={{
        zIndex: 10,
        height: "44%",
        maxWidth: 640,
        margin: "0 auto",
        right: 0,
        left: 0,
      }}
    >
      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div style={{ maxWidth: "88%" }}>
                {!msg.isUser && (
                  <div
                    className="mb-1"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      color: msg.agentColor,
                      textTransform: "uppercase",
                    }}
                  >
                    {msg.agentName}
                  </div>
                )}
                <div
                  style={{
                    padding: "9px 13px",
                    borderRadius: msg.isUser ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
                    background: msg.isUser ? "rgba(255,255,255,0.08)" : msg.bubbleColor,
                    border: `1px solid ${msg.isUser ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
                    color: msg.isUser ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)",
                    fontSize: "13px",
                    lineHeight: "1.65",
                    fontFamily: config.fontFamily,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {busy && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", borderRadius: "2px 12px 12px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    style={{ width: 5, height: 5, borderRadius: "50%", background: config.accentColor }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 pb-4 pt-2"
        style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}
      >
        {/* Back button */}
        <button
          onClick={onReturn}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.25)",
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "5px 10px",
            borderRadius: 4,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ← JUMP
        </button>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={`Ask about ${formatYear(year)}…`}
          className="flex-1 bg-transparent outline-none"
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "13px",
            fontFamily: config.fontFamily,
            minWidth: 0,
          }}
        />

        <motion.button
          onClick={send}
          disabled={!input.trim() || busy}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: 30, height: 30,
            borderRadius: "50%",
            background: input.trim() && !busy ? config.accentColor : "rgba(255,255,255,0.06)",
            border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() && !busy ? "pointer" : "default",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <ArrowUp size={14} color={input.trim() && !busy ? "#000" : "#444"} />
        </motion.button>
      </div>
    </div>
  );
}
