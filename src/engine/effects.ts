import { Effects } from '../schemas/scene';

export function applyEffects(
  current: { trust: Record<string, number>; suspicion: number },
  effects: Effects
): { trust: Record<string, number>; suspicion: number } {
  const trust = { ...current.trust };
  if (effects.trust) {
    for (const [charId, delta] of Object.entries(effects.trust)) {
      trust[charId] = Math.max(0, Math.min(3, (trust[charId] ?? 0) + delta));
    }
  }
  const suspicion = clampSuspicion(current.suspicion + (effects.suspicion ?? 0));
  return { trust, suspicion };
}

export function clampSuspicion(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function applyDeathScar(
  current: { trust: Record<string, number>; suspicion: number },
  witnessId: string
): { trust: Record<string, number>; suspicion: number } {
  const trust = { ...current.trust };
  trust[witnessId] = Math.max(0, (trust[witnessId] ?? 0) - 1);
  return {
    trust,
    suspicion: clampSuspicion(current.suspicion + 10),
  };
}
