/**
 * Singleton AudioContext + master GainNode.
 * Создаётся по init() (user gesture), не при импорте.
 */

/** Мастер-громкость по умолчанию (0..1) */
const MASTER_VOLUME = 0.5;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

/**
 * Возвращает текущий AudioContext (или null, если не создан).
 */
export function getContext(): AudioContext | null {
  return ctx;
}

/**
 * Возвращает master GainNode (или null, если не создан).
 */
export function getMaster(): GainNode | null {
  return master;
}

/**
 * Создаёт AudioContext, если он ещё не создан.
 * Использует проверку 'AudioContext' in window для корректной типизации.
 */
export function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!('AudioContext' in window)) return null;

  if (!ctx) {
    ctx = new window.AudioContext();
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(ctx.destination);
  }
  return ctx;
}

/**
 * Resume AudioContext, если он suspended (нужно после user gesture).
 */
export function resumeContext(): void {
  const c = ensureContext();
  if (c && c.state === 'suspended') {
    void c.resume();
  }
}

/**
 * Устанавливает мастер-громкость с плавным переходом (50 мс).
 */
export function setMasterGain(value: number): void {
  if (master) {
    master.gain.setTargetAtTime(
      Math.max(0, Math.min(1, value)),
      master.context.currentTime,
      0.05,
    );
  }
}

/**
 * Возвращает true, если контекст создан и работает.
 */
export function isContextReady(): boolean {
  return ctx !== null && ctx.state === 'running';
}
