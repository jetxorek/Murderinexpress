/**
 * Генератор brown-noise AudioBuffer (2 секунды, моно).
 * Кэшируется для повторного использования.
 */

/** Длительность буфера (сек) */
const BUFFER_SECONDS = 2;

/** Коэффициент утечки для brown noise */
const BROWN_LEAK = 0.02;

/** Вес предыдущего значения */
const LAST_VALUE_WEIGHT = 0.98;

let buffer: AudioBuffer | null = null;

/**
 * Возвращает кэшированный AudioBuffer с brown noise.
 * Brown noise — это случайный сигнал с интегрированным спектром,
 * даёт мягкий "тёплый" шум, подходящий для атмосферы.
 */
export function getBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (buffer) return buffer;

  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * BUFFER_SECONDS);
  const b = ctx.createBuffer(1, length, sampleRate);
  const data = b.getChannelData(0);

  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = LAST_VALUE_WEIGHT * last + BROWN_LEAK * white;
    data[i] = last;
  }

  buffer = b;
  return b;
}
