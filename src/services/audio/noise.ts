/**
 * Генератор brown-noise AudioBuffer (2 секунды).
 * Кэшируется для повторного использования.
 */

/** Длительность буфера шума (сек) */
const NOISE_DURATION_SECONDS = 2;

let cachedBuffer: AudioBuffer | null = null;

/**
 * Возвращает кэшированный AudioBuffer с brown noise.
 * Brown noise — это случайный сигнал с интегрированным спектром,
 * даёт мягкий "тёплый" шум, подходящий для атмосферы.
 */
export function getBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedBuffer) return cachedBuffer;

  const sampleRate = ctx.sampleRate;
  const length = sampleRate * NOISE_DURATION_SECONDS;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    // Brown noise: интегрируем белый шум
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5; // нормализация
  }

  cachedBuffer = buffer;
  return buffer;
}

/**
 * Сбрасывает кэш буфера (для тестов).
 */
export function resetNoiseCache(): void {
  cachedBuffer = null;
}
