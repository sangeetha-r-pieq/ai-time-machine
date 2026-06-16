// src/api.ts
import Groq from "groq-sdk";

export interface TimeJumpResult {
  category: string;
  main_reply: string;
  fun_fact: string;
  emoji_theme: string;
  image_prompt: string;
  ui_theme: string;
  voice_pitch: number;
}

export async function performTimeJump(topic: string, year: string, apiKey: string): Promise<TimeJumpResult> {
  if (!apiKey) {
    throw new Error("API Key is required to initiate the Time Jump.");
  }

  // Initialize Groq SDK and explicitly allow browser usage
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  const prompt = `
    You are an advanced Multi-Agent Time Machine Orchestrator.
    The user wants to travel to the year ${year} and explore the topic: "${topic}".
    
    You have 3 internal agents:
    1. Historian: Analyzes factual context for the topic in that specific year.
    2. Art Director: Writes an image generation prompt.
    3. UX Designer: Selects the UI theme and emojis.

    Respond ONLY with a valid JSON object matching this exact structure, nothing else:
    {
      "category": "actor | platform | technology | politics | general",
      "main_reply": "A creative, era-specific response written as if you are actually living in ${year}. Keep it under 3 sentences. Be witty.",
      "fun_fact": "A mind-blowing fact about ${topic} relative to ${year}.",
      "emoji_theme": "3 relevant emojis",
      "image_prompt": "A highly detailed prompt for an image generator. Mention the era, style (e.g., retro 1990s anime, futuristic cyberpunk 3d render, vintage 1920s photo), and the subject.",
      "ui_theme": "modern | retro | cyberpunk",
      "voice_pitch": "A number between 0.5 and 1.5. (e.g. 0.8 for older deep voice, 1.3 for robotic/high future voice)"
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
        messages: [{ role: "user", content: prompt }],
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
