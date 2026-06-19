// src/api.ts

export interface TimeJumpResult {
  category: string;
  main_reply: string;
  fun_fact: string;
  emoji_theme: string;
  image_prompt: string;
  ui_theme: string;
  voice_pitch: number;
  souvenir_name?: string;
}

export async function performTimeJump(
  query: string,
  year: string,
  apiKey: string,
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }> = []
): Promise<TimeJumpResult> {
  if (!apiKey) {
    throw new Error("API Key is required to initiate the Time Jump.");
  }

  const systemPrompt = `
    You are an advanced Multi-Agent Time Machine Orchestrator.
    The user is interacting with someone from the year ${year}.
    
    You have 3 internal agents:
    1. Historian: Analyzes factual context for the specific year.
    2. Art Director: Writes an image generation prompt.
    3. UX Designer: Selects the UI theme and emojis.

    Respond ONLY with a valid JSON object matching this exact structure, nothing else:
    {
      "category": "actor | platform | technology | politics | general",
      "main_reply": "A creative, era-specific response written as if you are actually living in ${year} talking to the user. Keep it under 3 sentences. Be witty.",
      "fun_fact": "A mind-blowing historical fact relative to ${year} and the current topic.",
      "emoji_theme": "3 relevant emojis",
      "image_prompt": "A highly detailed prompt for an image generator based on the current context. Mention the era, style (e.g., retro 1990s anime, futuristic cyberpunk 3d render, vintage 1920s photo), and the subject.",
      "ui_theme": "modern | retro | cyberpunk",
      "voice_pitch": 1.0,
      "souvenir_name": "A historically accurate, tangible item from this era that the user can take back as a souvenir (e.g., 'A rusty Roman coin', 'A neon 1980s cassette tape', 'A dinosaur tooth'). Keep it short."
    }
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: query }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `Groq API error ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || "";
    // Strip possible markdown wrappers
    const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as TimeJumpResult;
  } catch (error: any) {
    console.error("Time Jump Error:", error);
    throw new Error(error.message || "Unknown error occurred with the Groq API.");
  }
}

export function playVoice(text: string, pitch: number = 1): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = 0.95;

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Text-to-speech not supported in this browser.");
  }
}
