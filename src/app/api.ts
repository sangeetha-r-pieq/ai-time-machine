const API_KEY = "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";

export interface ChatHistoryItem {
  sender: string;
  text: string;
}

export async function fetchGroqReply(
  agentName: string,
  agentRole: string,
  year: number,
  question: string,
  history: ChatHistoryItem[] = []
): Promise<string> {
  const systemPrompt = `You are ${agentName}, playing the role of ${agentRole} in the year ${year}.
Respond to the user's input in character. Be immersive, concise, and stay completely in character. Do not break the fourth wall.
Keep your response to a short paragraph (2-3 sentences max). Use formatting matching the character's background/era.`;

  const messages = [
    { role: "system", content: systemPrompt }
  ];

  // Map history to roles
  history.forEach(item => {
    if (item.sender === "user") {
      messages.push({ role: "user", content: item.text });
    } else {
      messages.push({ role: "assistant", content: `${item.sender}: ${item.text}` });
    }
  });

  // Append current question
  messages.push({ role: "user", content: question });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("Groq error", response.status);
      return "..."; // Fallback on error
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "...";
  } catch (err) {
    console.error("Fetch error", err);
    return "...";
  }
}
