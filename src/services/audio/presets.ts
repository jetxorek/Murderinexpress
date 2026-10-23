/**
 * Реестр пресетов процедурного звука.
 * Каждый пресет — функция, создающая звук через Web Audio API.
 */

import type { AudioPresetId, PresetFactory, PresetInstance } from './types';
import { getBrownNoiseBuffer } from './noise';

// ─── Константы ─────────────────────────────────────────────────────────────

/** Частота низкого гула поезда (Гц) */
const TRAIN_RUMBLE_FREQ = 55;

/** Частота модуляции для ритма колёс (Гц) */
const TRAIN_RHYTHM_FREQ = 1.5;

/** Глубина модуляции частоты (0..1) */
const TRAIN_MOD_DEPTH = 0.15;

/** Громкость ambient поезда (0..1) */
const TRAIN_VOLUME = 0.25;

/** Частота среза фильтра ночного коридора (Гц) */
const CORRIDOR_FILTER_FREQ = 400;

/** Добротность фильтра ночного коридора */
const CORRIDOR_FILTER_Q = 0.7;

/** Громкость ночного коридора (0..1) */
const CORRIDOR_VOLUME = 0.2;

/** Частота основного тона tension (Гц, нота C3) */
const TENSION_ROOT_FREQ = 130.81;

/** Частота малой терции tension (Гц, нота Eb3) */
const TENSION_THIRD_FREQ = 155.56;

/** Громкость tension (0..1) */
const TENSION_VOLUME = 0.3;

/** Частота основного тона death sting (Гц, нота D4) */
const DEATH_STING_FREQ = 293.66;

/** Длительность атаки death sting (сек) */
const DEATH_ATTACK = 0.02;

/** Длительность затухания death sting (сек) */
const DEATH_RELEASE = 2.0;

/** Громкость death sting (0..1) */
const DEATH_VOLUME = 0.6;

/** Частота основного тона accusation (Гц, нота A3) */
const ACCUSATION_ROOT_FREQ = 220.0;

/** Частота квинты accusation (Гц, нота E4) */
const ACCUSATION_FIFTH_FREQ = 329.63;

/** Громкость accusation (0..1) */
const ACCUSATION_VOLUME = 0.25;

/** Частота основного тона finale (Гц, нота G3) */
const FINALE_ROOT_FREQ = 196.0;

/** Частота терции finale (Гц, нота B3) */
const FINALE_THIRD_FREQ = 246.94;

/** Частота квинты finale (Гц, нота D4) */
const FINALE_FIFTH_FREQ = 293.66;

/** Громкость finale (0..1) */
const FINALE_VOLUME = 0.3;

/** Частота основного тона menu theme (Гц, нота A2) */
const MENU_ROOT_FREQ = 110.0;

/** Частота терции menu theme (Гц, нота C3) */
const MENU_THIRD_FREQ = 130.81;

/** Громкость menu theme (0..1) */
const MENU_VOLUME = 0.2;

/** Частота основного тона summary (Гц, нота D3) */
const SUMMARY_ROOT_FREQ = 146.83;

/** Громкость summary (0..1) */
const SUMMARY_VOLUME = 0.2;

// ─── Пресеты ───────────────────────────────────────────────────────────────

/**
 * Silence — пустой пресет, ничего не играет.
 */
const silence: PresetFactory = (): PresetInstance => {
  return { stop: () => {} };
};

/**
 * Menu theme — мягкий эмбиент для главного меню.
 * Два осциллятора с медленной модуляцией.
 */
const menuTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = MENU_ROOT_FREQ;

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = MENU_THIRD_FREQ;

  const gain = ctx.createGain();
  gain.gain.value = MENU_VOLUME;

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(destination);

  osc1.start();
  osc2.start();

  return {
    stop: () => {
      osc1.stop();
      osc2.stop();
    },
  };
};

/**
 * Summary theme — спокойный тон для сводки главы.
 */
const summaryTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = SUMMARY_ROOT_FREQ;

  const gain = ctx.createGain();
  gain.gain.value = SUMMARY_VOLUME;

  osc.connect(gain);
  gain.connect(destination);
  osc.start();

  return {
    stop: () => {
      osc.stop();
    },
  };
};

/**
 * Train ambient — гул поезда с ритмом колёс.
 */
const trainAmbient: PresetFactory = (ctx, destination): PresetInstance => {
  // Основной гул
  const rumble = ctx.createOscillator();
  rumble.type = 'sine';
  rumble.frequency.value = TRAIN_RUMBLE_FREQ;

  // Модулятор для ритма колёс
  const modulator = ctx.createOscillator();
  modulator.type = 'sine';
  modulator.frequency.value = TRAIN_RHYTHM_FREQ;

  const modGain = ctx.createGain();
  modGain.gain.value = TRAIN_RUMBLE_FREQ * TRAIN_MOD_DEPTH;

  // Усиление гула
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = TRAIN_VOLUME;

  // Соединения
  modulator.connect(modGain);
  modGain.connect(rumble.frequency);
  rumble.connect(rumbleGain);
  rumbleGain.connect(destination);

  rumble.start();
  modulator.start();

  return {
    stop: () => {
      rumble.stop();
      modulator.stop();
    },
  };
};

/**
 * Night corridor — шум метели за окном + низкий гул.
 */
const nightCorridor: PresetFactory = (ctx, destination): PresetInstance => {
  // Brown noise через bandpass-фильтр
  const noiseBuffer = getBrownNoiseBuffer(ctx);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = CORRIDOR_FILTER_FREQ;
  filter.Q.value = CORRIDOR_FILTER_Q;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = CORRIDOR_VOLUME;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(destination);

  noise.start();

  return {
    stop: () => {
      noise.stop();
    },
  };
};

/**
 * Tension — напряжённый минорный дрон.
 */
const tension: PresetFactory = (ctx, destination): PresetInstance => {
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = TENSION_ROOT_FREQ;

  const osc2 = ctx.createOscillator();
  osc2.type = 'sawtooth';
  osc2.frequency.value = TENSION_THIRD_FREQ;

  // Low-pass фильтр для смягчения
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  const gain = ctx.createGain();
  gain.gain.value = TENSION_VOLUME;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc1.start();
  osc2.start();

  return {
    stop: () => {
      osc1.stop();
      osc2.stop();
    },
  };
};

/**
 * Death sting — короткий аккорд для момента смерти.
 */
const deathSting: PresetFactory = (ctx, destination): PresetInstance => {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = DEATH_STING_FREQ;

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, now);
  envelope.gain.linearRampToValueAtTime(DEATH_VOLUME, now + DEATH_ATTACK);
  envelope.gain.exponentialRampToValueAtTime(0.001, now + DEATH_ATTACK + DEATH_RELEASE);

  osc.connect(envelope);
  envelope.connect(destination);

  osc.start(now);
  osc.stop(now + DEATH_ATTACK + DEATH_RELEASE);

  return {
    stop: () => {
      try {
        osc.stop();
      } catch {
        // Уже остановлен
      }
    },
  };
};

/**
 * Accusation theme — напряжённый, но сдержанный тон.
 */
const accusationTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.value = ACCUSATION_ROOT_FREQ;

  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.value = ACCUSATION_FIFTH_FREQ;

  const gain = ctx.createGain();
  gain.gain.value = ACCUSATION_VOLUME;

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(destination);

  osc1.start();
  osc2.start();

  return {
    stop: () => {
      osc1.stop();
      osc2.stop();
    },
  };
};

/**
 * Finale theme — мажорный аккорд для морального выбора.
 */
const finaleTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = FINALE_ROOT_FREQ;

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = FINALE_THIRD_FREQ;

  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.value = FINALE_FIFTH_FREQ;

  const gain = ctx.createGain();
  gain.gain.value = FINALE_VOLUME;

  osc1.connect(gain);
  osc2.connect(gain);
  osc3.connect(gain);
  gain.connect(destination);

  osc1.start();
  osc2.start();
  osc3.start();

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
