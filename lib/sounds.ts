// Web Audio API sound effects - no external files needed
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.15,
  ramp?: { freq: number; time: number }
) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (ramp) {
      osc.frequency.linearRampToValueAtTime(ramp.freq, ctx.currentTime + ramp.time);
    }
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported
  }
}

function playNoise(duration: number, volume = 0.08) {
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 800;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // Audio not supported
  }
}

// --- Sound effects ---

export function playButtonClick() {
  playTone(800, 0.08, "square", 0.08);
}

export function playTabSwitch() {
  playTone(600, 0.06, "sine", 0.06);
  setTimeout(() => playTone(900, 0.06, "sine", 0.06), 40);
}

export function playAttack() {
  // Fast aggressive sweep
  playTone(200, 0.15, "sawtooth", 0.12, { freq: 800, time: 0.05 });
  setTimeout(() => playNoise(0.1, 0.1), 50);
  setTimeout(() => playTone(400, 0.1, "square", 0.1, { freq: 100, time: 0.08 }), 100);
}

export function playAttackHit() {
  // Impact sound
  playTone(150, 0.2, "square", 0.15, { freq: 50, time: 0.15 });
  playNoise(0.15, 0.12);
}

export function playCriticalHit() {
  // Big dramatic hit
  playTone(100, 0.3, "sawtooth", 0.18, { freq: 40, time: 0.25 });
  playNoise(0.25, 0.15);
  setTimeout(() => playTone(600, 0.2, "square", 0.1, { freq: 1200, time: 0.1 }), 150);
  setTimeout(() => playTone(900, 0.15, "square", 0.08), 250);
}

export function playMiss() {
  // Whoosh
  playTone(500, 0.2, "sine", 0.06, { freq: 200, time: 0.15 });
}

export function playCriticalMiss() {
  // Sad descending
  playTone(400, 0.15, "square", 0.08);
  setTimeout(() => playTone(300, 0.15, "square", 0.08), 120);
  setTimeout(() => playTone(200, 0.25, "square", 0.1), 240);
}

export function playDamageReceived() {
  // Pain hit
  playTone(300, 0.1, "square", 0.12, { freq: 100, time: 0.08 });
  playNoise(0.12, 0.1);
  setTimeout(() => playTone(200, 0.15, "sawtooth", 0.1, { freq: 80, time: 0.1 }), 80);
}

export function playBadgeObtained() {
  // Triumphant fanfare
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.25, "square", 0.1), i * 120);
  });
  // Final sustain
  setTimeout(() => playTone(1047, 0.5, "sine", 0.12), 480);
}

export function playBadgeRemoved() {
  playTone(400, 0.1, "sine", 0.06, { freq: 250, time: 0.08 });
}

export function playPokeball() {
  // Pokeball throw - ascending whistle then bounce
  playTone(400, 0.15, "sine", 0.1, { freq: 1200, time: 0.12 });
  setTimeout(() => playTone(600, 0.1, "sine", 0.08), 200);
  setTimeout(() => playTone(500, 0.08, "sine", 0.06), 350);
  setTimeout(() => playTone(450, 0.06, "sine", 0.05), 450);
}
export function playSendPokemon() {
  // Efeito: Pokémon sendo lançado para o campo
  // 1. Ascendente rápido - tipo lançamento
  playTone(600, 0.12, "sine", 0.05, { freq: 1000, time: 0.12 });
  
  // 2. Descendente rápido - Pokémon chegando perto do chão
  setTimeout(() => playTone(550, 0.1, "sine", 0.05, { freq: 800, time: 0.1 }), 100);
  
  // 3. Pequeno “impacto” final no chão
  setTimeout(() => playTone(450, 0.08, "sine", 0.06, { freq: 600, time: 0.08 }), 220);
  
  // 4. Um pequeno “pop” ou efeito de brilho (opcional)
  setTimeout(() => playTone(700, 0.06, "triangle", 0.04), 300);
}


export function playDiceRoll() {
  // Rattling dice
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      playTone(800 + Math.random() * 400, 0.04, "square", 0.05);
    }, i * 60);
  }
}

export function playBuy() {
  // Cash register
  playTone(800, 0.08, "square", 0.08);
  setTimeout(() => playTone(1000, 0.08, "square", 0.08), 80);
  setTimeout(() => playTone(1200, 0.12, "sine", 0.1), 160);
}

export function playGift() {
  // Sparkle
  playTone(1200, 0.1, "sine", 0.08);
  setTimeout(() => playTone(1500, 0.1, "sine", 0.08), 100);
  setTimeout(() => playTone(1800, 0.15, "sine", 0.1), 200);
}

export function playLevelUp() {
  // Rising arpeggio
  const notes = [523, 659, 784, 988, 1175];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, "square", 0.08), i * 80);
  });
}

export function playEvolve() {
  // Stage 1 (0-2s): Mystery rising tones
  const introNotes = [262, 294, 330, 370, 392, 440];
  introNotes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.35, "sine", 0.07), i * 300);
  });

  // Stage 2 (2-6s): Rapid pulsing energy, getting faster
  for (let i = 0; i < 16; i++) {
    const delay = 2000 + i * 220 - i * 8;
    const freq = 500 + i * 50;
    setTimeout(() => playTone(freq, 0.12, "square", 0.06 + i * 0.003), delay);
  }

  // Stage 3 (6-8s): Climax ascending burst
  const burstNotes = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319];
  burstNotes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.25, "sine", 0.09), 6000 + i * 100);
  });

  // Stage 4 (8-9s): Triumphant fanfare
  setTimeout(() => {
    playTone(1047, 0.6, "sine", 0.12);
    playTone(1319, 0.6, "sine", 0.09);
    playTone(1568, 0.6, "sine", 0.07);
  }, 8000);

  // Final chord (9-10s)
  setTimeout(() => {
    playTone(1047, 0.8, "sine", 0.1);
    playTone(1319, 0.8, "sine", 0.08);
    playTone(1568, 0.8, "sine", 0.06);
    playTone(2093, 0.8, "sine", 0.05);
  }, 9000);
}

export function playHeal() {
  // Gentle ascending
  playTone(523, 0.15, "sine", 0.08);
  setTimeout(() => playTone(659, 0.15, "sine", 0.08), 120);
  setTimeout(() => playTone(784, 0.2, "sine", 0.1), 240);
}

export function playStartGame() {
  // Classic game start jingle
  setTimeout(() => playTone(523, 0.15, "square", 0.1), 0);
  setTimeout(() => playTone(659, 0.15, "square", 0.1), 150);
  setTimeout(() => playTone(784, 0.15, "square", 0.1), 300);
  setTimeout(() => playTone(1047, 0.4, "square", 0.12), 450);
  setTimeout(() => playTone(784, 0.15, "square", 0.08), 650);
  setTimeout(() => playTone(1047, 0.5, "sine", 0.12), 800);
}

export function playFlee() {
  // Quick descending run
  playTone(600, 0.08, "square", 0.06);
  setTimeout(() => playTone(500, 0.08, "square", 0.06), 60);
  setTimeout(() => playTone(400, 0.08, "square", 0.06), 120);
  setTimeout(() => playTone(300, 0.12, "square", 0.06), 180);
}

// -- Card system sounds --

export function playCardDraw() {
  // Card flip swoosh
  playNoise(0.06, 0.08);
  setTimeout(() => playTone(800, 0.06, "sine", 0.06), 30);
  setTimeout(() => playTone(1200, 0.08, "sine", 0.08), 80);
}

export function playCardLuck() {
  // Positive sparkle chime
  playTone(1047, 0.1, "sine", 0.08);
  setTimeout(() => playTone(1319, 0.1, "sine", 0.08), 80);
  setTimeout(() => playTone(1568, 0.12, "sine", 0.1), 160);
}

export function playCardBadLuck() {
  // Ominous low tone
  playTone(150, 0.2, "sawtooth", 0.1);
  setTimeout(() => playTone(120, 0.25, "sawtooth", 0.08), 100);
}

export function playLuckTrio() {
  // Triumphant golden fanfare
  const notes = [523, 659, 784, 1047, 1319, 1568];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, "sine", 0.1), i * 100);
  });
  setTimeout(() => {
    playTone(1568, 0.5, "sine", 0.12);
    playTone(1047, 0.5, "sine", 0.08);
  }, 700);
}

export function playBadLuckTrio() {
  // Dark ominous rumble with dissonant chords
  playTone(80, 0.4, "sawtooth", 0.15);
  playNoise(0.3, 0.12);
  setTimeout(() => playTone(100, 0.3, "sawtooth", 0.12), 200);
  setTimeout(() => playTone(130, 0.3, "sawtooth", 0.1), 350);
  setTimeout(() => {
    playTone(60, 0.5, "sawtooth", 0.15);
    playNoise(0.4, 0.1);
  }, 500);
}

export function playCardActivateLuck() {
  // Magic sparkle ascending with shimmer
  playTone(880, 0.12, "sine", 0.08);
  setTimeout(() => playTone(1047, 0.12, "sine", 0.08), 80);
  setTimeout(() => playTone(1319, 0.12, "sine", 0.09), 160);
  setTimeout(() => playTone(1568, 0.15, "sine", 0.1), 240);
  setTimeout(() => {
    playTone(1760, 0.3, "sine", 0.1);
    playTone(2093, 0.3, "sine", 0.06);
  }, 320);
}

export function playCardActivateDamage() {
  // Dark impact with crackle
  playTone(120, 0.25, "sawtooth", 0.14, { freq: 60, time: 0.2 });
  playNoise(0.15, 0.12);
  setTimeout(() => {
    playTone(200, 0.12, "square", 0.1, { freq: 80, time: 0.1 });
    playNoise(0.1, 0.08);
  }, 100);
  setTimeout(() => playTone(100, 0.3, "sawtooth", 0.1, { freq: 40, time: 0.25 }), 200);
}

export function playCardActivateCritDamage() {
  // Same type match - heavier impact with dissonant ring
  playTone(80, 0.3, "sawtooth", 0.16, { freq: 40, time: 0.25 });
  playNoise(0.2, 0.14);
  setTimeout(() => {
    playTone(150, 0.15, "square", 0.12, { freq: 60, time: 0.12 });
    playNoise(0.15, 0.1);
  }, 80);
  setTimeout(() => {
    playTone(250, 0.1, "sawtooth", 0.1);
    playTone(263, 0.1, "sawtooth", 0.08); // dissonant
  }, 180);
  setTimeout(() => playTone(60, 0.4, "sawtooth", 0.12, { freq: 30, time: 0.35 }), 280);
}

export function playTrioPunishment() {
  // Massive damage - earthquake rumble + explosion
  playTone(50, 0.5, "sawtooth", 0.18, { freq: 30, time: 0.4 });
  playNoise(0.4, 0.16);
  setTimeout(() => {
    playTone(80, 0.3, "square", 0.14, { freq: 40, time: 0.25 });
    playNoise(0.3, 0.14);
  }, 150);
  setTimeout(() => {
    playTone(120, 0.2, "sawtooth", 0.12);
    playTone(127, 0.2, "sawtooth", 0.1); // dissonant
    playNoise(0.2, 0.12);
  }, 300);
  setTimeout(() => {
    playTone(60, 0.6, "sawtooth", 0.15, { freq: 25, time: 0.5 });
    playNoise(0.5, 0.1);
  }, 500);
}
