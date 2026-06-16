import React, { useState, useEffect, FormEvent } from 'react';
import { performTimeJump, playVoice, TimeJumpResult } from './api';
import { Clock, Zap, Info, Star } from 'lucide-react';
import './index.css';

function App() {
  const [topic, setTopic] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const API_KEY = "ur api key";
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TimeJumpResult | null>(null);
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, image?: string, prompt?: string }>>([]);

  useEffect(() => {
    if (result && result.ui_theme) {
      document.body.setAttribute('data-theme', result.ui_theme);
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [result]);

  const handleTimeJump = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic || !year || !apiKey) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await performTimeJump(topic, year, API_KEY);
      // Push user query and assistant response into chat messages
      const newMessages = [
        ...messages,
        { role: 'user', content: `Year: ${year}, Topic: ${topic}` },
        {
          role: 'assistant',
          content: data.main_reply,
          image: getImageUrl(data.image_prompt),
          prompt: data.image_prompt,
        },
      ];
      setMessages(newMessages);
      setResult(data);
      playVoice(data.main_reply, data.voice_pitch);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (prompt: string): string => {
    if (!prompt) return '';
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
  };

  return (
    <div className="app-container">
      <h1 className="title">AI Time Machine <Clock className="inline-block ml-2 mb-1" /></h1>

      {loading ? (
        <div className="loader-wrapper">
          <div className="loader"></div>
          <audio src="https://cdn.pixabay.com/audio/2022/03/15/audio_2e6c7e2e99.mp3" autoPlay loop />
        </div>
      ) : (
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg ${msg.role}`}>
                {msg.role === 'assistant' && msg.image && (
                  <img src={msg.image} alt="Generated" className="generated-image" />
                )}
                <p>{msg.content}</p>
                {msg.role === 'assistant' && msg.prompt && (
                  <p className="image-prompt">Prompt: {msg.prompt}</p>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleTimeJump} className="chat-input">
            <input
              type="text"
              placeholder="Enter year / era"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter subject / topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>Send</button>
          </form>
        </div>
      )}

      {result && !loading && (
        <div className="display-area">
          <div className="visual-panel">
            <img
              src={getImageUrl(result.image_prompt)}
              alt="Era visualization"
              className="generated-image"
              loading="lazy"
            />
            <p className="image-prompt">Prompt: {result.image_prompt}</p>
          </div>

          <div className="glass-panel data-panel">
            <div className="category-badge">
              {result.category === 'actor' && <Star size={14} />}
              {result.category}
            </div>

            <p className="main-text">"{result.main_reply}"</p>

            <div className="fun-fact-box">
              <Info size={18} style={{ float: 'left', marginRight: '10px', color: 'var(--accent-2)' }} />
              {result.fun_fact}
            </div>

            <div className="emoji-rain">
              {result.emoji_theme}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
