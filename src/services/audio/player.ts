/**
 * Player — управление текущим пресетом + crossfade.
 */

import type { AudioPresetId, PresetInstance } from './types';
import { getContext, getMaster } from './context';
import { PRESETS, STING_DURATION_SEC } from './presets';

/** Длительность crossfade (сек) */
const CROSSFADE_SEC = 0.4;

let currentInstance: PresetInstance | null = null;
let currentId: AudioPresetId = 'silence';
let currentGain: GainNode | null = null;

/**
 * Запускает пресет с crossfade из текущего состояния.
 */
export function playPreset(id: AudioPresetId): void {
  if (id === currentId) return;

  const ctx = getContext();
  const master = getMaster();
  if (!ctx || !master) return; // не инициализировано — no-op

  // fade out текущего
  if (currentInstance && currentGain) {
    currentGain.gain.setTargetAtTime(0, ctx.currentTime, CROSSFADE_SEC / 3);
    const oldInstance = currentInstance;
    setTimeout(() => oldInstance.stop(), CROSSFADE_SEC * 1000);
  }

  if (id === 'silence') {
    currentInstance = null;
    currentGain = null;
    currentId = 'silence';
    return;
  }

  const newGain = ctx.createGain();
  newGain.gain.value = 0;
  newGain.connect(master);
  newGain.gain.setTargetAtTime(1, ctx.currentTime, CROSSFADE_SEC / 3);

  const factory = PRESETS[id];
  currentInstance = factory(ctx, newGain);
  currentGain = newGain;
  currentId = id;

  // one-shot presets (death_sting) — авто-возврат к silence
  if (id === 'death_sting') {
    setTimeout(() => {
      if (currentId === 'death_sting') playPreset('silence');
    }, STING_DURATION_SEC * 1000 + CROSSFADE_SEC * 1000);
  }
}
