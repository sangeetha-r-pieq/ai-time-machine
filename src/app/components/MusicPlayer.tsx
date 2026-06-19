import { useState, useEffect, useRef } from "react";
import { Play, Pause, Music, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  year: number;
}

interface Track {
  previewUrl: string;
  trackName: string;
  artistName: string;
}

export function MusicPlayer({ year }: Props) {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [language, setLanguage] = useState<"english" | "tamil">("english");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state when year or language changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setTrack(null);
    setIsPlaying(false);
    setError(false);
  }, [year, language]);

  const togglePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (track && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    // Need to fetch track
    setIsLoading(true);
    setError(false);
    try {
      // Use a broad search term depending on the year and language
      const langPrefix = language === "tamil" ? "tamil " : "hit song ";
      const term = year < 1900 ? `classical music` : `${langPrefix}${year}`;
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=50`);
      const data = await res.json();
      
      // 1. Strictly filter by exact release year
      let validTracks = data.results.filter((t: any) => 
        t.previewUrl && t.releaseDate && t.releaseDate.startsWith(year.toString())
      );
      
      // 2. Fallback if no exact year matches (iTunes search is fuzzy)
      if (validTracks.length === 0) {
        validTracks = data.results.filter((t: any) => t.previewUrl);
      }
      
      if (validTracks.length > 0) {
        // Pick a random track from the top results
        const selected = validTracks[Math.floor(Math.random() * validTracks.length)];
        const newTrack = {
          previewUrl: selected.previewUrl,
          trackName: selected.trackName,
          artistName: selected.artistName
        };
        setTrack(newTrack);
        
        const audio = new Audio(newTrack.previewUrl);
        audio.volume = 0.5;
        audio.onended = () => setIsPlaying(false);
        audioRef.current = audio;
        await audio.play();
        setIsPlaying(true);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error("Failed to fetch music", e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-600/80 border border-purple-400/50 text-white hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md cursor-pointer relative z-10"
        title="Play trending music from this era"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin text-white" />
        ) : isPlaying ? (
          <Pause size={18} className="text-white" />
        ) : (
          <Play size={18} className="ml-0.5 text-white" />
        )}
      </button>

      <AnimatePresence>
        {!isPlaying && !track && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute left-14 bg-purple-600 text-white px-4 py-2 rounded-xl whitespace-nowrap text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center gap-2 z-20 pointer-events-none"
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-lg"
            >
              👋
            </motion.span>
            Hey! Hear trending music from {year}!
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-purple-600" />
          </motion.div>
        )}

        {(isPlaying || track) && !error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 max-w-[150px]"
          >
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Music size={12} className="text-purple-400" />
              </motion.div>
            )}
            <div className="truncate">
              <div className="text-[10px] font-mono text-white truncate leading-tight">
                {track?.trackName}
              </div>
              <div className="text-[9px] font-mono text-white/50 truncate leading-tight">
                {track?.artistName}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Toggle */}
      <div className="flex bg-black/40 rounded-full border border-white/10 overflow-hidden text-[9px] font-mono text-white/70 backdrop-blur-md">
        <button 
          onClick={() => setLanguage("english")}
          className={`px-2 py-1 cursor-pointer transition-colors ${language === "english" ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLanguage("tamil")}
          className={`px-2 py-1 cursor-pointer transition-colors ${language === "tamil" ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
        >
          TA
        </button>
      </div>
    </div>
  );
}
