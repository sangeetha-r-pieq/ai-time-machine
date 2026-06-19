import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Mic, Volume2, Copy, Trash2, Target, CheckCircle2, ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { type EraConfig, type Agent, getAgentGreeting, getAgentFallbackReply } from "./era-config";
import { ERA_PROMPT_CHIPS, ERA_HOTSPOTS, FUN_PROMPT_CHIPS } from "./era-hotspots";
import { ERA_MISSIONS } from "./era-missions";
import { getAgentPersonality } from "./agent-personalities";
import { getAgentAvatar } from "./india-content";
import { pollinationsUrl, getChatImage } from "./image-utils";
import { getAgentGender, getAgentVoiceProfile, genderIcon, genderLabel } from "./agent-voices";
import { ChatBubble, TypingBubble, FunFactCard, CharacterAvatar } from "./ChatBubble";
import { formatMessageText } from "./message-format";
import { playPingSound, stopAmbient } from "./sounds";
import { playVoice, stopVoice, simulateSpeechPulses } from "./voice";
import { fetchAgentChat, streamReplyText, type ChatHistoryItem } from "../api";
import { useTravel } from "../../context/TravelContext";
import { getYearContext } from "./year-context";
import { loadChat, saveChat, clearChat, type StoredMessage } from "./chat-storage";
import { useWideLayout } from "../hooks/useWideLayout";

interface Message extends StoredMessage {
  streaming?: boolean;
}

interface Props {
  config: EraConfig;
  year: number;
  onReturn: () => void;
  onAwardSouvenir?: (eraId: string) => void;
  onAgentSpeaking?: (speaking: boolean) => void;
  onSpeakPulse?: () => void;
  onActiveAgentChange?: (agentId: string) => void;
  onSceneReaction?: (reaction: string) => void;
  theme: "light" | "dark";
}

const CHAT_HEIGHT_KEY = "ai-time-machine-chat-height";
const DEFAULT_CHAT_HEIGHT = 72;
const MIN_CHAT_HEIGHT = 50;
const MAX_CHAT_HEIGHT = 90;

function displayName(_config: EraConfig, agent: Agent): string {
  return agent.name;
}

export function AgentChat({
  config,
  year,
  onReturn,
  onAwardSouvenir,
  onAgentSpeaking,
  onSpeakPulse,
  onActiveAgentChange,
  onSceneReaction,
  theme,
}: Props) {
  const { state, updateMemory, addJourney } = useTravel();
  const mission = ERA_MISSIONS[config.id];
  const yearContext = getYearContext(year);
  const hotspots = ERA_HOTSPOTS[config.id] ?? [];
  const isWide = useWideLayout();

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState(config.agents[0].id);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [missionComplete, setMissionComplete] = useState(false);
  const [followUpChips, setFollowUpChips] = useState<string[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [panelHeight, setPanelHeight] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_HEIGHT_KEY);
      const n = saved ? Number(saved) : DEFAULT_CHAT_HEIGHT;
      return Number.isFinite(n) ? Math.min(MAX_CHAT_HEIGHT, Math.max(MIN_CHAT_HEIGHT, n)) : DEFAULT_CHAT_HEIGHT;
    } catch {
      return DEFAULT_CHAT_HEIGHT;
    }
  });
  const [headerCompact, setHeaderCompact] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  const panelHeightRef = useRef(panelHeight);
  const prevEra = useRef(config.id);
  const prevYear = useRef(year);
  const hydrated = useRef(false);
  const journeyLogged = useRef(false);

  const selectedAgent = config.agents.find(a => a.id === selectedAgentId) ?? config.agents[0];
  const defaultChips = ERA_PROMPT_CHIPS[config.id] ?? [];
  const activeChips = followUpChips.length > 0
    ? followUpChips
    : [FUN_PROMPT_CHIPS[0], defaultChips[0], defaultChips[1]].filter(Boolean);

  useEffect(() => {
    stopAmbient();
  }, []);

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
    panelHeightRef.current = panelHeight;
  }, [panelHeight]);

  useEffect(() => {
    if (prevEra.current !== config.id || prevYear.current !== year) {
      prevEra.current = config.id;
      prevYear.current = year;
      hydrated.current = false;
      journeyLogged.current = false;
    }

    const stored = loadChat(config.id, year);
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
        text: getAgentGreeting(primary),
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
    saveChat(config.id, year, { messages, missionComplete, selectedAgentId });
  }, [messages, missionComplete, selectedAgentId, config.id, year]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, typingAgent]);

  useEffect(() => {
    onActiveAgentChange?.(selectedAgentId);
  }, [selectedAgentId, onActiveAgentChange]);

  const speakWithScene = useCallback(async (text: string, agent: Agent) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (ttsEnabled) {
      await playVoice(trimmed, getAgentVoiceProfile(config.id, agent.id), {
        onStart: () => onAgentSpeaking?.(true),
        onEnd: () => onAgentSpeaking?.(false),
        onPulse: () => onSpeakPulse?.(),
      });
      return;
    }

    await simulateSpeechPulses(trimmed, {
      onStart: () => onAgentSpeaking?.(true),
      onEnd: () => onAgentSpeaking?.(false),
      onPulse: () => onSpeakPulse?.(),
    });
  }, [ttsEnabled, config.id, onAgentSpeaking, onSpeakPulse]);

  useEffect(() => () => {
    stopVoice();
    onAgentSpeaking?.(false);
  }, [onAgentSpeaking]);

  const buildHistory = useCallback(
    (msgs: Message[], agentId: string): ChatHistoryItem[] => {
      const agent = config.agents.find(a => a.id === agentId) ?? config.agents[0];
      const items: ChatHistoryItem[] = [];
      for (let i = 0; i < msgs.length; i++) {
        const m = msgs[i];
        if (m.streaming || m.id.startsWith("arrival-")) continue;
        if (m.isUser) {
          const next = msgs[i + 1];
          if (next && !next.isUser && next.agentId === agentId) {
            items.push({ sender: "user", text: m.text, isUser: true });
          }
        } else if (m.agentId === agentId) {
          items.push({ sender: agent.name, text: m.text, isUser: false });
        }
      }
      return items;
    },
    [config.agents]
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
    if (!messages.some(m => m.isUser)) {
      setPanelHeight(h => Math.max(h, 78));
      setHeaderCompact(true);
    }
    setBusy(true);
    setTypingAgent(selectedAgent.name);

    updateMemory(`lastQuestion-${config.id}`, trimmed);
    updateMemory(`visited-${config.id}`, year);
    if (!journeyLogged.current) {
      addJourney({ destination: config.name, year: String(year), timestamp: Date.now(), mission: mission.title });
      journeyLogged.current = true;
    }

    const history = buildHistory(messages, selectedAgent.id);
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
        reply: getAgentFallbackReply(selectedAgent, trimmed),
        fun_fact: response.fun_fact || yearContext.detail,
      };
      setChatError(
        response.apiError
          ?? "Could not reach Groq AI — showing a local canned reply instead. Check your API key or try again."
      );
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

    const imgUrl = await getChatImage(response.image_keyword, response.image_prompt);

    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, text: response.reply, imageUrl: imgUrl, streaming: false } : m
    ));

    setFollowUpChips(response.follow_up_chips);
    playPingSound(config.ambientFreq * 2);

    await speakWithScene(response.reply, selectedAgent);

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
  }, [
    busy, messages, selectedAgent, config, year, yearContext, mission, hotspots,
    missionComplete, buildHistory, onAwardSouvenir, onSceneReaction,
    speakWithScene, state, updateMemory, addJourney,
  ]);

  const switchAgent = useCallback((agent: Agent) => {
    if (busy || agent.id === selectedAgentId) return;
    stopVoice();
    onAgentSpeaking?.(false);
    setSelectedAgentId(agent.id);
    const line = getAgentGreeting(agent);
    void speakWithScene(line.length > 120 ? `${line.slice(0, 120)}…` : line, agent);
  }, [busy, selectedAgentId, speakWithScene, onAgentSpeaking]);

  const handleClearChat = () => {
    clearChat(config.id, year);
    const primary = config.agents[0];
    setMessages([{
      id: `arrival-${config.id}-${Date.now()}`,
      agentId: primary.id,
      agentName: primary.name,
      agentColor: primary.color,
      bubbleColor: primary.bubbleColor,
      text: getAgentGreeting(primary),
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

  const persistPanelHeight = (h: number) => {
    try {
      sessionStorage.setItem(CHAT_HEIGHT_KEY, String(Math.round(h)));
    } catch { /* ignore */ }
  };

  const cyclePanelHeight = () => {
    setPanelHeight(h => {
      const next = h < 72 ? 78 : h < 82 ? 88 : DEFAULT_CHAT_HEIGHT;
      persistPanelHeight(next);
      return next;
    });
  };

  const onResizeStart = (e: React.PointerEvent) => {
    dragRef.current = { startY: e.clientY, startH: panelHeight };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const deltaPx = dragRef.current.startY - e.clientY;
    const deltaPct = (deltaPx / window.innerHeight) * 100;
    const next = Math.min(MAX_CHAT_HEIGHT, Math.max(MIN_CHAT_HEIGHT, dragRef.current.startH + deltaPct));
    setPanelHeight(next);
  };

  const onResizeEnd = () => {
    if (dragRef.current) persistPanelHeight(panelHeightRef.current);
    dragRef.current = null;
  };

  const hasConversation = messages.some(m => m.isUser);

  return (
    <div
      className={`absolute flex flex-col ${
        isWide
          ? "right-0 top-0 bottom-0 left-auto w-[min(440px,42vw)]"
          : "left-0 right-0 bottom-0 w-full max-w-[min(920px,96vw)] mx-auto"
      }`}
      style={{
        zIndex: 10,
        height: isWide ? "100%" : `${panelHeight}vh`,
        maxHeight: isWide ? "100%" : `${MAX_CHAT_HEIGHT}vh`,
        borderRadius: isWide ? 0 : "28px 28px 0 0",
        background: theme === "dark"
          ? "linear-gradient(to bottom, rgba(12, 14, 22, 0.92), rgba(6, 8, 14, 0.98))"
          : "linear-gradient(to bottom, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.98))",
        borderTop: isWide ? undefined : `1px solid ${config.accentColor}33`,
        borderLeft: isWide ? `1px solid ${config.accentColor}33` : undefined,
        boxShadow: isWide
          ? `-8px 0 32px rgba(0,0,0,0.25), 0 0 0 1px ${config.accentColor}11 inset`
          : `0 -8px 40px rgba(0,0,0,0.2), 0 0 0 1px ${config.accentColor}11 inset`,
        backdropFilter: "blur(20px)",
        overflow: "hidden",
      }}
    >
      {/* Resize handle — mobile/tablet bottom sheet only */}
      {!isWide && (
      <div
        className="shrink-0 flex justify-center items-center gap-3 pt-2 pb-1 cursor-ns-resize touch-none select-none"
        onPointerDown={onResizeStart}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        title="Drag to resize · tap Expand for more space"
      >
        <div style={{ width: 40, height: 5, borderRadius: 4, background: `${config.accentColor}55` }} />
        <button
          type="button"
          onClick={e => { e.stopPropagation(); cyclePanelHeight(); }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md cursor-pointer text-[9px] font-medium"
          style={{ color: config.accentColor, background: `${config.accentColor}12` }}
          title="Expand chat"
        >
          <Maximize2 size={10} />
          {panelHeight >= 82 ? "Compact" : "Expand"}
        </button>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); setHeaderCompact(v => !v); }}
          className="p-1 rounded-md cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          title={headerCompact ? "Show details" : "Hide details"}
        >
          {headerCompact ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
        {headerCompact && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); handleClearChat(); }}
            className="p-1 rounded-md cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            title="Clear chat"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      )}

      {isWide && (
        <div className="shrink-0 flex justify-end items-center gap-1 px-3 pt-3 pb-1">
          <button
            type="button"
            onClick={() => setHeaderCompact(v => !v)}
            className="p-1.5 rounded-md cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            title={headerCompact ? "Show mission" : "Hide mission"}
          >
            {headerCompact ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-md cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            title="Clear chat"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {!headerCompact && !hasConversation && (
        <div
          className="shrink-0 mx-4 mb-2 px-3 py-1.5 flex items-center gap-2 rounded-xl"
          style={{
            background: `${config.accentColor}10`,
            border: `1px solid ${config.accentColor}25`,
          }}
        >
          <Target size={12} color={config.accentColor} />
          <div className="flex-1 min-w-0 text-[10px] truncate" style={{ color: missionComplete ? config.accentColor : "var(--text-secondary)" }}>
            {missionComplete ? "✓ Mission complete" : `${mission.title} — ${mission.goal}`}
          </div>
          {missionComplete && <CheckCircle2 size={14} color={config.accentColor} />}
          <button type="button" onClick={handleClearChat} title="Clear chat" className="p-1 rounded-lg cursor-pointer" style={{ color: "var(--text-muted)" }}>
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Role picker — male / female voices */}
      <div className="shrink-0 px-4 pb-2">
        <div className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>
          Choose your guide
        </div>
        <div className="flex gap-2">
          {config.agents.map(agent => {
            const active = selectedAgentId === agent.id;
            const gender = getAgentGender(config.id, agent.id);
            return (
              <motion.button
                key={agent.id}
                type="button"
                onClick={() => switchAgent(agent)}
                disabled={busy}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl cursor-pointer text-left min-w-0"
                style={{
                  background: active ? `${agent.color}22` : theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `2px solid ${active ? agent.color : "transparent"}`,
                  opacity: busy ? 0.6 : 1,
                  boxShadow: active ? `0 0 16px ${agent.color}33` : "none",
                }}
              >
                <div className="flex items-center gap-2 w-full min-w-0">
                  <CharacterAvatar emoji={getAgentAvatar(config.id, agent.id)} color={agent.color} size={32} active={active} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{genderIcon(gender)}</span>
                      <span className="text-[13px] font-semibold truncate" style={{ color: active ? agent.color : "var(--text-primary)" }}>
                        {agent.name}
                      </span>
                    </div>
                    <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                      {genderLabel(gender)} · {agent.role}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Messages — main scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-0 overscroll-contain">
        {chatError && (
          <div className="text-[11px] text-center py-2 px-3 rounded-xl" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>{chatError}</div>
        )}
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.isUser ? "flex-row-reverse" : "flex-row"} group items-end`}
            >
              {!msg.isUser && (
                <CharacterAvatar
                  emoji={getAgentAvatar(config.id, msg.agentId)}
                  color={msg.agentColor}
                  size={36}
                />
              )}
              <div style={{ maxWidth: "82%", minWidth: 0 }}>
                {!msg.isUser && (
                  <div className="mb-1 ml-1 text-[11px] font-semibold" style={{ color: msg.agentColor }}>
                    {msg.agentName}
                  </div>
                )}
                <div className="relative">
                  <ChatBubble
                    isUser={!!msg.isUser}
                    accentColor={msg.isUser ? config.accentColor : msg.agentColor}
                    theme={theme}
                  >
                    <span style={{ fontFamily: config.fontFamily }}>
                      {formatMessageText(msg.text)}
                      {msg.streaming && (
                        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>▍</motion.span>
                      )}
                    </span>
                  </ChatBubble>
                  {!msg.isUser && msg.text && !msg.streaming && (
                    <button
                      type="button"
                      onClick={() => copyMessage(msg.text)}
                      className="absolute -right-7 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md cursor-pointer"
                      style={{ color: "var(--text-muted)" }}
                      title="Copy"
                    >
                      <Copy size={11} />
                    </button>
                  )}
                </div>
                {msg.funFact && !msg.streaming && (
                  <FunFactCard accentColor={config.accentColor} theme={theme}>
                    <span style={{ color: config.accentColor, fontWeight: 600 }}>Plot twist: </span>
                    {msg.funFact}
                  </FunFactCard>
                )}
                {msg.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2.5 overflow-hidden rounded-xl border relative group select-none shadow-md"
                    style={{
                      borderColor: theme === "dark" ? "rgba(255,255,255,0.08)" : `${msg.agentColor}22`,
                      background: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={msg.imageUrl}
                      alt="Time period scene"
                      className="w-full h-auto max-h-[200px] object-cover hover:scale-[1.03] transition-transform duration-500 cursor-zoom-in"
                      loading="lazy"
                      onClick={() => window.open(msg.imageUrl, "_blank")}
                      onError={(e) => { (e.target as HTMLElement).parentElement!.style.display = 'none'; }}
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white/80 font-mono tracking-wider">
                      HISTORICAL SNAPSHOT · {year}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          {typingAgent && (
            <div className="flex gap-2.5 items-end">
              <CharacterAvatar
                emoji={getAgentAvatar(config.id, selectedAgent.id)}
                color={selectedAgent.color}
                size={36}
                active
              />
              <div>
                <div className="mb-1 ml-1 text-[11px] font-semibold" style={{ color: selectedAgent.color }}>{typingAgent}</div>
                <TypingBubble accentColor={selectedAgent.color} theme={theme} />
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {activeChips.length > 0 && (
        <div className="shrink-0 flex gap-2 px-4 pb-2 overflow-x-auto">
          {activeChips.map(chip => (
            <motion.button
              key={chip}
              type="button"
              onClick={() => sendMessage(chip)}
              disabled={busy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[11px] px-3.5 py-1.5 rounded-full whitespace-nowrap shrink-0 cursor-pointer font-medium"
              style={{
                background: theme === "dark" ? `${config.accentColor}18` : `${config.accentColor}10`,
                border: `1px solid ${config.accentColor}40`,
                color: config.accentColor,
                opacity: busy ? 0.5 : 1,
              }}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input bar — sticky at bottom */}
      <div
        className="shrink-0 flex items-center gap-2 px-4 pb-4 pt-2.5"
        style={{
          borderTop: `1px solid ${config.accentColor}15`,
          background: theme === "dark" ? "rgba(6,8,14,0.95)" : "rgba(248,250,252,0.98)",
        }}
      >
        <button
          onClick={onReturn}
          className="text-[10px] font-medium px-3 py-2 rounded-xl cursor-pointer shrink-0"
          style={{
            background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-color-subtle)",
          }}
        >
          ← Jump
        </button>

        <div
          className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-2"
          style={{
            background: theme === "dark" ? "rgba(255,255,255,0.06)" : "#fff",
            border: `1.5px solid ${config.accentColor}30`,
            boxShadow: theme === "light" ? `0 2px 12px ${config.accentColor}10` : "none",
          }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder={`Message ${displayName(config, selectedAgent)}…`}
            disabled={busy}
            className="flex-1 bg-transparent outline-none min-w-0"
            style={{ color: "var(--text-primary)", fontSize: "14px", fontFamily: config.fontFamily }}
          />
          <button
            type="button"
            onClick={toggleListening}
            className="p-1.5 rounded-lg cursor-pointer shrink-0"
            style={{ color: isListening ? "#ef4444" : "var(--text-muted)" }}
          >
            <Mic size={16} />
          </button>
          <button
            type="button"
            onClick={() => setTtsEnabled(v => !v)}
            className="p-1.5 rounded-lg cursor-pointer shrink-0"
            style={{ color: ttsEnabled ? config.accentColor : "var(--text-muted)" }}
          >
            <Volume2 size={16} />
          </button>
        </div>

        <motion.button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || busy}
          whileHover={{ scale: input.trim() && !busy ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
          style={{
            background: input.trim() && !busy
              ? `linear-gradient(135deg, ${config.accentColor}, ${config.accentColor}cc)`
              : theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            boxShadow: input.trim() && !busy ? `0 4px 14px ${config.accentColor}55` : "none",
          }}
        >
          <ArrowUp size={18} color={input.trim() && !busy ? "#fff" : "var(--text-muted)"} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}
