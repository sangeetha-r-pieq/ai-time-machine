import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type EraConfig } from "./era-config";
import { ERA_HOTSPOTS } from "./era-hotspots";
import { SceneParticles } from "./SceneParticles";
import { CartoonCharacter } from "./CartoonCharacter";
import { getAgentAvatar } from "./india-content";
import { playPingSound } from "./sounds";

// ─── Horizon SVGs per era ────────────────────────────────────────────────────

function PrehistoricHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,180 L0,105 L100,50 L200,90 L320,35 L460,75 L580,22 L710,65 L840,28 L970,62 L1080,30 L1200,58 L1200,180 Z" fill={dark} />
      <path d="M0,180 L0,148 L35,128 L75,152 L115,125 L155,148 L195,120 L235,145 L275,122 L315,150 L355,124 L395,152 L435,124 L475,150 L515,123 L555,150 L595,122 L635,150 L675,123 L715,152 L755,122 L795,150 L835,122 L875,150 L915,124 L955,152 L995,122 L1035,150 L1075,122 L1115,150 L1155,124 L1200,150 L1200,180 Z" fill={near} />
    </svg>
  );
}

function AncientHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      <polygon points="60,180 360,18 660,180" fill={dark} />
      <polygon points="520,180 760,55 1000,180" fill={near} />
      <polygon points="900,180 1050,88 1200,180" fill={dark} />
      {/* Obelisk */}
      <rect x="180" y="100" width="10" height="80" fill={near} />
      <polygon points="180,100 185,80 190,100" fill={near} />
      {/* Palm trees */}
      <rect x="78" y="145" width="7" height="35" fill={near} />
      <ellipse cx="81" cy="143" rx="20" ry="9" fill={near} />
      <rect x="720" y="148" width="6" height="32" fill={near} />
      <ellipse cx="723" cy="146" rx="18" ry="8" fill={near} />
    </svg>
  );
}

function ClassicalHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,180 L0,145 Q300,115 600,135 Q900,155 1200,128 L1200,180 Z" fill={near} />
      {/* Parthenon-style columns */}
      {[150,168,186,204,222,240,258,276,294,312].map((x,i) => (
        <rect key={i} x={x} y={80} width={10} height={80} fill={dark} />
      ))}
      <rect x="140" y="75" width="185" height="8" fill={dark} />
      <rect x="132" y="155" width="200" height="10" fill={dark} />
      {/* Dome structure right */}
      <rect x="700" y="100" width="200" height="80" fill={near} />
      <ellipse cx="800" cy="100" rx="100" ry="35" fill={dark} />
    </svg>
  );
}

function MedievalHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,180 L0,148 Q250,118 500,138 Q750,158 1000,130 Q1100,118 1200,125 L1200,180 Z" fill={near} />
      {/* Castle - left */}
      <rect x="80" y="85" width="240" height="95" fill={dark} />
      {[80,100,120,140,160,180,200,220,240,260,280,300].map((x,i) => (
        <rect key={i} x={x} y={77} width={14} height={12} fill={dark} />
      ))}
      <rect x="170" y="118" width="55" height="62" fill="rgba(0,0,0,0.6)" />
      {/* Tower */}
      <rect x="60" y="60" width="50" height="126" fill={dark} />
      {[60,74,88].map((x,i) => <rect key={i} x={x} y={52} width={14} height={12} fill={dark} />)}
      {/* Church right */}
      <rect x="820" y="108" width="90" height="72" fill={dark} />
      <rect x="845" y="60" width="40" height="50" fill={dark} />
      <polygon points="845,60 865,22 885,60" fill={near} />
      <rect x="861" y="28" width="8" height="20" fill={near} />
      <rect x="855" y="34" width="20" height="6" fill={near} />
    </svg>
  );
}

function IndustrialHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      <rect x="0" y="88" width="180" height="92" fill={dark} />
      <rect x="170" y="112" width="140" height="68" fill={near} />
      <rect x="360" y="72" width="200" height="108" fill={dark} />
      <rect x="620" y="95" width="160" height="85" fill={near} />
      <rect x="820" y="78" width="200" height="102" fill={dark} />
      <rect x="1050" y="98" width="150" height="82" fill={near} />
      {/* Chimneys */}
      {[[30,38],[85,48],[420,32],[475,42],[530,28],[650,50],[850,38],[920,48],[1080,35]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width={22} height={52-y+42} fill={near} />
      ))}
    </svg>
  );
}

function WartimeHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      {/* Rubble/damaged ground */}
      <path d="M0,180 L0,160 L50,148 L90,162 L140,145 L200,158 L260,142 L330,155 L400,148 L480,160 L560,145 L640,158 L720,148 L800,162 L880,148 L960,162 L1040,148 L1120,160 L1200,150 L1200,180 Z" fill={near} />
      {/* Damaged buildings */}
      <rect x="20" y="95" width="110" height="85" fill={dark} />
      <path d="M110,95 L130,70 L150,95 Z" fill={near} /> {/* Rubble on top */}
      <rect x="180" y="78" width="90" height="102" fill={near} />
      <path d="M245,78 L260,55 L270,78 Z" fill={dark} />
      <rect x="400" y="88" width="130" height="92" fill={dark} />
      <path d="M480,88 L510,60 L530,88 Z" fill={near} />
      <rect x="700" y="70" width="100" height="110" fill={near} />
      <rect x="900" y="85" width="140" height="95" fill={dark} />
      {/* Searchlight beams */}
      <path d="M120,180 L145,5 L165,5 L145,180 Z" fill="rgba(255,255,220,0.025)" />
      <path d="M980,180 L1010,5 L1030,5 L1010,180 Z" fill="rgba(255,255,220,0.025)" />
    </svg>
  );
}

function AnalogHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,180 L0,148 Q200,122 400,138 Q600,155 800,132 Q1000,112 1200,128 L1200,180 Z" fill={near} />
      {/* Row of suburb houses */}
      {[[30,118],[145,112],[260,115],[375,110],[490,118],[605,112]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y+20} width={90} height={62-y+118} fill={dark} />
          <polygon points={`${x},${y+20} ${x+45},${y} ${x+90},${y+20}`} fill={near} />
          {/* Window */}
          <rect x={x+15} y={y+32} width={22} height={18} fill="rgba(0,0,0,0.5)" />
          <rect x={x+53} y={y+32} width={22} height={18} fill="rgba(0,0,0,0.5)" />
        </g>
      ))}
      {/* TV antenna on first house */}
      <line x1="75" y1="118" x2="75" y2="96" stroke={near} strokeWidth="1.5" />
      <line x1="60" y1="100" x2="90" y2="100" stroke={near} strokeWidth="1.5" />
      <line x1="63" y1="102" x2="75" y2="96" stroke={near} strokeWidth="1" />
      <line x1="87" y1="102" x2="75" y2="96" stroke={near} strokeWidth="1" />
      {/* Water tower */}
      <rect x="1060" y="88" width="5" height="62" fill={dark} />
      <rect x="1075" y="88" width="5" height="62" fill={dark} />
      <rect x="1090" y="88" width="5" height="62" fill={dark} />
      <ellipse cx="1075" cy="86" rx="22" ry="16" fill={dark} />
      <rect x="1053" y="138" width="44" height="6" fill={dark} />
    </svg>
  );
}

function DigitalHorizon({ dark, near }: { dark: string; near: string }) {
  const heights = [60,100,40,50,32,70,88,42,55,35,65,90,45,38,75,50,62,48,38,80];
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      {heights.map((h, i) => (
        <rect key={i} x={i * 62} y={180 - h - 80} width={55} height={h + 80} fill={i % 2 === 0 ? dark : near} />
      ))}
      {/* Neon window accents */}
      <rect x="100" y="58" width="9" height="5" fill="rgba(255,0,220,0.5)" />
      <rect x="224" y="45" width="9" height="5" fill="rgba(0,255,200,0.4)" />
      <rect x="534" y="50" width="9" height="5" fill="rgba(255,0,220,0.4)" />
      <rect x="720" y="42" width="9" height="5" fill="rgba(0,255,200,0.5)" />
      <rect x="906" y="55" width="9" height="5" fill="rgba(255,0,220,0.4)" />
    </svg>
  );
}

function PresentHorizon({ dark, near }: { dark: string; near: string }) {
  const buildings = [
    [0,100,55],[50,65,70],[115,80,60],[170,40,90],[255,60,75],[325,45,85],[405,70,60],[460,28,100],[555,55,75],[625,42,80],[700,65,65],[760,22,110],[865,50,80],[910,68,65],[972,38,90],[1055,60,75],[1125,50,80]
  ];
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      {buildings.map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={180 - y} fill={i % 2 === 0 ? dark : near} />
      ))}
      {/* Crane */}
      <rect x="462" y="26" width="3" height="5" fill={near} />
      <rect x="450" y="26" width="36" height="3" fill={near} />
    </svg>
  );
}

function FutureHorizon({ dark, near }: { dark: string; near: string }) {
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className="w-full h-full">
      {/* Curved organic towers */}
      <path d="M40,180 Q35,120 48,55 Q58,10 70,52 Q82,115 78,180 Z" fill={dark} />
      <path d="M160,180 Q154,130 168,45 Q178,5 190,42 Q202,125 197,180 Z" fill={near} />
      <path d="M310,180 Q306,140 318,28 Q325,2 332,25 Q340,138 336,180 Z" fill={dark} />
      <path d="M420,180 Q412,115 432,55 Q448,15 468,52 Q488,108 482,180 Z" fill={near} />
      <path d="M560,180 Q554,138 566,32 Q574,2 582,30 Q590,135 585,180 Z" fill={dark} />
      <path d="M680,180 Q672,118 695,62 Q715,22 735,58 Q755,112 748,180 Z" fill={near} />
      <path d="M830,180 Q824,138 838,28 Q846,2 854,25 Q862,135 857,180 Z" fill={dark} />
      <path d="M960,180 Q952,115 974,55 Q990,15 1008,52 Q1026,112 1020,180 Z" fill={near} />
      <path d="M1080,180 Q1074,130 1088,40 Q1096,5 1104,38 Q1112,128 1107,180 Z" fill={dark} />
      {/* Floating platforms */}
      <rect x="560" y="30" width="80" height="7" rx="3" fill={near} />
      <rect x="830" y="26" width="65" height="6" rx="3" fill={near} />
      <rect x="160" y="43" width="60" height="5" rx="2" fill={dark} />
    </svg>
  );
}

// ─── EraScene ─────────────────────────────────────────────────────────────────

interface Props {
  config: EraConfig;
  year: number;
  backgroundUrl?: string;
  isTalking?: boolean;
  sceneReaction?: number;
  onHotspotLore?: (lore: string) => void;
}

export function EraScene({ config, year, backgroundUrl, isTalking = false, sceneReaction = 0, onHotspotLore }: Props) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [particleBurst, setParticleBurst] = useState(0);
  const [personWave, setPersonWave] = useState(false);

  useEffect(() => {
    if (sceneReaction > 0) setParticleBurst(b => b + 2);
  }, [sceneReaction]);

  const hotspots = ERA_HOTSPOTS[config.id] ?? [];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: x * 12, y: y * 8 });
  }, []);

  const handleSkyClick = () => {
    setParticleBurst(b => b + 1);
    playPingSound(config.ambientFreq);
  };

  const handlePersonClick = () => {
    setPersonWave(true);
    const agent = config.agents[0];
    const line = agent.fallback[Math.floor(Math.random() * agent.fallback.length)];
    onHotspotLore?.(line);
    setTimeout(() => setPersonWave(false), 1200);
  };
  const horizons: Record<string, JSX.Element> = {
    prehistoric: <PrehistoricHorizon dark={config.horizonDark} near={config.horizonNear} />,
    ancient:     <AncientHorizon     dark={config.horizonDark} near={config.horizonNear} />,
    classical:   <ClassicalHorizon   dark={config.horizonDark} near={config.horizonNear} />,
    medieval:    <MedievalHorizon    dark={config.horizonDark} near={config.horizonNear} />,
    industrial:  <IndustrialHorizon  dark={config.horizonDark} near={config.horizonNear} />,
    wartime:     <WartimeHorizon     dark={config.horizonDark} near={config.horizonNear} />,
    analog:      <AnalogHorizon      dark={config.horizonDark} near={config.horizonNear} />,
    digital:     <DigitalHorizon     dark={config.horizonDark} near={config.horizonNear} />,
    present:     <PresentHorizon     dark={config.horizonDark} near={config.horizonNear} />,
    future:      <FutureHorizon      dark={config.horizonDark} near={config.horizonNear} />,
  };

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ zIndex: 0 }}
      onMouseMove={handleMouseMove}
    >
      {/* AI-generated India background */}
      {backgroundUrl && (
        <img
          src={backgroundUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Sky — clickable for particle burst; tinted overlay when AI bg present */}
      <div
        className="absolute inset-0 cursor-crosshair"
        style={{
          background: config.skyGradient,
          opacity: backgroundUrl ? 0.45 : 1,
          zIndex: 1,
        }}
        onClick={handleSkyClick}
      />

      {/* Atmosphere tint */}
      {config.atmosphereColor && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: config.atmosphereColor }}
          animate={{ x: parallax.x * 0.3, y: parallax.y * 0.3 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      )}

      {/* Horizon silhouettes — bottom 30% of scene */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: "22%", height: "30%", opacity: backgroundUrl ? 0.55 : 1, zIndex: 2 }}
        animate={{ x: parallax.x * 0.6, y: parallax.y * 0.4 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        {horizons[config.id] ?? horizons.present}
      </motion.div>

      {/* Ground */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{ height: "22%", background: config.groundGradient }}
      />

      {/* Particles */}
      <SceneParticles type={config.particleType} color={config.particleColor} burst={particleBurst} />

      {/* Interactive hotspots */}
      {hotspots.map(spot => (
        <button
          key={spot.id}
          type="button"
          className="absolute z-[5] group"
          style={{ left: spot.left, top: spot.top, transform: "translate(-50%, -50%)" }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
            playPingSound(config.ambientFreq * 1.5);
          }}
        >
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ background: config.accentColor, boxShadow: `0 0 12px ${config.accentColor}` }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <AnimatePresence>
            {activeHotspot === spot.id && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 p-3 rounded-xl text-left pointer-events-none"
                style={{
                  background: "rgba(0,0,0,0.85)",
                  border: `1px solid ${config.accentColor}44`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", color: config.accentColor, marginBottom: 4 }}>
                  {spot.label.toUpperCase()}
                </div>
                <div style={{ fontSize: "11px", lineHeight: 1.5, color: "rgba(255,255,255,0.85)", fontFamily: config.fontFamily }}>
                  {spot.lore}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      ))}

      {/* Person — centered, clickable */}
      <motion.div
        className="absolute z-[4] cursor-pointer"
        style={{ bottom: "22%", left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 1,
          y: personWave ? -8 : isTalking ? [0, -3, 0] : 0,
          scale: isTalking ? [1, 1.02, 1] : 1,
        }}
        transition={{
          opacity: { delay: 0.5, duration: 0.7 },
          y: isTalking ? { duration: 0.6, repeat: Infinity } : { duration: 0.3 },
          scale: isTalking ? { duration: 0.6, repeat: Infinity } : { duration: 0.3 },
        }}
        onClick={(e) => { e.stopPropagation(); handlePersonClick(); }}
        title="Click to greet"
      >
        <CartoonCharacter
          variant={config.personVariant}
          accentColor={config.accentColor}
          isTalking={isTalking || personWave}
          avatarEmoji={getAgentAvatar(config.id, config.agents[0].id)}
        />
      </motion.div>

      {/* Ground shadow under person */}
      <div
        className="absolute"
        style={{
          bottom: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 6,
          background: "rgba(0,0,0,0.4)",
          borderRadius: "50%",
          filter: "blur(4px)",
        }}
      />

      {/* Bottom ground-to-black gradient overlay (for chat panel readability) */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: "42%", background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)", zIndex: 2, pointerEvents: "none" }}
      />
    </motion.div>
  );
}
