/**
 * Публичное API процедурного звука.
 * Singleton, инкапсулирующий все аудио-операции.
 */

import type { AudioApi } from './types';
import { ensureContext, isContextReady, resumeContext, setMasterGain } from './context';
import { playPreset } from './player';

/** Ключ в localStorage для сохранения громкости */
const VOLUME_KEY = 'mfe_audio_volume';

/** Ключ в localStorage для сохранения mute-статуса */
const MUTED_KEY = 'mfe_audio_muted';

/** Громкость по умолчанию (0..1) */
const DEFAULT_VOLUME = 0.5;

/**
 * Загружает сохранённую громкость из localStorage.
 */
function readVolume(): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (!raw) return DEFAULT_VOLUME;
    const n = Number.parseFloat(raw);
    if (Number.isFinite(n)) return Math.max(0, Math.min(1, n));
  } catch {
    // no-op
  }
  return DEFAULT_VOLUME;
}

/**
 * Загружает сохранённый mute-статус из localStorage.
 */
function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === '1';
  } catch {
    return false;
  }
}

let currentVolume = readVolume();
let currentMuted = readMuted();

/**
 * Применяет текущую громкость к master gain.
 */
function applyVolume(): void {
  setMasterGain(currentMuted ? 0 : currentVolume);
}

/**
 * Публичный API аудио.
 */
export const audio: AudioApi = {
  /**
   * Инициализирует AudioContext (должно вызываться по user gesture).
   */
  init: () => {
    ensureContext();
    resumeContext();
    applyVolume();
  },

  /**
   * Возвращает true, если AudioContext инициализирован и работает.
   */
  isInitialized: () => isContextReady(),

  /**
   * Воспроизводит пресет с crossfade.
   */
  playPreset: (id) => playPreset(id),

  /**
   * Останавливает текущий пресет (fade out к silence).
   */
  stop: () => {
    playPreset('silence');
  },

  /**
   * Устанавливает громкость (0..1).
   */
  setVolume: (v) => {
    currentVolume = Math.max(0, Math.min(1, v));
    try {
      localStorage.setItem(VOLUME_KEY, String(currentVolume));
    } catch {
      // no-op
    }
    applyVolume();
  },

  /**
   * Возвращает текущую громкость.
   */
  getVolume: () => currentVolume,

  /**
   * Устанавливает mute-статус.
   */
  setMuted: (b) => {
    currentMuted = b;
    try {
      localStorage.setItem(MUTED_KEY, b ? '1' : '0');
    } catch {
      // no-op
    }
    applyVolume();
  },

  /**
   * Возвращает mute-статус.
   */
  isMuted: () => currentMuted,
};
