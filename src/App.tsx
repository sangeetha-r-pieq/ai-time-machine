import { useState, useEffect, FormEvent } from 'react';
import { performTimeJump, playVoice, TimeJumpResult } from './api';
import { Clock, Info, Star, Mic, MicOff, Book, Sparkles } from 'lucide-react';
import './App.css';

// Type definitions for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface InventoryItem {
  name: string;
  image: string;
}

function App() {
  const [topic, setTopic] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [chatQuery, setChatQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const API_KEY = "your-api-key";
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TimeJumpResult | null>(null);
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, image?: string, prompt?: string }>>([]);

  // Gamification State
  const [passportStamps, setPassportStamps] = useState<string[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  useEffect(() => {
    // Load gamification data from local storage
    const savedStamps = JSON.parse(localStorage.getItem('passportStamps') || '[]');
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    setPassportStamps(savedStamps);
    setInventory(savedInventory);
  }, []);

  useEffect(() => {
    if (result && result.ui_theme) {
      document.body.setAttribute('data-theme', result.ui_theme);
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [result]);

  const saveGamificationData = (newStamps: string[], newInventory: InventoryItem[]) => {
    setPassportStamps(newStamps);
    setInventory(newInventory);
    localStorage.setItem('passportStamps', JSON.stringify(newStamps));
    localStorage.setItem('inventory', JSON.stringify(newInventory));
  };

  const executeJump = async (currentYear: string, currentTopic: string, queryMsg: string, isFirstTurn: boolean) => {
    setLoading(true);
    setError('');

    try {
      const userMessageContent = isFirstTurn ? `Year: ${currentYear}, Topic: ${currentTopic}` : queryMsg;

      const data = await performTimeJump(userMessageContent, currentYear, API_KEY, messages);

      const newMessages = [
        ...messages,
        { role: 'user' as const, content: userMessageContent },
        {
          role: 'assistant' as const,
          content: data.main_reply,
          image: getImageUrl(data.image_prompt),
          prompt: data.image_prompt,
        },
      ];

      setMessages(newMessages);
      setResult(data);
      setChatQuery('');
      playVoice(data.main_reply, data.voice_pitch || 1.0);

      // Handle Gamification Logic
      let updatedStamps = [...passportStamps];
      let updatedInventory = [...inventory];

      if (isFirstTurn && !updatedStamps.includes(currentYear)) {
        updatedStamps.push(currentYear);
      }

      if (data.souvenir_name) {
        // Prevent duplicate souvenirs with the exact same name
        if (!updatedInventory.find(item => item.name === data.souvenir_name)) {
          updatedInventory.push({
            name: data.souvenir_name,
            image: getImageUrl(data.souvenir_name)
          });
        }
      }

      saveGamificationData(updatedStamps, updatedInventory);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeJump = async (e: FormEvent) => {
    e.preventDefault();
    if (!API_KEY) {
      setError("API Key is missing.");
      return;
    }

    const isFirstTurn = messages.length === 0;

    if (isFirstTurn && (!topic || !year)) {
      setError("Please fill all fields.");
      return;
    }

    if (!isFirstTurn && !chatQuery) {
      setError("Please enter a message.");
      return;
    }

    await executeJump(year, topic, chatQuery, isFirstTurn);
  };

  const triggerMysteryWormhole = () => {
    // Generate a pseudo-random event based on the current day of the year
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    const events = [
      { year: "1969", topic: "The Apollo 11 Moon Landing" },
      { year: "1912", topic: "The sinking of the Titanic" },
      { year: "1347", topic: "The Black Death in Europe" },
      { year: "2077", topic: "Cyberpunk Future City" },
      { year: "1000 BC", topic: "Ancient Egyptian Pyramids Construction" },
      { year: "1985", topic: "Live Aid Concert" }
    ];

    const event = events[dayOfYear % events.length];

    // Reset state
    setMessages([]);
    setResult(null);
    setYear(event.year);
    setTopic(event.topic);
    setChatQuery('');

    executeJump(event.year, event.topic, "", true);
  };

  const getImageUrl = (prompt: string): string => {
    if (!prompt) return '';
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (messages.length === 0) {
        setTopic(prev => prev ? prev + ' ' + transcript : transcript);
      } else {
        setChatQuery(prev => prev ? prev + ' ' + transcript : transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="app-container">
      <div className="header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
        <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>AI Time Machine <Clock className="inline-block ml-2 mb-1" /></h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={triggerMysteryWormhole} className="wormhole-btn pulse" title="Daily Mystery Wormhole" style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', fontSize: '0.9rem', backgroundColor: '#9b59b6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            <Sparkles size={16} style={{ marginRight: '5px' }} />
            Wormhole
          </button>
          <button onClick={() => setShowDashboard(!showDashboard)} className="dashboard-btn" title="Traveler Dashboard" style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', fontSize: '0.9rem', backgroundColor: '#34495e', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            <Book size={16} style={{ marginRight: '5px' }} />
            Passport
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

      {showDashboard && (
        <div className="dashboard-modal glass-panel" style={{ marginBottom: '20px', padding: '20px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Traveler Dashboard</h2>
            <button onClick={() => setShowDashboard(false)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
          </div>

          <div className="dashboard-section" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>🛂 Passport Stamps</h3>
            <div className="stamps-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {passportStamps.length === 0 && <p style={{ fontSize: '0.9rem', color: '#ccc' }}>No stamps yet. Start traveling!</p>}
              {passportStamps.map((s, i) => (
                <div key={i} className="stamp" style={{ padding: '10px 15px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', border: '2px dashed rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>🏺 Souvenir Inventory</h3>
            <div className="inventory-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
              {inventory.length === 0 && <p style={{ fontSize: '0.9rem', color: '#ccc' }}>No souvenirs collected yet.</p>}
              {inventory.map((item, i) => (
                <div key={i} className="inventory-item" style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                  <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '5px', marginBottom: '5px' }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.2' }}>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          <form onSubmit={handleTimeJump} className="chat-input" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {messages.length === 0 ? (
              <>
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
              </>
            ) : (
              <input
                type="text"
                placeholder="Ask a follow-up question..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                required
                style={{ flex: 1 }}
              />
            )}

            <button
              type="button"
              onClick={toggleMic}
              className={isListening ? 'listening' : ''}
              style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Voice Input"
            >
              {isListening ? <MicOff size={20} color="red" /> : <Mic size={20} />}
            </button>

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

            {result.souvenir_name && (
              <div className="souvenir-box" style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--accent-1)', backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                🏺 <strong>Item Collected:</strong> {result.souvenir_name}
              </div>
            )}

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
