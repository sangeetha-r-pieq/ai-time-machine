import type { EraConfig } from "./era-config";

interface Props {
  type: EraConfig["particleType"];
  color: string;
  burst?: number;
}

export function SceneParticles({ type, color, burst = 0 }: Props) {
  if (type === "none") return null;
  const count = (type === "digital" ? 30 : type === "smoke" ? 8 : 20) + burst * 8;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes floatUp { from { transform: translateY(0) translateX(0); opacity: 1; } to { transform: translateY(-100vh) translateX(var(--drift)); opacity: 0; } }
        @keyframes driftRight { from { transform: translateX(-5vw) translateY(0); opacity: 0; } 50% { opacity: 1; } to { transform: translateX(110vw) translateY(var(--fall)); opacity: 0; } }
        @keyframes fallDown { from { transform: translateY(-5vh) translateX(0); opacity: 0; } 20% { opacity: 1; } to { transform: translateY(105vh) translateX(var(--drift)); opacity: 0; } }
        @keyframes pulseFog { 0%,100% { opacity: 0.04; transform: scale(1) translateX(0); } 50% { opacity: 0.09; transform: scale(1.05) translateX(2%); } }
      `}</style>

      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const dur = 4 + Math.random() * 8;
        const size = type === "smoke" ? 60 + Math.random() * 80 : type === "fog" ? 200 + Math.random() * 300 : type === "digital" ? 3 : 3 + Math.random() * 3;

        if (type === "embers" || type === "sparks") return (
          <div key={`${burst}-${i}`} style={{
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
          <div key={`${burst}-${i}`} style={{
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

        if (type === "leaves" || type === "snow") return (
          <div key={`${burst}-${i}`} style={{
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
          <div key={`${burst}-${i}`} style={{
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
          <div key={`${burst}-${i}`} style={{
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
          <div key={`${burst}-${i}`} style={{
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
