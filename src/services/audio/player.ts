/**
 * Player — управление текущим пресетом, crossfade, start/stop.
 */

import type { AudioPresetId, PresetInstance } from './types';
import { getAudioContext, getMasterGain, resumeContext, suspendContext } from './context';
import { PRESETS } from './presets';

/** Длительность crossfade (сек) */
const CROSSFADE_DURATION = 0.5;

/** Длительность fade out при stop (сек) */
const FADE_OUT_DURATION = 0.3;

let currentPreset: PresetInstance | null = null;
let currentPresetId: AudioPresetId | null = null;
let fadeGain: GainNode | null = null;

/**
 * Запускает пресет с crossfade из текущего состояния.
 */
export function startPreset(id: AudioPresetId): void {
  if (id === currentPresetId) return;

  const ctx = getAudioContext();
  const master = getMasterGain();
  if (!ctx || !master) return;

  // Останавливаем предыдущий пресет с fade out
  if (currentPreset && fadeGain) {
    const now = ctx.currentTime;
    fadeGain.gain.cancelScheduledValues(now);
    fadeGain.gain.setValueAtTime(fadeGain.gain.value, now);
    fadeGain.gain.linearRampToValueAtTime(0, now + CROSSFADE_DURATION);

    const oldPreset = currentPreset;
    setTimeout(() => {
      oldPreset.stop();
    }, CROSSFADE_DURATION * 1000);
  }

  // Создаём новый fade gain
  fadeGain = ctx.createGain();
  fadeGain.gain.value = 0;
  fadeGain.connect(master);

  // Запускаем новый пресет
  const factory = PRESETS[id];
  if (!factory) return;

  const instance = factory(ctx, fadeGain);

  // Fade in
  const now = ctx.currentTime;
  fadeGain.gain.setValueAtTime(0, now);
  fadeGain.gain.linearRampToValueAtTime(1, now + CROSSFADE_DURATION);

  currentPreset = instance;
  currentPresetId = id;
}

/**
 * Останавливает текущий пресет с fade out.
 */
export async function stopPreset(): Promise<void> {
  const ctx = getAudioContext();

  if (currentPreset && fadeGain && ctx) {
    const now = ctx.currentTime;
    fadeGain.gain.cancelScheduledValues(now);
    fadeGain.gain.setValueAtTime(fadeGain.gain.value, now);
    fadeGain.gain.linearRampToValueAtTime(0, now + FADE_OUT_DURATION);

    const presetToStop = currentPreset;
    setTimeout(() => {
      presetToStop.stop();
    }, FADE_OUT_DURATION * 1000);
  }

  currentPreset = null;
  currentPresetId = null;
  fadeGain = null;

  await suspendContext();
}

/**
 * Возвращает ID текущего пресета (или null).
 */
export function getCurrentPresetId(): AudioPresetId | null {
  return currentPresetId;
}

/**
 * Принудительно останавливает пресет без fade out (для тестов).
 */
export function forceStop(): void {
  if (currentPreset) {
    currentPreset.stop();
  }
  currentPreset = null;
  currentPresetId = null;
  fadeGain = null;
}
