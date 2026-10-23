/**
 * Публичное API процедурного звука.
 * Singleton, инкапсулирующий все аудио-операции.
 */

import type { AudioApi, AudioPresetId } from './types';
import { getAudioContext, resumeContext } from './context';
import { startPreset, stopPreset } from './player';
import { getPresetForScreen } from './sceneMap';

/** Ключ в localStorage для сохранения громкости */
const VOLUME_STORAGE_KEY = 'mfe_audio_volume';

/** Ключ в localStorage для сохранения mute-статуса */
const MUTE_STORAGE_KEY = 'mfe_audio_muted';

/** Громкость по умолчанию (0..1) */
const DEFAULT_VOLUME = 0.7;

let volume: number = loadVolume();
let muted: boolean = loadMuted();
let initialized = false;

/**
 * Загружает сохранённую громкость из localStorage.
 */
function loadVolume(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_VOLUME;
  const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
  if (stored === null) return DEFAULT_VOLUME;
  const parsed = Number.parseFloat(stored);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 1) return DEFAULT_VOLUME;
  return parsed;
}

/**
 * Сохраняет громкость в localStorage.
 */
function saveVolume(v: number): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(VOLUME_STORAGE_KEY, String(v));
}

/**
 * Загружает сохранённый mute-статус из localStorage.
 */
function loadMuted(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
}

/**
 * Сохраняет mute-статус в localStorage.
 */
function saveMuted(b: boolean): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(MUTE_STORAGE_KEY, String(b));
}

/**
 * Публичный API аудио.
 */
export const audio: AudioApi = {
  /**
   * Инициализирует AudioContext (должно вызываться по user gesture).
   */
  init(): void {
    const ctx = getAudioContext();
    if (ctx) {
      void resumeContext();
      initialized = true;
    }
  },

  /**
   * Возвращает true, если AudioContext инициализирован.
   */
  isInitialized(): boolean {
    return initialized;
  },

  /**
   * Воспроизводит пресет с crossfade.
   */
  playPreset(id: AudioPresetId): void {
    if (!initialized) return;
    if (muted) return;
    if (id === 'silence') {
      void stopPreset();
      return;
    }
    startPreset(id);
  },

  /**
   * Останавливает текущий пресет с fade out.
   */
  stop(): void {
    void stopPreset();
  },

  /**
   * Устанавливает громкость (0..1).
   */
  setVolume(v: number): void {
    volume = Math.max(0, Math.min(1, v));
    saveVolume(volume);
  },

  /**
   * Возвращает текущую громкость.
   */
  getVolume(): number {
    return volume;
  },

  /**
   * Устанавливает mute-статус.
   */
  setMuted(b: boolean): void {
    muted = b;
    saveMuted(muted);
    if (muted) {
      void stopPreset();
    }
  },

  /**
   * Возвращает mute-статус.
   */
  isMuted(): boolean {
    return muted;
  },
};

// Реэкспорт для удобства
export { getPresetForScreen } from './sceneMap';
