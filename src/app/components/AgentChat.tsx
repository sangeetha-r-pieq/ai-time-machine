import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Mic, Volume2 } from "lucide-react";
import { type EraConfig, type Agent, formatYear } from "./era-config";
import { ERA_PROMPT_CHIPS } from "./era-hotspots";
import { playPingSound } from "./sounds";
import { playVoice, stopVoice } from "./voice";
import { fetchGroqReply, type ChatHistoryItem } from "../api";

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  agentColor: string;
  bubbleColor: string;
  text: string;
  isUser?: boolean;
}

async function getAgentReply(
  agent: Agent,
  year: number,
  question: string,
  history: ChatHistoryItem[] = []
): Promise<string> {
  const aiReply = await fetchGroqReply(agent.name, agent.role, year, question, history);
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
  onAwardSouvenir?: (eraId: string) => void;
  onAgentSpeaking?: (speaking: boolean) => void;
  theme: "light" | "dark";
}

export function AgentChat({ config, year, onReturn, onAwardSouvenir, onAgentSpeaking, theme }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevEra = useRef(config.id);
  const speakingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const promptChips = ERA_PROMPT_CHIPS[config.id] ?? [];

  // Voice Recognition states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Safari.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Arrival message when era changes
  useEffect(() => {
    if (prevEra.current !== config.id) {
      setMessages([]);
      prevEra.current = config.id;
    }
    const primary = config.agents[0];
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

  // Award souvenir after the user sends their first message and a response is received
  const userMessageCount = messages.filter(m => m.isUser).length;
  useEffect(() => {
    if (userMessageCount >= 1 && onAwardSouvenir) {
      const timer = setTimeout(() => {
        onAwardSouvenir(config.id);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [userMessageCount, config.id, onAwardSouvenir]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => () => {
    stopVoice();
    if (speakingTimer.current) clearTimeout(speakingTimer.current);
    onAgentSpeaking?.(false);
  }, [onAgentSpeaking]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");

    const currentHistory: ChatHistoryItem[] = messages
      .filter(m => !m.id.startsWith("arrival-"))
      .map(m => ({
        sender: m.isUser ? "user" : m.agentName,
        text: m.text,
      }));

    const userMsg: Message = {
      id: Date.now().toString(),
      agentId: "user",
      agentName: "You",
      agentColor: "var(--text-secondary)",
      bubbleColor: "var(--glass-bg)",
      text: trimmed,
      isUser: true,
    };
    setMessages(prev => [...prev, userMsg]);
    setBusy(true);
    onAgentSpeaking?.(true);

    const queue: { agent: Agent; delay: number }[] = [];
    config.agents.forEach((agent, idx) => {
      if (Math.random() < agent.probability) {
        queue.push({ agent, delay: 700 + idx * 900 + Math.random() * 400 });
      }
    });
    if (!queue.find(q => q.agent.id === config.agents[0].id)) {
      queue.unshift({ agent: config.agents[0], delay: 700 });
    }

    const lastDelay = Math.max(...queue.map(q => q.delay));
    let repliesReceived = 0;

    queue.forEach(({ agent, delay }) => {
      setTimeout(async () => {
        const reply = await getAgentReply(agent, year, trimmed, currentHistory);
        setMessages(prev => [...prev, {
          id: `${Date.now()}-${agent.id}`,
          agentId: agent.id,
          agentName: agent.name,
          agentColor: agent.color,
          bubbleColor: agent.bubbleColor,
          text: reply,
        }]);
        playPingSound(config.ambientFreq * 2);
        if (ttsEnabled && agent.id === config.agents[0].id) {
          playVoice(reply, config.id === "prehistoric" ? 0.8 : config.id === "future" ? 1.2 : 1);
        }
        repliesReceived++;
        if (repliesReceived >= queue.length) {
          speakingTimer.current = setTimeout(() => onAgentSpeaking?.(false), 2000);
        }
      }, delay);
    });

    setTimeout(() => setBusy(false), lastDelay + 2500);
  }, [busy, messages, config, year, ttsEnabled, onAgentSpeaking]);

  const send = () => sendMessage(input);

  return (
    <div
      className="absolute left-0 right-0 bottom-0 flex flex-col rounded-t-3xl backdrop-blur-md"
      style={{
        zIndex: 10,
        height: "45%",
        maxWidth: 660,
        margin: "0 auto",
        right: 0,
        left: 0,
        background: theme === "dark" 
          ? "linear-gradient(to bottom, rgba(10, 10, 15, 0.75), rgba(5, 5, 5, 0.92))" 
          : "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.95))",
        borderTop: "1px solid var(--border-color)",
        borderLeft: "1px solid var(--border-color-subtle)",
        borderRight: "1px solid var(--border-color-subtle)",
        boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.25)",
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
                    background: msg.isUser ? "var(--glass-bg)" : msg.bubbleColor,
                    border: `1px solid ${msg.isUser ? "var(--border-color)" : "var(--border-color-subtle)"}`,
                    color: "var(--text-primary)",
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
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", borderRadius: "2px 12px 12px 12px", background: "var(--glass-bg)", border: "1px solid var(--border-color-subtle)" }}>
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

      {/* Prompt chips */}
      {promptChips.length > 0 && messages.filter(m => m.isUser).length === 0 && (
        <div className="shrink-0 flex gap-2 px-4 pb-2 overflow-x-auto">
          {promptChips.map(chip => (
            <motion.button
              key={chip}
              type="button"
              onClick={() => sendMessage(chip)}
              disabled={busy}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                padding: "5px 12px",
                borderRadius: 16,
                whiteSpace: "nowrap",
                background: `${config.accentColor}15`,
                border: `1px solid ${config.accentColor}44`,
                color: config.accentColor,
                cursor: busy ? "default" : "pointer",
                opacity: busy ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 pb-4 pt-2"
        style={{ borderTop: `1px solid var(--border-color-subtle)` }}
      >
        {/* Back button */}
        <button
          onClick={onReturn}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "var(--text-primary)",
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            padding: "6px 12px",
            borderRadius: 6,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.borderColor = "var(--text-primary)";
            e.currentTarget.style.background = "var(--glass-bg-hover)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.background = "var(--glass-bg)";
          }}
        >
          ← JUMP
        </button>

        {/* Input box wrapper for contrast */}
        <div
          className="flex-1 flex items-center rounded-lg border px-3 py-1.5"
          style={{
            background: theme === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.6)",
            borderColor: "var(--border-color)",
          }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={`Ask about ${formatYear(year)}…`}
            className="flex-1 bg-transparent outline-none"
            style={{
              color: "var(--text-primary)",
              fontSize: "13px",
              fontFamily: config.fontFamily,
              minWidth: 0,
            }}
          />
        </div>

        {/* TTS toggle */}
        <motion.button
          onClick={() => setTtsEnabled(v => !v)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: 34, height: 34,
            borderRadius: "50%",
            background: ttsEnabled ? `${config.accentColor}22` : "var(--glass-bg)",
            border: ttsEnabled ? `1px solid ${config.accentColor}55` : "1px solid var(--border-color-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
          title={ttsEnabled ? "Voice on" : "Voice off"}
        >
          <Volume2 size={14} color={ttsEnabled ? config.accentColor : "var(--text-muted)"} />
        </motion.button>

        {/* Mic button */}
        <motion.button
          onClick={toggleListening}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: 34, height: 34,
            borderRadius: "50%",
            background: isListening ? "rgba(239, 68, 68, 0.2)" : "var(--glass-bg)",
            border: isListening ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--border-color-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          title="Voice input"
        >
          <Mic size={14} color={isListening ? "#ef4444" : "var(--text-secondary)"} className={isListening ? "animate-pulse" : ""} />
        </motion.button>

        {/* Send button */}
        <motion.button
          onClick={send}
          disabled={!input.trim() || busy}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: 34, height: 34,
            borderRadius: "50%",
            background: input.trim() && !busy ? config.accentColor : "var(--glass-bg)",
            border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() && !busy ? "pointer" : "default",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <ArrowUp size={14} color={input.trim() && !busy ? "#000" : "var(--text-muted)"} />
        </motion.button>
      </div>
    </div>
  );
}
