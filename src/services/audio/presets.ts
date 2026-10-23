/**
 * Пресеты процедурных звуков.
 * Каждый пресет — функция, создающая звук через Web Audio API.
 */

import type { AudioEngine } from './engine';

/** Частота низкого гула поезда (Гц) */
const TRAIN_RUMBLE_FREQ = 60;

/** Частота модуляции для ритма колёс (Гц) */
const TRAIN_RHYTHM_FREQ = 2;

/** Громкость гула поезда (0..1) */
const TRAIN_RUMBLE_VOLUME = 0.3;

/** Частота среза фильтра метели (Гц) */
const SNOW_FILTER_FREQ = 800;

/** Добротность фильтра метели */
const SNOW_FILTER_Q = 0.5;

/** Громкость метели (0..1) */
const SNOW_VOLUME = 0.25;

/** Частота основного тона sting (Гц, нота D4) */
const STING_ROOT_FREQ = 293.66;

/** Частота терции sting (Гц, нота F4) */
const STING_THIRD_FREQ = 349.23;

/** Частота квинты sting (Гц, нота A4) */
const STING_FIFTH_FREQ = 440;

/** Длительность атаке sting (сек) */
const STING_ATTACK = 0.05;

/** Длительность затухания sting (сек) */
const STING_RELEASE = 1.5;

/** Громкость sting (0..1) */
const STING_VOLUME = 0.5;

/**
 * Тип функции пресета.
 * Возвращает функцию остановки звука.
 */
export type PresetFactory = (engine: AudioEngine) => () => void;

/**
 * Ambient: стук колёс поезда.
 * Низкочастотный осциллятор с ритмичной модуляцией.
 */
export const ambientTrain: PresetFactory = (engine) => {
  const ctx = engine.getContext();
  const master = engine.getMasterGain();
  if (!ctx || !master) return () => {};

  // Основной гул
  const rumble = ctx.createOscillator();
  rumble.type = 'sine';
  rumble.frequency.value = TRAIN_RUMBLE_FREQ;

  // Модулятор для ритма
  const modulator = ctx.createOscillator();
  modulator.type = 'sine';
  modulator.frequency.value = TRAIN_RHYTHM_FREQ;

  const modGain = ctx.createGain();
  modGain.gain.value = TRAIN_RUMBLE_FREQ * 0.1;

  // Усиление гула
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = TRAIN_RUMBLE_VOLUME;

  // Соединения
  modulator.connect(modGain);
  modGain.connect(rumble.frequency);
  rumble.connect(rumbleGain);
  rumbleGain.connect(master);

  rumble.start();
  modulator.start();

  engine.trackSource(rumble);
  engine.trackSource(modulator);

  return () => {
    engine.stopSource(rumble);
    engine.stopSource(modulator);
  };
};

/**
 * Ambient: метель за окном.
 * Белый шум через bandpass-фильтр.
 */
export const ambientSnow: PresetFactory = (engine) => {
  const ctx = engine.getContext();
  const master = engine.getMasterGain();
  if (!ctx || !master) return () => {};

  // Генератор белого шума через buffer
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  // Bandpass фильтр
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = SNOW_FILTER_FREQ;
  filter.Q.value = SNOW_FILTER_Q;

  // Усиление
  const gain = ctx.createGain();
  gain.gain.value = SNOW_VOLUME;

  // Соединения
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  noise.start();

  engine.trackSource(noise);

  return () => {
    engine.stopSource(noise);
  };
};

/**
 * Sting: короткий аккорд для момента раскрытия.
 * Минорный аккорд (D-F-A) с атакой и затуханием.
 */
export const stingReveal: PresetFactory = (engine) => {
  const ctx = engine.getContext();
  const master = engine.getMasterGain();
  if (!ctx || !master) return () => {};

  const now = ctx.currentTime;

  // Создаём три осциллятора для аккорда
  const frequencies = [STING_ROOT_FREQ, STING_THIRD_FREQ, STING_FIFTH_FREQ];
  const oscillators: OscillatorNode[] = [];

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, now);
  envelope.gain.linearRampToValueAtTime(STING_VOLUME, now + STING_ATTACK);
  envelope.gain.linearRampToValueAtTime(0, now + STING_ATTACK + STING_RELEASE);

  for (const freq of frequencies) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.connect(envelope);
    osc.start(now);
    osc.stop(now + STING_ATTACK + STING_RELEASE);
    oscillators.push(osc);
    engine.trackSource(osc);
  }

  envelope.connect(master);

  return () => {
    for (const osc of oscillators) {
      engine.stopSource(osc);
    }
  };
};

/**
 * Маппинг ID пресета на фабрику.
 */
export const PRESETS: Record<string, PresetFactory> = {
  ambient_train: ambientTrain,
  ambient_snow: ambientSnow,
  sting_reveal: stingReveal,
};
