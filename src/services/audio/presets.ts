/**
 * Реестр пресетов процедурного звука.
 * Каждый пресет — функция, создающая звук через Web Audio API.
 */

import type { AudioPresetId, PresetFactory, PresetInstance } from './types';
import { getBrownNoiseBuffer } from './noise';

// ─── Общие константы ───────────────────────────────────────────────────────

/** Громкость ambient-звуков (0..1) */
const AMBIENT_GAIN = 0.5;

/** Громкость tension-звуков (0..1) */
const TENSION_GAIN = 0.6;

/** Громкость sting-звуков (0..1) */
const STING_GAIN = 0.8;

/** Громкость organ-подобных звуков (0..1) */
const ORGAN_GAIN = 0.5;

/** Длительность fade для silence (сек) */
const SILENCE_FADE_SEC = 0.4;

/** Длительность death sting (сек) */
export const STING_DURATION_SEC = 1.2;

// ─── Пресеты ───────────────────────────────────────────────────────────────

/**
 * Silence — пустой пресет, ничего не играет.
 */
const silence: PresetFactory = (): PresetInstance => {
  return { stop: () => {} };
};

/**
 * Menu theme — низкий дрон + редкие "фортепианные" ноты.
 * Дрон: sine 55 Hz, LFO 0.1 Hz для пульсации.
 * Ноты: каждые 4 секунды — sine 220 Hz с огибающей.
 */
const menuTheme: PresetFactory = (ctx, destination): PresetInstance => {
  // Дрон
  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 55;

  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.15;

  // LFO для пульсации
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.08;

  lfo.connect(lfoGain);
  lfoGain.connect(droneGain.gain);

  drone.connect(droneGain);
  droneGain.connect(destination);

  drone.start();
  lfo.start();

  // Ноты каждые 4 секунды
  const intervalId = setInterval(() => {
    const now = ctx.currentTime;
    const note = ctx.createOscillator();
    note.type = 'sine';
    note.frequency.value = 220;

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.12, now + 0.05); // атака 50 мс
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // спад 1.5 с

    note.connect(noteGain);
    noteGain.connect(destination);

    note.start(now);
    note.stop(now + 1.5);
  }, 4000);

  return {
    stop: () => {
      clearInterval(intervalId);
      drone.stop();
      lfo.stop();
    },
  };
};

/**
 * Summary theme — то же, что menu_theme, но LFO 0.15 Hz, дрон 65 Hz.
 */
const summaryTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 65;

  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.15;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.15;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.08;

  lfo.connect(lfoGain);
  lfoGain.connect(droneGain.gain);

  drone.connect(droneGain);
  droneGain.connect(destination);

  drone.start();
  lfo.start();

  const intervalId = setInterval(() => {
    const now = ctx.currentTime;
    const note = ctx.createOscillator();
    note.type = 'sine';
    note.frequency.value = 220;

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    note.connect(noteGain);
    noteGain.connect(destination);

    note.start(now);
    note.stop(now + 1.5);
  }, 4000);

  return {
    stop: () => {
      clearInterval(intervalId);
      drone.stop();
      lfo.stop();
    },
  };
};

/**
 * Train ambient — brown noise через lowpass + LFO для "дыхания".
 */
const trainAmbient: PresetFactory = (ctx, destination): PresetInstance => {
  const noiseBuffer = getBrownNoiseBuffer(ctx);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;
  filter.Q.value = 1;

  const gain = ctx.createGain();
  gain.gain.value = AMBIENT_GAIN;

  // LFO для "дыхания" рокота
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.15;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.2;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  noise.start();
  lfo.start();

  return {
    stop: () => {
      noise.stop();
      lfo.stop();
    },
  };
};

/**
 * Night corridor — brown noise через низкий lowpass.
 */
const nightCorridor: PresetFactory = (ctx, destination): PresetInstance => {
  const noiseBuffer = getBrownNoiseBuffer(ctx);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 120;

  const gain = ctx.createGain();
  gain.gain.value = 0.3;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  noise.start();

  return {
    stop: () => {
      noise.stop();
    },
  };
};

/**
 * Tension — низкий пульс + высокочастотное "звено в ушах".
 */
const tension: PresetFactory = (ctx, destination): PresetInstance => {
  // Низкий пульс (сердцебиение)
  const pulse = ctx.createOscillator();
  pulse.type = 'sine';
  pulse.frequency.value = 60;

  const pulseGain = ctx.createGain();
  pulseGain.gain.value = TENSION_GAIN;

  // LFO для пульсации
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 1.2;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.2;

  lfo.connect(lfoGain);
  lfoGain.connect(pulseGain.gain);

  pulse.connect(pulseGain);
  pulseGain.connect(destination);

  pulse.start();
  lfo.start();

  // Высокочастотное "звено в ушах"
  const noiseBuffer = getBrownNoiseBuffer(ctx);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 4000;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.08;

  noise.connect(highpass);
  highpass.connect(noiseGain);
  noiseGain.connect(destination);

  noise.start();

  return {
    stop: () => {
      pulse.stop();
      lfo.stop();
      noise.stop();
    },
  };
};

/**
 * Death sting — диссонансный аккорд с огибающей.
 */
const deathSting: PresetFactory = (ctx, destination): PresetInstance => {
  const now = ctx.currentTime;

  // Три осциллятора: тритон + малая секунда
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 220;

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 233;

  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.value = 311;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(STING_GAIN, now + 0.01); // атака 10 мс
  gain.gain.exponentialRampToValueAtTime(0.001, now + STING_DURATION_SEC);

  osc1.connect(gain);
  osc2.connect(gain);
  osc3.connect(gain);
  gain.connect(destination);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  osc1.stop(now + STING_DURATION_SEC);
  osc2.stop(now + STING_DURATION_SEC);
  osc3.stop(now + STING_DURATION_SEC);

  return {
    stop: () => {
      try {
        osc1.stop();
        osc2.stop();
        osc3.stop();
      } catch {
        // Уже остановлены
      }
    },
  };
};

/**
 * Accusation theme — минорное трезвучие с медленной атакой.
 */
const accusationTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const now = ctx.currentTime;

  // F3, A3, C4 — минорное трезвучие
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 174.61;

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 220;

  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.value = 261.63;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(ORGAN_GAIN, now + 2); // атака 2 с

  osc1.connect(gain);
  osc2.connect(gain);
  osc3.connect(gain);
  gain.connect(destination);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  return {
    stop: () => {
      osc1.stop();
      osc2.stop();
      osc3.stop();
    },
  };
};

/**
 * Finale theme — ре-минор с медленной атакой.
 */
const finaleTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const now = ctx.currentTime;

  // D3, F3, A3 — ре-минор
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 146.83;

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 174.61;

  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.value = 220;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.5, now + 3); // атака 3 с

  osc1.connect(gain);
  osc2.connect(gain);
  osc3.connect(gain);
  gain.connect(destination);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  return {
    stop: () => {
      osc1.stop();
      osc2.stop();
      osc3.stop();
    },
  };
};

// ─── Реестр ────────────────────────────────────────────────────────────────

export const PRESETS: Record<AudioPresetId, PresetFactory> = {
  silence,
  menu_theme: menuTheme,
  summary_theme: summaryTheme,
  train_ambient: trainAmbient,
  night_corridor: nightCorridor,
  tension,
  death_sting: deathSting,
  accusation_theme: accusationTheme,
  finale_theme: finaleTheme,
};
