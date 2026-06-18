# AI Time Machine — Full Project Documentation

> **AI Time Machine** is an interactive hackathon web app where users pick any year in history, travel through an animated sequence, land in a visual era scene, and chat with in-character historical guides powered by Groq LLMs.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [How to Run](#how-to-run)
3. [Environment Variables & API Keys](#environment-variables--api-keys)
4. [AI Models & External APIs](#ai-models--external-apis)
5. [Application Architecture](#application-architecture)
6. [User Flow (End to End)](#user-flow-end-to-end)
7. [Directory Structure](#directory-structure)
8. [Core Modules Reference](#core-modules-reference)
9. [Chat & AI Pipeline](#chat--ai-pipeline)
10. [Gamification & Persistence](#gamification--persistence)
11. [Audio, Voice & Visuals](#audio-voice--visuals)
12. [The 10 Historical Eras](#the-10-historical-eras)
13. [Legacy / Unused Code](#legacy--unused-code)
14. [Security Notes](#security-notes)
15. [Known Limitations](#known-limitations)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build tool | Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + custom CSS variables (`src/styles/`) |
| Animation | Motion (Framer Motion fork) — `motion/react` |
| UI primitives | Radix UI + shadcn-style components in `src/app/components/ui/` |
| Confetti | `canvas-confetti` |
| AI provider | **Groq** (OpenAI-compatible chat completions API) |
| Background images | **Pollinations.ai** (free image URL generation, no API key) |
| Text-to-speech | Browser **Web Speech API** (`speechSynthesis`) |
| Sound effects | **Web Audio API** (oscillators, no audio files) |
| State persistence | `localStorage` + `sessionStorage` |

**Entry point:** `index.html` → `src/main.tsx`

```tsx
// src/main.tsx
<TravelProvider>
  <App />   {/* src/app/App.tsx — NOT src/App.tsx */}
</TravelProvider>
```

---

## How to Run

```bash
# Install dependencies
npm install
# or: bun install / pnpm install

# Copy env template and add your Groq key
cp .env.example .env.local

# Start dev server (default http://localhost:5173)
npm run dev

# Production build
npm run build
# Output: dist/
```

**Important:** Env files must live at the **project root** (next to `vite.config.ts`), not inside `src/`. Restart the dev server after changing env vars.

---

## Environment Variables & API Keys

### Required for AI chat

| Variable | Where used | Required when |
|----------|------------|---------------|
| `GROQ_API_KEY` | Vite dev proxy (`vite.config.ts`) — injected server-side into Groq requests | **Dev** (recommended) |
| `VITE_GROQ_API_KEY` | Client bundle (`src/app/api.ts`) — sent as `Authorization: Bearer` header | **Production build** (and dev fallback) |

### Example `.env.local` (project root)

```env
GROQ_API_KEY=gsk_your_key_here
VITE_GROQ_API_KEY=gsk_your_key_here
```

### How keys flow in development

```
Browser (AgentChat)
    → fetch("/api/groq/openai/v1/chat/completions")
    → Vite proxy (vite.config.ts)
    → Adds Authorization: Bearer ${GROQ_API_KEY || VITE_GROQ_API_KEY}
    → https://api.groq.com/openai/v1/chat/completions
```

The client may also send `VITE_GROQ_API_KEY` in the header if set. The proxy adds the key server-side so it is not strictly required in the bundle during dev.

### How keys flow in production

```
Browser → fetch("https://api.groq.com/openai/v1/chat/completions")
        → Authorization: Bearer ${VITE_GROQ_API_KEY}
```

⚠️ **`VITE_*` variables are embedded in the JS bundle** and visible to anyone who inspects the built app. For real production, use a backend proxy.

### Getting a Groq API key

1. Sign up at [https://console.groq.com](https://console.groq.com)
2. Create an API key
3. Paste into `.env.local`
4. Restart `npm run dev`

### TypeScript env types

Declared in `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY?: string;
}
```

---

## AI Models & External APIs

### 1. Groq — Chat (primary AI)

**File:** `src/app/api.ts`

| Setting | Value |
|---------|-------|
| **Primary model** | `llama-3.3-70b-versatile` |
| **Fallback model** | `llama-3.1-8b-instant` |
| **Endpoint** | `POST /openai/v1/chat/completions` |
| **Temperature** | `0.82` |
| **Max tokens** | `600` |
| **Response format** | `json_object` (structured JSON replies) |
| **Max history** | Last 8 turns (16 messages) per request |

**Request flow:**
1. `AgentChat` calls `fetchAgentChat(ctx)`
2. Builds system prompt with character, era, year context, mission, hotspots, traveler memory
3. Sends trimmed chat history + new user message
4. Tries primary model → on failure retries fallback model → on failure returns error + local canned reply

**JSON response shape:**

```json
{
  "reply": "In-character answer (1-3 sentences)",
  "fun_fact": "Surprising fact shown as 'Plot twist'",
  "mission_complete": false,
  "follow_up_chips": ["Chip one", "Chip two"],
  "scene_reaction": "none | fire | stars | snow | digital | spark"
}
```

**No Groq key?** User sees red banner + fallback reply from `era-config.ts` agent keyword responses.

### 2. Pollinations.ai — Era background images

**File:** `src/app/components/india-content.ts` → `getEraBackgroundUrl()`

| Setting | Value |
|---------|-------|
| **API key** | None required |
| **URL pattern** | `https://image.pollinations.ai/prompt/{encodedPrompt}?width=1280&height=720&nologo=true` |
| **Prompt source** | Per-era text prompts in `ERA_BG_PROMPTS` + year number |

Used in `YearPicker` (landing preview) and `EraScene` (full scene background).

### 3. Web Speech API — Voice (no API key)

**File:** `src/app/components/voice.ts`

| Setting | Value |
|---------|-------|
| **API key** | None — browser built-in |
| **Voice selection** | Picks male/female English system voice based on `agent-voices.ts` |
| **Pitch** | Female: `1.14`, Male: `0.86` |
| **Rate** | Female: `1.05`, Male: `0.92` |

### 4. Web Audio API — Sound effects (no API key)

**File:** `src/app/components/sounds.ts`

| Function | Purpose |
|----------|---------|
| `playTravelSound()` | Whoosh during time travel animation |
| `playArrivalSound(freq)` | Short tone when landing in era |
| `playPingSound(freq)` | UI feedback clicks |
| `startAmbient()` / `stopAmbient()` | Continuous era drone (currently **disabled during scene/chat**) |

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  main.tsx                                                    │
│    └── TravelProvider (global journey/memory state)          │
│          └── App.tsx (phase orchestrator)                    │
│                ├── YearPicker      [phase: picker]             │
│                ├── TravelAnimation [phase: traveling]        │
│                └── EraScene + AgentChat [phase: scene]       │
└─────────────────────────────────────────────────────────────┘
```

### Phase state machine

**File:** `src/app/App.tsx`

| Phase | Component | Description |
|-------|-----------|-------------|
| `picker` | `YearPicker` | Landing page — scroll/select year, timeline, presets |
| `traveling` | `TravelAnimation` | Cartoon rocket + era flipbook animation (~few seconds) |
| `scene` | `EraScene` + `AgentChat` | Full-screen era world + chat panel overlay |

Transitions:
- `picker` → `traveling`: user picks year (`handleJump`)
- `traveling` → `scene`: animation completes (`handleArrived`)
- `scene` → `picker`: user taps return (`handleReturn`)

---

## User Flow (End to End)

1. **Landing (`YearPicker`)**
   - User scrolls timeline or types a year (e.g. 1969, 2024, -2500)
   - `getEraConfig(year)` maps year → one of 10 eras
   - `getYearContext(year)` shows headline card for that year
   - Pollinations background preview loads for the era
   - User clicks **Jump** → travel begins

2. **Travel (`TravelAnimation`)**
   - Rocket animation + era emoji flipbook
   - `playTravelSound()` fires
   - On complete → `onComplete()` → scene phase

3. **Arrival (`App.handleArrived`)**
   - `playArrivalSound()` — one-shot tone
   - Passport **stamp** auto-awarded for new era (confetti)
   - Ambient drone is **not** started (muted for chat)

4. **Scene (`EraScene`)**
   - SVG horizon silhouettes per era
   - Pollinations AI background image
   - Parallax mouse movement
   - Clickable **hotspots** (lore tooltips) — `era-hotspots.ts`
   - Clickable **character** (random fallback line)
   - Particle effects (`SceneParticles`) — burst on scene reactions

5. **Chat (`AgentChat`)**
   - User picks **guide** (2 agents per era — male/female voices)
   - Arrival greeting from selected agent (or restored from localStorage)
   - User types or uses voice input (Web Speech Recognition)
   - Message sent to Groq via `fetchAgentChat`
   - Reply streams with typewriter effect (`streamReplyText`)
   - TTS reads reply in agent's voice (toggleable)
   - **Plot twist** card shows `fun_fact`
   - Follow-up chips appear (includes fun chips like "Tell me the drama")
   - Mission progress → souvenir unlock on completion

6. **Dashboard (modal)**
   - **Passport tab:** stamps for visited eras
   - **Inventory tab:** collected souvenirs (10 total)

---

## Directory Structure

```
ai-time-machine/
├── index.html                 # HTML shell, loads /src/main.tsx
├── vite.config.ts             # Vite + Tailwind + Groq dev proxy
├── tsconfig.json              # TypeScript config (includes src/)
├── .env.example               # Env template
├── .env.local                 # Your secrets (gitignored) — YOU CREATE THIS
├── package.json
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── main.tsx               # ★ App entry point
    ├── vite-env.d.ts          # Vite env TypeScript types
    │
    ├── app/                   # ★ ACTIVE APPLICATION
    │   ├── App.tsx            # Main orchestrator (phases, gamification, dashboard)
    │   ├── api.ts             # ★ Groq chat API (primary AI integration)
    │   │
    │   ├── hooks/
    │   │   └── useWideLayout.ts   # Responsive breakpoint (wide vs mobile)
    │   │
    │   └── components/
    │       ├── YearPicker.tsx         # Landing / year selection UI
    │       ├── TravelAnimation.tsx    # Time travel animation
    │       ├── EraScene.tsx           # Visual era world (horizons, hotspots)
    │       ├── AgentChat.tsx          # Chat panel (messages, agents, TTS)
    │       ├── ChatBubble.tsx         # Bubble UI, avatars, fun fact cards
    │       ├── CartoonCharacter.tsx   # Clickable scene character
    │       ├── SceneParticles.tsx     # Era particle effects
    │       ├── YearContextBanner.tsx  # Year headline in chat
    │       │
    │       ├── era-config.ts          # ★ 10 eras, agents, colors, fallbacks
    │       ├── era-missions.ts        # Per-era mission titles/goals/keywords
    │       ├── era-hotspots.ts        # Clickable scene locations + prompt chips
    │       ├── year-context.ts        # Year → headline/detail lookup
    │       ├── agent-personalities.ts # AI personality prompts per agent
    │       ├── agent-voices.ts        # Male/female gender + TTS pitch mapping
    │       ├── india-content.ts       # Era backgrounds (Pollinations) + CONTENT_LENS
    │       ├── india-agents.ts        # ⚠ LEGACY — India-specific agents (unused)
    │       ├── chat-storage.ts        # localStorage per-era chat persistence
    │       ├── celebrations.ts        # Confetti effects
    │       ├── sounds.ts              # Web Audio sound effects
    │       ├── voice.ts               # Web Speech TTS
    │       ├── message-format.tsx     # Text formatting in bubbles
    │       │
    │       ├── ui/                    # shadcn/Radix UI component library (40+ files)
    │       └── figma/
    │           └── ImageWithFallback.tsx
    │
    ├── context/
    │   └── TravelContext.tsx    # Global travel state (passport, memory)
    │
    ├── styles/
    │   ├── global.css           # Main stylesheet import chain
    │   ├── theme.css            # CSS variables (light/dark)
    │   ├── tailwind.css
    │   └── fonts.css
    │
    ├── assets/                  # Static images (hero.png, etc.)
    │
    ├── App.tsx                  # ⚠ LEGACY — old app, NOT loaded by main.tsx
    ├── api.ts                   # ⚠ LEGACY — old Groq integration
    └── App.css                  # ⚠ LEGACY
```

---

## Core Modules Reference

### `era-config.ts` — Single source of truth for eras

- **`EraId`**: `"prehistoric" | "ancient" | "classical" | "medieval" | "industrial" | "wartime" | "analog" | "digital" | "present" | "future"`
- **`getEraConfig(year)`**: Maps any year number to era config
- **`Agent`**: Each era has **2 agents** with:
  - `name`, `role`, colors, `responses` (keyword regex → canned reply), `fallback` (greeting lines)
- **`getAgentGreeting(agent)`**: Random greeting line
- **`getAgentFallbackReply(agent, question)`**: Offline fallback when Groq fails

### `AgentChat.tsx` — Chat brain on the client

- Manages messages, selected agent, TTS, voice input, mission state
- Resizable panel height (stored in `sessionStorage`: `ai-time-machine-chat-height`)
- Builds API context and calls `fetchAgentChat`
- Per-agent chat history (switching agents filters history correctly)
- Saves/restores chat via `chat-storage.ts` (key: `ai-time-machine-chat-{eraId}`)

### `agent-personalities.ts`

Maps `{eraId}-{agentId}` → `{ personality, speechStyle, knowledge }` injected into Groq system prompt.

### `agent-voices.ts`

Maps each agent to male/female gender for UI labels and TTS voice selection.

### `era-missions.ts`

Each era has a mission (`title`, `goal`, `keywords[]`). Mission completes when Groq sets `mission_complete: true` OR user message matches a keyword → triggers souvenir award.

### `era-hotspots.ts`

- **`ERA_HOTSPOTS`**: 2 clickable locations per era in `EraScene`
- **`ERA_PROMPT_CHIPS`**: Suggested chat questions per era
- **`FUN_PROMPT_CHIPS`**: `["Tell me the drama", "Roast my question", "What's the gossip?"]`

### `year-context.ts`

- **`getYearContext(year)`**: Returns `{ emoji, headline, detail }` for exact years (1947, 1969, 2024…) or year ranges

### `TravelContext.tsx`

Global React context persisted to `localStorage` key `travelState`:

```ts
{
  passport: Journey[],   // visited destinations log
  souvenirs: string[],
  badges: string[],
  memory: Record<string, any>  // e.g. lastQuestion-{eraId}, visited-{eraId}
}
```

Used by `AgentChat` to pass cross-era traveler memory into Groq prompts.

---

## Chat & AI Pipeline

```
User types message in AgentChat
        │
        ▼
buildHistory(messages, selectedAgentId)
  • Skips arrival greetings (id starts with "arrival-")
  • Only includes valid user→agent pairs for current agent
        │
        ▼
fetchAgentChat({
  agentName, agentRole, agentId,
  eraId, eraName, year,
  yearHeadline, yearDetail,        ← from year-context.ts
  personality,                      ← from agent-personalities.ts
  missionTitle, missionGoal,        ← from era-missions.ts
  hotspotLore[],                    ← from era-hotspots.ts
  travelerMemory[],                 ← from TravelContext
  question, history,
  missionAlreadyComplete
})
        │
        ▼
buildSystemPrompt() + buildMessages()
        │
        ▼
POST Groq API (llama-3.3-70b-versatile)
        │ fail?
        ▼
POST Groq API (llama-3.1-8b-instant)
        │ fail?
        ▼
Return error + getAgentFallbackReply() from era-config
        │
        ▼
streamReplyText() — typewriter display
playVoice() — TTS with agent gender voice
scene_reaction → particle burst in EraScene
mission_complete → onAwardSouvenir(eraId)
```

### System prompt tone (current)

The prompt instructs the model to:
- Stay in character for the era/agent
- Answer the **latest** user message directly
- Be **conversational and witty** (not Wikipedia)
- Return structured JSON only

Content lens (`CONTENT_LENS` in `india-content.ts`): global history perspective — answer from character's time and place.

---

## Gamification & Persistence

### Passport stamps

| Key | Storage | Trigger |
|-----|---------|---------|
| `time-travel-stamps` | localStorage | Auto-awarded on first arrival in each era |

10 eras = 10 possible stamps. Confetti on earn. Full collection celebration at 10.

### Souvenirs (inventory)

| Key | Storage | Trigger |
|-----|---------|---------|
| `time-travel-inventory` | localStorage | Mission complete in chat (AI flag or keyword match) |

10 unique souvenirs defined in `App.tsx` → `SOUVENIRS` record.

### Chat history

| Key pattern | Storage | Scope |
|-------------|---------|-------|
| `ai-time-machine-chat-{eraId}` | localStorage | Per era — messages, selected agent, mission state |

### UI preferences

| Key | Storage | Content |
|-----|---------|---------|
| `time-travel-theme` | localStorage | `"light"` or `"dark"` |
| `ai-time-machine-chat-height` | sessionStorage | Chat panel height (vh) |
| `travelState` | localStorage | TravelContext global state |

---

## Audio, Voice & Visuals

### Sound policy (current)

| When | Sound |
|------|-------|
| Time travel animation | Whoosh (`playTravelSound`) |
| Era arrival | Short tone (`playArrivalSound`) |
| Scene / chat | **No ambient drone** (muted) |
| Chat message sent | Ping (`playPingSound`) |
| Agent reply (if TTS on) | Browser speech synthesis |

### Voice switching

When user switches agent in the role picker:
1. `stopVoice()` cancels current speech
2. New agent's greeting spoken with their gender voice profile
3. Replies use `getAgentVoiceProfile(eraId, agentId)`

### Visual layers in scene (bottom → top)

1. Pollinations background image
2. Sky gradient + clickable area
3. SVG horizon silhouette (era-specific)
4. Ground gradient
5. Scene particles
6. Hotspot buttons
7. Cartoon character
8. Chat panel overlay (AgentChat)
9. Top bar (year, era name, agent list)

---

## The 10 Historical Eras

| Era ID | Name | Year range | Example agents (Present era) |
|--------|------|------------|------------------------------|
| `prehistoric` | Prehistoric Era | Before 3000 BC | The Elder, Dr. Yara |
| `ancient` | Ancient World | 3000 BC – 500 BC | Kha-em-waset, Dr. Amara |
| `classical` | Classical Antiquity | 500 BC – 500 AD | Nikias, Dr. Petros |
| `medieval` | Medieval Era | 500 – 1500 AD | Brother Aldric, Prof. Maren |
| `industrial` | Industrial Era | 1760 – 1900 AD | William Ashby, Dr. James |
| `wartime` | World Wars Era | 1900 – 1950 AD | Sgt. Thomas Reed, Dr. Claire |
| `analog` | Post-War & Space Age | 1950 – 1985 AD | Nancy Kowalski, Dr. Singh |
| `digital` | Digital Age | 1985 – 2010 AD | Kenji_404, Prof. Ada |
| `present` | Present Day | 2010 – 2030 AD | Alex M., River T. |
| `future` | The Future | 2030+ AD | Zeth-9, Lena Vasquez |

Each era defines: sky/ground gradients, particle type, accent colors, fonts, ambient sound frequencies, 2 agents with keyword fallbacks.

---

## Legacy / Unused Code

These files exist but are **NOT loaded** by the active app:

| File | Notes |
|------|-------|
| `src/App.tsx` | Old monolithic app with hardcoded API key pattern |
| `src/api.ts` | Old `performTimeJump()` using `llama-3.1-8b-instant` only |
| `src/App.css` | Legacy styles |
| `src/app/components/india-agents.ts` | India-specific agent overrides — superseded by `era-config.ts` |

**Active entry:** `src/main.tsx` → `src/app/App.tsx` only.

---

## Security Notes

1. **`VITE_GROQ_API_KEY` is public** in production builds — anyone can extract it from `dist/assets/*.js`
2. **Use `GROQ_API_KEY`** (non-VITE) + Vite proxy for local dev to keep key server-side
3. **Never commit** `.env.local` — it is gitignored
4. **Rotate keys** if accidentally committed or exposed in chat/screenshots
5. **Pollinations.ai** URLs are public — no secret, but generated images depend on external service uptime
6. No user authentication — all data is local browser storage only

---

## Known Limitations

| Limitation | Detail |
|------------|--------|
| Groq rate limits | Free tier may hit 429 errors → fallback model → canned replies |
| No backend | All AI calls from browser (or Vite proxy in dev only) |
| TTS quality | Depends on browser/OS voices — varies on Mac vs Windows vs mobile |
| Pollinations latency | Background images load async — may flash empty on slow network |
| Chat feels chatbot-like | Still text-in/text-out at core despite fun prompts and TTS |
| `india-agents.ts` | Dead code — can be deleted |
| Legacy `src/App.tsx` | Dead code — can be deleted |
| Mission detection | Keyword substring match is loose — may false-positive |
| No offline mode | Requires Groq for dynamic replies (fallback keywords only without API) |

---

## Quick Reference — All API Keys Used

| Service | API Key Required? | Env Variable | Used For |
|---------|-------------------|--------------|----------|
| **Groq** | ✅ Yes | `GROQ_API_KEY` / `VITE_GROQ_API_KEY` | Chat completions (Llama models) |
| **Pollinations.ai** | ❌ No | — | Era background images via URL |
| **Web Speech API** | ❌ No | — | Text-to-speech + voice input |
| **Web Audio API** | ❌ No | — | Travel/arrival/ping sounds |

---

## Quick Reference — All AI Models Used

| Model | Provider | File | Purpose |
|-------|----------|------|---------|
| `llama-3.3-70b-versatile` | Groq | `src/app/api.ts` | Primary chat agent (JSON replies) |
| `llama-3.1-8b-instant` | Groq | `src/app/api.ts` | Fallback if primary fails |
| `llama-3.1-8b-instant` | Groq | `src/api.ts` (legacy) | Old app only — not active |

Pollinations image generation uses whatever model Pollinations runs server-side — **not configurable** in this project.

---

*Last updated to match codebase state as of project implementation including fun chat tone, role/voice switching, and ambient mute during chat.*
