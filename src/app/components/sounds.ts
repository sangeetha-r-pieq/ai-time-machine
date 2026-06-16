// Web Audio API — all sound generation
// AudioContext must be created after a user gesture (browser policy).

let _ctx: AudioContext | null = null;
let _ambient: OscillatorNode | null = null;
let _ambientGain: GainNode | null = null;

export function getAudioContext(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  return _ctx;
}

// ─── Time Travel Whoosh ───────────────────────────────────────────────────────
export function playTravelSound() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;

  // Oscillator 1: frequency sweep (low → high → low)
  const osc1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  osc1.type = "sawtooth";
  osc1.frequency.setValueAtTime(40, now);
  osc1.frequency.exponentialRampToValueAtTime(2400, now + 1.4);
  osc1.frequency.exponentialRampToValueAtTime(80, now + 2.8);
  g1.gain.setValueAtTime(0, now);
  g1.gain.linearRampToValueAtTime(0.25, now + 0.3);
  g1.gain.linearRampToValueAtTime(0.18, now + 1.4);
  g1.gain.linearRampToValueAtTime(0, now + 2.8);
  osc1.connect(g1); g1.connect(ctx.destination);
  osc1.start(now); osc1.stop(now + 2.8);

  // Oscillator 2: harmonic (higher frequency)
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(80, now);
  osc2.frequency.exponentialRampToValueAtTime(4800, now + 1.5);
  osc2.frequency.exponentialRampToValueAtTime(120, now + 2.8);
  g2.gain.setValueAtTime(0, now + 0.1);
  g2.gain.linearRampToValueAtTime(0.12, now + 0.5);
  g2.gain.linearRampToValueAtTime(0, now + 2.8);
  osc2.connect(g2); g2.connect(ctx.destination);
  osc2.start(now); osc2.stop(now + 2.8);

  // White noise burst
  const bufLen = ctx.sampleRate * 2.8;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(500, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(4000, now + 1.5);
  noiseFilter.Q.value = 0.5;
  noise.buffer = buf;
  noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ctx.destination);
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
  noiseGain.gain.linearRampToValueAtTime(0, now + 2.8);
  noise.start(now);
}

// ─── Arrival chord ────────────────────────────────────────────────────────────
export function playArrivalSound(baseFreq: number) {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;

  [1, 1.25, 1.5, 2].forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = baseFreq * ratio;
    g.gain.setValueAtTime(0, now + i * 0.05);
    g.gain.linearRampToValueAtTime(0.08, now + i * 0.05 + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 1.8);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 2);
  });
}

// ─── Message ping ─────────────────────────────────────────────────────────────
export function playPingSound(freq = 900) {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.12, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.4);
}

// ─── Ambient drone ────────────────────────────────────────────────────────────
export function startAmbient(freq: number, type: OscillatorType, gain: number) {
  stopAmbient();
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();

  _ambient = ctx.createOscillator();
  _ambientGain = ctx.createGain();
  _ambient.type = type;
  _ambient.frequency.value = freq;
  _ambientGain.gain.setValueAtTime(0, ctx.currentTime);
  _ambientGain.gain.linearRampToValueAtTime(gain, ctx.currentTime + 2);
  _ambient.connect(_ambientGain);
  _ambientGain.connect(ctx.destination);
  _ambient.start();
}

export function stopAmbient() {
  if (_ambient && _ambientGain) {
    const ctx = getAudioContext();
    _ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    const a = _ambient;
    setTimeout(() => { try { a.stop(); } catch {} }, 1100);
    _ambient = null;
    _ambientGain = null;
  }
}
