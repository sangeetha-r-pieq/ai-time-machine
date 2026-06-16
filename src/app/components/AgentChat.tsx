import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Mic, Volume2, Copy, Trash2, Target, CheckCircle2 } from "lucide-react";
import { type EraConfig, type Agent, formatYear } from "./era-config";
import { ERA_PROMPT_CHIPS, ERA_HOTSPOTS } from "./era-hotspots";
import { ERA_MISSIONS } from "./era-missions";
import { getAgentPersonality } from "./agent-personalities";
import { getYearContext } from "./year-context";
import { loadChat, saveChat, clearChat, type StoredMessage } from "./chat-storage";
import { formatMessageText } from "./message-format";
import { playPingSound } from "./sounds";
import { playVoice, stopVoice } from "./voice";
import { fetchAgentChat, streamReplyText, type ChatHistoryItem } from "../api";
import { useTravel } from "../../context/TravelContext";

interface Message extends StoredMessage {
  streaming?: boolean;
}

interface Props {
  config: EraConfig;
  year: number;
  onReturn: () => void;
  onAwardSouvenir?: (eraId: string) => void;
  onAgentSpeaking?: (speaking: boolean) => void;
  onSceneReaction?: (reaction: string) => void;
  theme: "light" | "dark";
}

function fallbackReply(agent: Agent, question: string): string {
  for (const { triggers, reply } of agent.responses) {
    if (triggers.some(r => r.test(question))) return reply;
  }
  return agent.fallback[Math.floor(Math.random() * agent.fallback.length)];
}

export function AgentChat({
  config,
  year,
  onReturn,
  onAwardSouvenir,
  onAgentSpeaking,
  onSceneReaction,
  theme,
}: Props) {
  const { state, updateMemory, addJourney } = useTravel();
  const mission = ERA_MISSIONS[config.id];
  const yearContext = getYearContext(year);
  const hotspots = ERA_HOTSPOTS[config.id] ?? [];

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState(config.agents[0].id);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [missionComplete, setMissionComplete] = useState(false);
  const [followUpChips, setFollowUpChips] = useState<string[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevEra = useRef(config.id);
  const hydrated = useRef(false);
  const journeyLogged = useRef(false);

  const selectedAgent = config.agents.find(a => a.id === selectedAgentId) ?? config.agents[0];
  const defaultChips = ERA_PROMPT_CHIPS[config.id] ?? [];
  const activeChips = followUpChips.length > 0 ? followUpChips : defaultChips;

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (prevEra.current !== config.id) {
      prevEra.current = config.id;
      hydrated.current = false;
      journeyLogged.current = false;
    }

    const stored = loadChat(config.id);
    if (stored && !hydrated.current) {
      setMessages(stored.messages);
      setSelectedAgentId(stored.selectedAgentId);
      setMissionComplete(stored.missionComplete);
      hydrated.current = true;
      return;
    }

    if (!hydrated.current) {
      const primary = config.agents[0];
      const intro: Message = {
        id: `arrival-${config.id}`,
        agentId: primary.id,
        agentName: primary.name,
        agentColor: primary.color,
        bubbleColor: primary.bubbleColor,
        text: primary.fallback[Math.floor(Math.random() * primary.fallback.length)],
      };
      setMessages([intro]);
      setSelectedAgentId(primary.id);
      setMissionComplete(false);
      setFollowUpChips([]);
      journeyLogged.current = false;
      hydrated.current = true;
    }
  }, [config.id, config.agents]);

  useEffect(() => {
    if (!hydrated.current || messages.length === 0) return;
    saveChat(config.id, { messages, missionComplete, selectedAgentId });
  }, [messages, missionComplete, selectedAgentId, config.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, typingAgent]);

  useEffect(() => () => {
    stopVoice();
    onAgentSpeaking?.(false);
  }, [onAgentSpeaking]);

  const buildHistory = useCallback(
    (msgs: Message[], agentName: string): ChatHistoryItem[] =>
      msgs
        .filter(m => m.isUser || m.agentName === agentName)
        .filter(m => !m.streaming)
        .filter(m => !m.id.startsWith("arrival-") || m.agentName === agentName)
        .map(m => ({ sender: m.isUser ? "user" : m.agentName, text: m.text, isUser: !!m.isUser })),
    []
  );

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    setChatError(null);

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
    setTypingAgent(selectedAgent.name);
    onAgentSpeaking?.(true);

    updateMemory(`lastQuestion-${config.id}`, trimmed);
    updateMemory(`visited-${config.id}`, year);
    if (!journeyLogged.current) {
      addJourney({ destination: config.name, year: String(year), timestamp: Date.now(), mission: mission.title });
      journeyLogged.current = true;
    }

    const history = buildHistory([...messages, userMsg], selectedAgent.name);
    const personality = getAgentPersonality(config.id, selectedAgent.id);

    const travelerMemory: string[] = [];
    Object.entries(state.memory).forEach(([k, v]) => {
      if (k.startsWith("lastQuestion-") && k !== `lastQuestion-${config.id}`) {
        travelerMemory.push(`Previously asked in another era: "${v}"`);
      }
    });
    if (state.passport.length > 1) {
      travelerMemory.push(`Has visited ${state.passport.length} destinations across time.`);
    }

    let response = await fetchAgentChat({
      agentName: selectedAgent.name,
      agentRole: selectedAgent.role,
      agentId: selectedAgent.id,
      eraId: config.id,
      eraName: config.name,
      year,
      yearHeadline: yearContext.headline,
      yearDetail: yearContext.detail,
      personality,
      missionTitle: mission.title,
      missionGoal: mission.goal,
      hotspotLore: hotspots.map(h => `${h.label}: ${h.lore}`),
      travelerMemory,
      question: trimmed,
      history,
      missionAlreadyComplete: missionComplete,
    });

    if (response.reply.includes("timestream is unstable")) {
      response = {
        ...response,
        reply: fallbackReply(selectedAgent, trimmed),
        fun_fact: response.fun_fact || `In ${year}, life was vastly different from today.`,
      };
      setChatError("Connection unstable — showing local archive response.");
    }

    const msgId = `${Date.now()}-${selectedAgent.id}`;
    setMessages(prev => [...prev, {
      id: msgId,
      agentId: selectedAgent.id,
      agentName: selectedAgent.name,
      agentColor: selectedAgent.color,
      bubbleColor: selectedAgent.bubbleColor,
      text: "",
      funFact: response.fun_fact,
      streaming: true,
    }]);

    await streamReplyText(response.reply, partial => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: partial } : m));
    });

    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, text: response.reply, streaming: false } : m
    ));

    setFollowUpChips(response.follow_up_chips);
    playPingSound(config.ambientFreq * 2);

    if (ttsEnabled) {
      playVoice(response.reply, config.id === "prehistoric" ? 0.85 : config.id === "future" ? 1.15 : 1);
    }

    if (response.scene_reaction && response.scene_reaction !== "none") {
      onSceneReaction?.(response.scene_reaction);
    }

    const keywordMatch = mission.keywords.some(kw => trimmed.toLowerCase().includes(kw));
    if ((response.mission_complete || keywordMatch) && !missionComplete) {
      setMissionComplete(true);
      onAwardSouvenir?.(config.id);
    }

    setTypingAgent(null);
    setBusy(false);
    onAgentSpeaking?.(false);
  }, [
    busy, messages, selectedAgent, config, year, yearContext, mission, hotspots,
    missionComplete, buildHistory, onAwardSouvenir, onAgentSpeaking, onSceneReaction,
    ttsEnabled, state, updateMemory, addJourney,
  ]);

  const handleClearChat = () => {
    clearChat(config.id);
    const primary = config.agents[0];
    setMessages([{
      id: `arrival-${config.id}-${Date.now()}`,
      agentId: primary.id,
      agentName: primary.name,
      agentColor: primary.color,
      bubbleColor: primary.bubbleColor,
      text: primary.fallback[Math.floor(Math.random() * primary.fallback.length)],
    }]);
    setMissionComplete(false);
    setFollowUpChips([]);
    setChatError(null);
  };

  const copyMessage = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  return (
    <div
      className="absolute left-0 right-0 bottom-0 flex flex-col rounded-t-3xl backdrop-blur-md"
      style={{
        zIndex: 10,
        height: "48%",
        maxWidth: 680,
        margin: "0 auto",
        background: theme === "dark"
          ? "linear-gradient(to bottom, rgba(10, 10, 15, 0.78), rgba(5, 5, 5, 0.94))"
          : "linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(248, 250, 252, 0.97))",
        borderTop: "1px solid var(--border-color)",
        boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="shrink-0 px-4 py-2 flex items-center gap-2 border-b" style={{ borderColor: "var(--border-color-subtle)" }}>
        <Target size={12} color={config.accentColor} />
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: config.accentColor }}>
            {missionComplete ? "Mission Complete" : mission.title}
          </div>
          <div className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>{mission.goal}</div>
        </div>
        {missionComplete && <CheckCircle2 size={14} color={config.accentColor} />}
        <button type="button" onClick={handleClearChat} title="Clear chat" className="p-1.5 rounded-md cursor-pointer" style={{ color: "var(--text-muted)", background: "var(--glass-bg)" }}>
          <Trash2 size={12} />
        </button>
      </div>

      <div className="shrink-0 flex gap-2 px-4 py-2 overflow-x-auto border-b" style={{ borderColor: "var(--border-color-subtle)" }}>
        {config.agents.map(agent => (
          <button
            key={agent.id}
            type="button"
            onClick={() => setSelectedAgentId(agent.id)}
            disabled={busy}
            className="shrink-0 px-3 py-1 rounded-full font-mono text-[9px] tracking-wider uppercase cursor-pointer"
            style={{
              background: selectedAgentId === agent.id ? `${agent.color}22` : "var(--glass-bg)",
              border: `1px solid ${selectedAgentId === agent.id ? agent.color : "var(--border-color-subtle)"}`,
              color: selectedAgentId === agent.id ? agent.color : "var(--text-secondary)",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {agent.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {chatError && (
          <div className="text-[10px] text-center py-1 px-2 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>{chatError}</div>
        )}
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} group`}>
              <div style={{ maxWidth: "90%" }}>
                {!msg.isUser && (
                  <div className="mb-1 font-mono text-[9px] tracking-widest uppercase" style={{ color: msg.agentColor }}>{msg.agentName}</div>
                )}
                <div className="relative">
                  <div style={{
                    padding: "9px 13px",
                    borderRadius: msg.isUser ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
                    background: msg.isUser ? "var(--glass-bg)" : msg.bubbleColor,
                    border: `1px solid ${msg.isUser ? "var(--border-color)" : "var(--border-color-subtle)"}`,
                    color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.65,
                    fontFamily: config.fontFamily, whiteSpace: "pre-wrap", wordBreak: "break-word",
                  }}>
                    {formatMessageText(msg.text)}
                    {msg.streaming && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>▍</motion.span>}
                  </div>
                  {!msg.isUser && msg.text && !msg.streaming && (
                    <button type="button" onClick={() => copyMessage(msg.text)} className="absolute -right-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer" style={{ color: "var(--text-muted)" }} title="Copy">
                      <Copy size={10} />
                    </button>
                  )}
                </div>
                {msg.funFact && !msg.streaming && (
                  <div className="mt-1.5 px-2.5 py-1.5 rounded-lg text-[10px] leading-relaxed" style={{ background: `${config.accentColor}12`, border: `1px solid ${config.accentColor}33`, color: "var(--text-secondary)" }}>
                    <span style={{ color: config.accentColor, fontWeight: 600 }}>Did you know? </span>{msg.funFact}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {typingAgent && (
            <div className="font-mono text-[9px]" style={{ color: selectedAgent.color }}>{typingAgent} is thinking...</div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {activeChips.length > 0 && (
        <div className="shrink-0 flex gap-2 px-4 pb-2 overflow-x-auto">
          {activeChips.map(chip => (
            <motion.button key={chip} type="button" onClick={() => sendMessage(chip)} disabled={busy}
              className="font-mono text-[10px] px-3 py-1 rounded-full whitespace-nowrap shrink-0 cursor-pointer"
              style={{ background: `${config.accentColor}15`, border: `1px solid ${config.accentColor}44`, color: config.accentColor, opacity: busy ? 0.5 : 1 }}>
              {chip}
            </motion.button>
          ))}
        </div>
      )}

      <div className="shrink-0 flex items-center gap-2 px-4 pb-4 pt-2 border-t" style={{ borderColor: "var(--border-color-subtle)" }}>
        <button onClick={onReturn} className="font-mono text-[10px] tracking-widest px-2.5 py-1.5 rounded-md cursor-pointer shrink-0" style={{ background: "var(--glass-bg)", border: "1px solid var(--border-color)" }}>← JUMP</button>
        <div className="flex-1 flex items-center rounded-lg border px-3 py-1.5" style={{ background: theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.6)", borderColor: "var(--border-color)" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder={`Ask ${selectedAgent.name} about ${formatYear(year)}…`} disabled={busy}
            className="flex-1 bg-transparent outline-none min-w-0" style={{ color: "var(--text-primary)", fontSize: "13px", fontFamily: config.fontFamily }} />
        </div>
        <motion.button onClick={() => setTtsEnabled(v => !v)} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shrink-0" style={{ background: ttsEnabled ? `${config.accentColor}22` : "var(--glass-bg)" }}>
          <Volume2 size={13} color={ttsEnabled ? config.accentColor : "var(--text-muted)"} />
        </motion.button>
        <motion.button onClick={toggleListening} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shrink-0" style={{ background: isListening ? "rgba(239,68,68,0.2)" : "var(--glass-bg)" }}>
          <Mic size={13} color={isListening ? "#ef4444" : "var(--text-secondary)"} />
        </motion.button>
        <motion.button onClick={() => sendMessage(input)} disabled={!input.trim() || busy} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer" style={{ background: input.trim() && !busy ? config.accentColor : "var(--glass-bg)" }}>
          <ArrowUp size={13} color={input.trim() && !busy ? "#000" : "var(--text-muted)"} />
        </motion.button>
      </div>
    </div>
  );
}
