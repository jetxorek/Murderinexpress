/**
 * Публичное API процедурного звука.
 * Singleton, инкапсулирующий AudioEngine и пресеты.
 */

import { AudioEngine } from './engine';
import { PRESETS } from './presets';
import type { AudioPresetId } from './types';

class AudioAPI {
  private engine = new AudioEngine();
  private currentAmbientStop: (() => void) | null = null;

  /**
   * Воспроизводит ambient-звук (зацикленный).
   * Если уже играет другой ambient — останавливает его.
   */
  playAmbient(presetId: AudioPresetId): void {
    this.stopAmbient();

    const factory = PRESETS[presetId];
    if (!factory) return;

    this.currentAmbientStop = factory(this.engine);
  }

  /**
   * Останавливает текущий ambient.
   */
  stopAmbient(): void {
    if (this.currentAmbientStop) {
      this.currentAmbientStop();
      this.currentAmbientStop = null;
    }
  }

  /**
   * Воспроизводит короткий sting (одноразовый).
   */
  playSting(presetId: AudioPresetId): void {
    const factory = PRESETS[presetId];
    if (!factory) return;

    const stop = factory(this.engine);
    // Sting сам завершается — не нужно его отслеживать
    // Но на всякий случай вызываем stop через таймаут
    setTimeout(stop, 3000);
  }

  /**
   * Устанавливает глобальную громкость (0..1).
   */
  setVolume(value: number): void {
    this.engine.setVolume(value);
  }

  /**
   * Возвращает текущую громкость.
   */
  getVolume(): number {
    return this.engine.getVolume();
  }

  /**
   * Останавливает все звуки и освобождает ресурсы.
   */
  stop(): void {
    this.stopAmbient();
    this.engine.stopAll();
  }
}

/**
 * Singleton для управления звуком.
 */
export const audio = new AudioAPI();
