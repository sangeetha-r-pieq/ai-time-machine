export function playVoice(text: string, pitch = 1): void {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch;
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

export function stopVoice(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
