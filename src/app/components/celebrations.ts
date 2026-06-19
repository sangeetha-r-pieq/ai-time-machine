import confetti from "canvas-confetti";
import type { EraId } from "./era-config";

const ERA_COLORS: Record<EraId, string[]> = {
  prehistoric: ["#ff6600", "#ff8c00", "#cc4400"],
  ancient: ["#d4af37", "#f0c040", "#8b6914"],
  classical: ["#c9a96e", "#e8d5a3", "#8b7355"],
  medieval: ["#6b4c9a", "#9b7ec8", "#3d2a5c"],
  industrial: ["#8b7355", "#a09080", "#4a4a4a"],
  wartime: ["#8b8b6b", "#a0a080", "#5c5c4a"],
  analog: ["#4a90d9", "#87ceeb", "#2c5f8a"],
  digital: ["#00ffcc", "#ff00dc", "#0066ff"],
  present: ["#3b82f6", "#8b5cf6", "#06b6d4"],
  future: ["#a855f7", "#06ffa5", "#ff00aa"],
};

export function fireStampCelebration(eraId: EraId) {
  const colors = ERA_COLORS[eraId] ?? ["#a855f7", "#ffffff"];
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65, x: 0.5 },
    colors,
    ticks: 200,
    gravity: 0.8,
    scalar: 0.9,
  });
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 200);
}

export function fireSouvenirCelebration(eraId: EraId) {
  const colors = ERA_COLORS[eraId] ?? ["#fbbf24", "#ffffff"];
  const duration = 1200;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.75 },
      colors,
      shapes: ["star", "circle"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.75 },
      colors,
      shapes: ["star", "circle"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export function fireCompleteCollectionCelebration() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#a855f7", "#fbbf24", "#06ffa5", "#3b82f6", "#ff6600"],
  });
}
