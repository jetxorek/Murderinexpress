/**
 * Singleton AudioContext + master GainNode.
 * Ленивая инициализация по user gesture.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

/**
 * Создаёт или возвращает существующий AudioContext.
 * Возвращает null, если Web Audio API недоступен (SSR, тесты).
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!Ctor) return null;

  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  return ctx;
}

/**
 * Возвращает master GainNode (или null, если контекст не создан).
 */
export function getMasterGain(): GainNode | null {
  if (!ctx || !master) return null;
  return master;
}

/**
 * Resume AudioContext (нужен после user gesture в некоторых браузерах).
 */
export async function resumeContext(): Promise<void> {
  if (ctx && ctx.state === 'suspended') {
    await ctx.resume();
  }
}

/**
 * Suspend AudioContext (освобождает ресурсы).
 */
export async function suspendContext(): Promise<void> {
  if (ctx && ctx.state === 'running') {
    await ctx.suspend();
  }
}

/**
 * Закрывает контекст и освобождает все ресурсы.
 */
export async function closeContext(): Promise<void> {
  if (ctx && ctx.state !== 'closed') {
    await ctx.close();
  }
  ctx = null;
  master = null;
}

/**
 * Возвращает текущее время контекста (для синхронизации).
 */
export function getCurrentTime(): number {
  return ctx ? ctx.currentTime : 0;
}
