import { motion } from "motion/react";
import { type EraConfig } from "./era-config";

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

// ─── Person Silhouettes ───────────────────────────────────────────────────────

type PersonVariant = EraConfig["personVariant"];

function PersonSilhouette({ variant }: { variant: PersonVariant }) {
  const fill = "rgba(0,0,0,0.88)";
  const svgProps = { viewBox: "0 0 80 200", width: 80, height: 200, style: { display: "block" } };

  if (variant === "prehistoric") return (
    <svg {...svgProps}>
      <ellipse cx="43" cy="30" rx="15" ry="17" fill={fill} />
      <path d="M25,44 Q14,62 12,95 Q10,128 16,162 Q22,175 38,178 Q54,178 60,163 Q66,130 64,97 Q62,64 52,46 Q46,40 43,44 Q36,42 25,44 Z" fill={fill} />
      <path d="M25,52 Q14,72 18,108 L27,106 Q24,75 33,58 Z" fill={fill} />
      <path d="M52,52 Q64,72 60,108 L51,106 Q54,75 46,58 Z" fill={fill} />
      <rect x="22" y="174" width="13" height="24" rx="4" fill={fill} />
      <rect x="42" y="174" width="13" height="24" rx="4" fill={fill} />
      <line x1="66" y1="14" x2="60" y2="175" stroke={fill} strokeWidth="3" />
      <polygon points="66,8 62,20 70,20" fill={fill} />
    </svg>
  );

  if (variant === "ancient") return (
    <svg {...svgProps}>
      <rect x="24" y="4" width="32" height="11" fill={fill} />
      <rect x="24" y="4" width="9" height="42" fill={fill} />
      <rect x="47" y="4" width="9" height="42" fill={fill} />
      <ellipse cx="40" cy="28" rx="14" ry="16" fill={fill} />
      <path d="M26,44 L24,158 L56,158 L54,44 Z" fill={fill} />
      <rect x="24" y="95" width="32" height="5" fill="rgba(0,0,0,0.3)" />
      <rect x="14" y="52" width="12" height="60" rx="5" fill={fill} />
      <rect x="54" y="52" width="12" height="60" rx="5" fill={fill} />
      <rect x="29" y="157" width="10" height="40" rx="3" fill={fill} />
      <rect x="42" y="157" width="10" height="40" rx="3" fill={fill} />
      <line x1="68" y1="52" x2="68" y2="155" stroke={fill} strokeWidth="3" />
      <ellipse cx="68" cy="48" rx="5" ry="6" fill="none" stroke={fill} strokeWidth="2.5" />
    </svg>
  );

  if (variant === "medieval") return (
    <svg {...svgProps}>
      <ellipse cx="40" cy="26" rx="14" ry="16" fill={fill} />
      <path d="M17,22 Q14,38 12,56 L68,56 Q66,38 63,22 Q52,16 40,18 Q28,16 17,22 Z" fill={fill} />
      <path d="M12,56 Q5,115 10,182 L70,182 Q75,115 68,56 Z" fill={fill} />
    </svg>
  );

  if (variant === "industrial") return (
    <svg {...svgProps}>
      <rect x="28" y="4" width="24" height="30" fill={fill} />
      <rect x="20" y="34" width="40" height="5" fill={fill} />
      <ellipse cx="40" cy="52" rx="13" ry="14" fill={fill} />
      <path d="M24,66 L20,168 L36,168 L40,132 L44,168 L60,168 L56,66 Z" fill={fill} />
      <rect x="12" y="70" width="14" height="65" rx="5" fill={fill} />
      <rect x="54" y="70" width="14" height="65" rx="5" fill={fill} />
      <line x1="58" y1="80" x2="66" y2="178" stroke={fill} strokeWidth="3" />
      <circle cx="64" cy="80" r="4" fill={fill} />
    </svg>
  );

  if (variant === "wartime") return (
    <svg {...svgProps}>
      <ellipse cx="40" cy="30" rx="20" ry="12" fill={fill} />
      <ellipse cx="40" cy="34" rx="14" ry="14" fill={fill} />
      <path d="M22,50 L20,140 L38,140 L40,120 L42,140 L60,140 L58,50 Z" fill={fill} />
      <rect x="10" y="54" width="14" height="65" rx="4" fill={fill} />
      <rect x="56" y="54" width="14" height="65" rx="4" fill={fill} />
      <rect x="25" y="138" width="14" height="58" rx="4" fill={fill} />
      <rect x="41" y="138" width="14" height="58" rx="4" fill={fill} />
    </svg>
  );

  if (variant === "analog") return (
    <svg {...svgProps}>
      <rect x="28" y="12" width="24" height="10" rx="2" fill={fill} />
      <rect x="22" y="8" width="36" height="5" fill={fill} />
      <circle cx="40" cy="32" r="16" fill={fill} />
      <path d="M23,50 L20,142 L37,142 L40,122 L43,142 L60,142 L57,50 Z" fill={fill} />
      <rect x="10" y="54" width="13" height="65" rx="5" fill={fill} />
      <rect x="57" y="54" width="13" height="65" rx="5" fill={fill} />
      <rect x="25" y="140" width="13" height="56" rx="4" fill={fill} />
      <rect x="42" y="140" width="13" height="56" rx="4" fill={fill} />
    </svg>
  );

  if (variant === "future") return (
    <svg {...svgProps}>
      <ellipse cx="40" cy="28" rx="17" ry="19" fill={fill} />
      <path d="M24,24 Q40,19 56,24 Q57,31 40,34 Q23,31 24,24 Z" fill="rgba(0,100,200,0.35)" />
      <path d="M23,48 L22,142 L37,142 L40,122 L43,142 L58,142 L57,48 Z" fill={fill} />
      <rect x="13" y="48" width="14" height="8" rx="4" fill={fill} />
      <rect x="53" y="48" width="14" height="8" rx="4" fill={fill} />
      <rect x="13" y="56" width="12" height="55" rx="4" fill={fill} />
      <rect x="55" y="56" width="12" height="55" rx="4" fill={fill} />
      <rect x="26" y="140" width="13" height="56" rx="5" fill={fill} />
      <rect x="41" y="140" width="13" height="56" rx="5" fill={fill} />
    </svg>
  );

  // modern (default)
  return (
    <svg {...svgProps}>
      <circle cx="40" cy="28" r="17" fill={fill} />
      <path d="M22,46 L20,142 L37,142 L40,122 L43,142 L60,142 L58,46 Z" fill={fill} />
      <path d="M22,50 L12,122 L22,124 L30,62 Z" fill={fill} />
      <path d="M58,50 L68,122 L58,124 L50,62 Z" fill={fill} />
      <rect x="25" y="140" width="14" height="56" rx="5" fill={fill} />
      <rect x="41" y="140" width="14" height="56" rx="5" fill={fill} />
    </svg>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────

function Particles({ type, color }: { type: EraConfig["particleType"]; color: string }) {
  if (type === "none") return null;
  const count = type === "digital" ? 30 : type === "smoke" ? 8 : 20;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes floatUp { from { transform: translateY(0) translateX(0); opacity: 1; } to { transform: translateY(-100vh) translateX(var(--drift)); opacity: 0; } }
        @keyframes driftRight { from { transform: translateX(-5vw) translateY(0); opacity: 0; } 50% { opacity: 1; } to { transform: translateX(110vw) translateY(var(--fall)); opacity: 0; } }
        @keyframes fallDown { from { transform: translateY(-5vh) translateX(0); opacity: 0; } 20% { opacity: 1; } to { transform: translateY(105vh) translateX(var(--drift)); opacity: 0; } }
        @keyframes pulseFog { 0%,100% { opacity: 0.04; transform: scale(1) translateX(0); } 50% { opacity: 0.09; transform: scale(1.05) translateX(2%); } }
        @keyframes sparkleDrift { 0% { opacity: 0; transform: translateY(30px) scale(0); } 20% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-80px) scale(0.3); } }
      `}</style>

      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const dur = 4 + Math.random() * 8;
        const size = type === "smoke" ? 60 + Math.random() * 80 : type === "fog" ? 200 + Math.random() * 300 : type === "digital" ? 3 : 3 + Math.random() * 3;

        if (type === "embers" || type === "sparks") return (
          <div key={i} style={{
            position: "absolute",
            left: `${left}%`,
            bottom: "20%",
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 4px ${color}`,
            animation: `floatUp ${dur}s ${delay}s infinite ease-out`,
            "--drift": `${(Math.random() - 0.5) * 60}px`,
          } as React.CSSProperties} />
        );

        if (type === "sand") return (
          <div key={i} style={{
            position: "absolute",
            left: `${Math.random() * 20}%`,
            top: `${20 + Math.random() * 60}%`,
            width: 40 + Math.random() * 60,
            height: 1 + Math.random() * 1.5,
            background: color,
            borderRadius: 2,
            animation: `driftRight ${dur}s ${delay}s infinite linear`,
            "--fall": `${(Math.random() - 0.5) * 30}px`,
          } as React.CSSProperties} />
        );

        if (type === "leaves") return (
          <div key={i} style={{
            position: "absolute",
            left: `${left}%`,
            top: "-4%",
            width: size,
            height: size,
            background: color,
            borderRadius: "40% 60% 50% 30%",
            animation: `fallDown ${dur}s ${delay}s infinite ease-in`,
            "--drift": `${(Math.random() - 0.5) * 60}px`,
          } as React.CSSProperties} />
        );

        if (type === "smoke") return (
          <div key={i} style={{
            position: "absolute",
            left: `${left}%`,
            bottom: "38%",
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
            filter: "blur(20px)",
            animation: `floatUp ${dur * 2}s ${delay}s infinite ease-out`,
            "--drift": `${(Math.random() - 0.5) * 40}px`,
          } as React.CSSProperties} />
        );

        if (type === "fog") return (
          <div key={i} style={{
            position: "absolute",
            left: `${(i / count) * 100 - 10}%`,
            top: `${40 + (i % 3) * 15}%`,
            width: size,
            height: size / 3,
            borderRadius: "50%",
            background: color,
            filter: "blur(30px)",
            animation: `pulseFog ${8 + i * 1.5}s ${delay}s infinite ease-in-out`,
          } as React.CSSProperties} />
        );

        if (type === "digital") return (
          <div key={i} style={{
            position: "absolute",
            left: `${left}%`,
            top: "-2%",
            width: 1.5,
            height: 8 + Math.random() * 12,
            background: color,
            borderRadius: 1,
            animation: `fallDown ${dur * 0.6}s ${delay}s infinite linear`,
            "--drift": "0px",
          } as React.CSSProperties} />
        );

        return null;
      })}
    </div>
  );
}

// ─── EraScene ─────────────────────────────────────────────────────────────────

interface Props {
  config: EraConfig;
  year: number;
}

export function EraScene({ config, year }: Props) {
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
    >
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: config.skyGradient }} />

      {/* Atmosphere tint */}
      {config.atmosphereColor && (
        <div className="absolute inset-0" style={{ background: config.atmosphereColor }} />
      )}

      {/* Horizon silhouettes — bottom 30% of scene */}
      <div className="absolute left-0 right-0" style={{ bottom: "22%", height: "30%" }}>
        {horizons[config.id] ?? horizons.present}
      </div>

      {/* Ground */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: "22%", background: config.groundGradient }}
      />

      {/* Particles */}
      <Particles type={config.particleType} color={config.particleColor} />

      {/* Person — centered, standing on ground */}
      <motion.div
        className="absolute"
        style={{ bottom: "22%", left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
      >
        <PersonSilhouette variant={config.personVariant} />
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
