/**
 * Процедурный звуковой движок на Web Audio API.
 * Чистый TypeScript, без React.
 */

/** Глобальная громкость по умолчанию (0..1) */
const DEFAULT_MASTER_VOLUME = 0.7;

/**
 * Обёртка над Web Audio API.
 * Отвечает за создание AudioContext, master gain,
 * управление активными источниками звука.
 */
export class AudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeSources: Set<AudioScheduledSourceNode> = new Set();
  private volume: number = DEFAULT_MASTER_VOLUME;

  /**
   * Инициализация AudioContext.
   * Вызывается лениво при первом воспроизведении,
   * чтобы соответствовать политике autoplay браузеров.
   */
  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (this.context) return this.context;

    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;

    this.context = new Ctor();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.context.destination);
    return this.context;
  }

  /**
   * Возвращает текущий master gain.
   * Если контекст не создан — возвращает null.
   */
  getMasterGain(): GainNode | null {
    this.ensureContext();
    return this.masterGain;
  }

  /**
   * Возвращает текущий AudioContext (или null, если недоступен).
   */
  getContext(): AudioContext | null {
    return this.ensureContext();
  }

  /**
   * Устанавливает глобальную громкость (0..1).
   */
  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  /**
   * Возвращает текущую громкость.
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Регистрирует источник звука для последующей остановки.
   */
  trackSource(source: AudioScheduledSourceNode): void {
    this.activeSources.add(source);
    source.onended = () => {
      this.activeSources.delete(source);
    };
  }

  /**
   * Останавливает все активные источники и закрывает контекст.
   */
  stopAll(): void {
    for (const source of this.activeSources) {
      try {
        source.stop();
      } catch {
        // Источник мог уже завершиться — игнорируем
      }
    }
    this.activeSources.clear();

    if (this.context && this.context.state !== 'closed') {
      void this.context.close();
    }
    this.context = null;
    this.masterGain = null;
  }

  /**
   * Останавливает только конкретный источник.
   */
  stopSource(source: AudioScheduledSourceNode): void {
    try {
      source.stop();
    } catch {
      // Уже остановлен
    }
    this.activeSources.delete(source);
  }

  /**
   * Возвращает текущее время контекста (для синхронизации).
   */
  getCurrentTime(): number {
    const ctx = this.ensureContext();
    return ctx ? ctx.currentTime : 0;
  }
}
