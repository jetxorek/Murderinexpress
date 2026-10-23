/**
 * Реестр пресетов процедурной музыки.
 * Каждый пресет — мелодия, созданная через Web Audio API.
 */

import type { AudioPresetId, PresetFactory, PresetInstance } from './types';

// ─── Общие константы ───────────────────────────────────────────────────────

/** Громкость мелодий (0..1) */
const MELODY_GAIN = 0.25;

/** Громкость басовой линии (0..1) */
const BASS_GAIN = 0.18;

/** Громкость аккордов-подложек (0..1) */
const PAD_GAIN = 0.12;

/** Громкость sting (0..1) */
const STING_GAIN = 0.6;

/** Атака ноты (сек) */
const NOTE_ATTACK = 0.02;

/** Спад ноты (сек) */
const NOTE_RELEASE = 0.4;

/** Длительность death sting (сек) */
export const STING_DURATION_SEC = 1.5;

// ─── Утилиты ───────────────────────────────────────────────────────────────

/**
 * Проигрывает одну ноту с огибающей.
 */
function playNote(
  ctx: AudioContext,
  destination: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'sine',
): void {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;

  const env = ctx.createGain();
  
  // Адаптивная огибающая для коротких нот
  const attack = Math.min(NOTE_ATTACK, duration * 0.3);
  const release = Math.min(NOTE_RELEASE, duration * 0.5);
  const sustainEnd = startTime + duration - release;
  
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(gain, startTime + attack);
  
  // Sustain только если есть место между attack и release
  if (sustainEnd > startTime + attack) {
    env.gain.setValueAtTime(gain, sustainEnd);
  }
  
  env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(env);
  env.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/**
 * Проигрывает последовательность нот (арпеджио/мелодию) циклически.
 */
function playMelodyLoop(
  ctx: AudioContext,
  destination: AudioNode,
  notes: number[],
  noteDuration: number,
  gain: number,
  type: OscillatorType = 'triangle',
): { stop: () => void } {
  let stopped = false;
  let nextNoteTime = ctx.currentTime;
  let noteIndex = 0;

  const scheduleAhead = 0.5; // планируем на 500 мс вперёд

  function schedule() {
    if (stopped) return;

    try {
      while (nextNoteTime < ctx.currentTime + scheduleAhead) {
        if (notes[noteIndex] > 0) {
          playNote(ctx, destination, notes[noteIndex], nextNoteTime, noteDuration * 0.9, gain, type);
        }
        nextNoteTime += noteDuration;
        noteIndex = (noteIndex + 1) % notes.length;
      }
    } catch (error) {
      // Игнорируем ошибки аудио, чтобы не ломать UI
      console.warn('Audio scheduling error:', error);
    }

    setTimeout(schedule, 100);
  }

  schedule();

  return {
    stop: () => {
      stopped = true;
    },
  };
}

// ─── Пресеты ───────────────────────────────────────────────────────────────

/**
 * Безопасная обёртка для создания пресета.
 * Перехватывает ошибки аудио, чтобы не ломать UI.
 */
function safePreset(factory: PresetFactory): PresetFactory {
  return (ctx, destination) => {
    try {
      return factory(ctx, destination);
    } catch (error) {
      console.warn('Preset creation error:', error);
      return { stop: () => {} };
    }
  };
}

/**
 * Silence — тишина.
 */
const silence: PresetFactory = (): PresetInstance => {
  return { stop: () => {} };
};

/**
 * Menu theme — элегантная мелодия в стиле 1930-х.
 * Тональность: D-минор. Спокойная, загадочная.
 * Бас: D2, A2. Мелодия: D4, F4, A4, C5, D5.
 */
const menuTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const stops: (() => void)[] = [];
  const padOscs: OscillatorNode[] = [];

  // Басовая линия: медленные ноты D2 и A2
  const bassNotes = [73.42, 0, 110.0, 0, 82.41, 0, 110.0, 0]; // D2, -, A2, -, E2, -, A2, -
  const bass = playMelodyLoop(ctx, destination, bassNotes, 1.2, BASS_GAIN, 'sine');
  stops.push(bass.stop);

  // Мелодия: элегантная фраза в D-миноре
  const melodyNotes = [
    293.66, 0, 349.23, 0, 440.0, 523.25, 0, 440.0,
    349.23, 0, 293.66, 0, 261.63, 0, 293.66, 0,
  ]; // D4, -, F4, -, A4, C5, -, A4, F4, -, D4, -, C4, -, D4, -
  const melody = playMelodyLoop(ctx, destination, melodyNotes, 0.6, MELODY_GAIN, 'triangle');
  stops.push(melody.stop);

  // Аккорд-подложка: Dm7 (D3, F3, A3, C4)
  const padFreqs = [146.83, 174.61, 220.0, 261.63];
  const padGain = ctx.createGain();
  padGain.gain.value = PAD_GAIN;
  padGain.connect(destination);

  for (const freq of padFreqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(padGain);
    osc.start();
    padOscs.push(osc);
  }

  return {
    stop: () => {
      stops.forEach((s) => s());
      padOscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

/**
 * Summary theme — задумчивая мелодия для сводки главы.
 * Тональность: F-мажор. Спокойная, с надеждой.
 */
const summaryTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const stops: (() => void)[] = [];

  // Бас: F2, C3
  const bassNotes = [87.31, 0, 130.81, 0, 87.31, 0, 130.81, 0];
  const bass = playMelodyLoop(ctx, destination, bassNotes, 1.0, BASS_GAIN, 'sine');
  stops.push(bass.stop);

  // Мелодия: F4, A4, C5, F5 — восходящая, светлая
  const melodyNotes = [
    349.23, 0, 440.0, 523.25, 0, 698.46, 0, 523.25,
    440.0, 0, 349.23, 0, 392.0, 0, 349.23, 0,
  ];
  const melody = playMelodyLoop(ctx, destination, melodyNotes, 0.5, MELODY_GAIN, 'triangle');
  stops.push(melody.stop);

  // Подложка: Fmaj7 (F3, A3, C4, E4)
  const padFreqs = [174.61, 220.0, 261.63, 329.63];
  const padOscs: OscillatorNode[] = [];
  const padGain = ctx.createGain();
  padGain.gain.value = PAD_GAIN;
  padGain.connect(destination);

  for (const freq of padFreqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(padGain);
    osc.start();
    padOscs.push(osc);
  }

  return {
    stop: () => {
      stops.forEach((s) => s());
      padOscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

/**
 * Train ambient — мелодия поезда.
 * Детективная, ритмичная, в стиле нуар.
 * Тональность: A-минор. Ритмический остинато.
 */
const trainAmbient: PresetFactory = (ctx, destination): PresetInstance => {
  const stops: (() => void)[] = [];

  // Бас: ритмичный остинато A1, E2
  const bassNotes = [55.0, 55.0, 0, 82.41, 55.0, 55.0, 0, 82.41];
  const bass = playMelodyLoop(ctx, destination, bassNotes, 0.4, BASS_GAIN, 'sine');
  stops.push(bass.stop);

  // Мелодия: загадочная фраза в A-миноре
  const melodyNotes = [
    220.0, 0, 261.63, 220.0, 0, 196.0, 0, 220.0,
    0, 261.63, 0, 329.63, 261.63, 0, 220.0, 0,
  ]; // A3, -, C4, A3, -, G3, -, A3, -, C4, -, E4, C4, -, A3, -
  const melody = playMelodyLoop(ctx, destination, melodyNotes, 0.35, MELODY_GAIN, 'triangle');
  stops.push(melody.stop);

  // Подложка: Am (A2, C3, E3)
  const padFreqs = [110.0, 130.81, 164.81];
  const padOscs: OscillatorNode[] = [];
  const padGain = ctx.createGain();
  padGain.gain.value = PAD_GAIN * 0.8;
  padGain.connect(destination);

  for (const freq of padFreqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(padGain);
    osc.start();
    padOscs.push(osc);
  }

  return {
    stop: () => {
      stops.forEach((s) => s());
      padOscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

/**
 * Night corridor — тревожная ночная мелодия.
 * Тональность: Eb-минор. Медленная, с диссонансами.
 */
const nightCorridor: PresetFactory = (ctx, destination): PresetInstance => {
  const stops: (() => void)[] = [];

  // Бас: низкий, тревожный Eb1, Bb1
  const bassNotes = [77.78, 0, 0, 116.54, 77.78, 0, 0, 116.54];
  const bass = playMelodyLoop(ctx, destination, bassNotes, 1.5, BASS_GAIN, 'sine');
  stops.push(bass.stop);

  // Мелодия: редкие, тревожные ноты
  const melodyNotes = [
    311.13, 0, 0, 0, 369.99, 0, 0, 0,
    0, 0, 233.08, 0, 0, 0, 311.13, 0,
  ]; // Eb4, -, -, -, F#4, -, -, -, -, -, Bb3, -, -, -, Eb4, -
  const melody = playMelodyLoop(ctx, destination, melodyNotes, 0.8, MELODY_GAIN * 0.7, 'sine');
  stops.push(melody.stop);

  // Подложка: Ebm (Eb3, Gb3, Bb3) — мрачная
  const padFreqs = [155.56, 185.0, 233.08];
  const padOscs: OscillatorNode[] = [];
  const padGain = ctx.createGain();
  padGain.gain.value = PAD_GAIN * 0.6;
  padGain.connect(destination);

  for (const freq of padFreqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(padGain);
    osc.start();
    padOscs.push(osc);
  }

  return {
    stop: () => {
      stops.forEach((s) => s());
      padOscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

/**
 * Tension — напряжённая, пульсирующая мелодия.
 * Тональность: C-минор. Нарастающее напряжение.
 */
const tension: PresetFactory = (ctx, destination): PresetInstance => {
  const stops: (() => void)[] = [];

  // Бас: пульсирующий C2, G2
  const bassNotes = [65.41, 65.41, 0, 98.0, 65.41, 65.41, 0, 98.0];
  const bass = playMelodyLoop(ctx, destination, bassNotes, 0.35, BASS_GAIN * 1.2, 'sine');
  stops.push(bass.stop);

  // Мелодия: тревожная, с полутонами
  const melodyNotes = [
    261.63, 277.18, 0, 311.13, 0, 261.63, 246.94, 0,
    261.63, 0, 311.13, 329.63, 0, 311.13, 277.18, 0,
  ];
  const melody = playMelodyLoop(ctx, destination, melodyNotes, 0.3, MELODY_GAIN, 'sawtooth');
  stops.push(melody.stop);

  // Подложка: Cm (C3, Eb3, G3)
  const padFreqs = [130.81, 155.56, 196.0];
  const padOscs: OscillatorNode[] = [];
  const padGain = ctx.createGain();
  padGain.gain.value = PAD_GAIN;
  padGain.connect(destination);

  for (const freq of padFreqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(padGain);
    osc.start();
    padOscs.push(osc);
  }

  return {
    stop: () => {
      stops.forEach((s) => s());
      padOscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

/**
 * Death sting — резкий диссонансный аккорд.
 * Тритон + малая секунда для максимального дискомфорта.
 */
const deathSting: PresetFactory = (ctx, destination): PresetInstance => {
  const now = ctx.currentTime;

  // Диссонанс: A3, Bb3, Eb4 (тритон + малая секунда)
  const freqs = [220, 233.08, 311.13];
  const oscs: OscillatorNode[] = [];

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(STING_GAIN, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + STING_DURATION_SEC);

  for (const freq of freqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + STING_DURATION_SEC);
    oscs.push(osc);
  }

  gain.connect(destination);

  return {
    stop: () => {
      oscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

/**
 * Accusation theme — драматичная мелодия обвинения.
 * Тональность: F-минор. Восходящая, с нарастанием.
 */
const accusationTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const stops: (() => void)[] = [];

  // Бас: F2, C3 — уверенный, тяжёлый
  const bassNotes = [87.31, 87.31, 0, 130.81, 87.31, 87.31, 0, 130.81];
  const bass = playMelodyLoop(ctx, destination, bassNotes, 0.5, BASS_GAIN * 1.2, 'sine');
  stops.push(bass.stop);

  // Мелодия: драматичная, восходящая
  const melodyNotes = [
    349.23, 0, 415.30, 0, 523.25, 0, 622.25, 0,
    698.46, 0, 622.25, 523.25, 0, 415.30, 349.23, 0,
  ]; // F4, -, Ab4, -, C5, -, Eb5, -, F5, -, Eb5, C5, -, Ab4, F4, -
  const melody = playMelodyLoop(ctx, destination, melodyNotes, 0.4, MELODY_GAIN, 'triangle');
  stops.push(melody.stop);

  // Подложка: Fm (F3, Ab3, C4)
  const padFreqs = [174.61, 207.65, 261.63];
  const padOscs: OscillatorNode[] = [];
  const padGain = ctx.createGain();
  padGain.gain.value = PAD_GAIN;
  padGain.connect(destination);

  for (const freq of padFreqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(padGain);
    osc.start();
    padOscs.push(osc);
  }

  return {
    stop: () => {
      stops.forEach((s) => s());
      padOscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

/**
 * Finale theme — разрешающая, мажорная мелодия.
 * Тональность: D-мажор. Светлая, с чувством завершения.
 */
const finaleTheme: PresetFactory = (ctx, destination): PresetInstance => {
  const stops: (() => void)[] = [];

  // Бас: D2, A2 — тёплый, уверенный
  const bassNotes = [73.42, 0, 110.0, 0, 73.42, 0, 110.0, 0];
  const bass = playMelodyLoop(ctx, destination, bassNotes, 0.8, BASS_GAIN, 'sine');
  stops.push(bass.stop);

  // Мелодия: светлая, мажорная
  const melodyNotes = [
    293.66, 0, 369.99, 0, 440.0, 0, 587.33, 0,
    440.0, 0, 369.99, 0, 293.66, 0, 329.63, 0,
  ]; // D4, -, F#4, -, A4, -, D5, -, A4, -, F#4, -, D4, -, E4, -
  const melody = playMelodyLoop(ctx, destination, melodyNotes, 0.5, MELODY_GAIN, 'triangle');
  stops.push(melody.stop);

  // Подложка: Dmaj7 (D3, F#3, A3, C#4)
  const padFreqs = [146.83, 185.0, 220.0, 277.18];
  const padOscs: OscillatorNode[] = [];
  const padGain = ctx.createGain();
  padGain.gain.value = PAD_GAIN;
  padGain.connect(destination);

  for (const freq of padFreqs) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(padGain);
    osc.start();
    padOscs.push(osc);
  }

  return {
    stop: () => {
      stops.forEach((s) => s());
      padOscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
    },
  };
};

// ─── Реестр ────────────────────────────────────────────────────────────────

export const PRESETS: Record<AudioPresetId, PresetFactory> = {
  silence,
  menu_theme: safePreset(menuTheme),
  summary_theme: safePreset(summaryTheme),
  train_ambient: safePreset(trainAmbient),
  night_corridor: safePreset(nightCorridor),
  tension: safePreset(tension),
  death_sting: safePreset(deathSting),
  accusation_theme: safePreset(accusationTheme),
  finale_theme: safePreset(finaleTheme),
};
