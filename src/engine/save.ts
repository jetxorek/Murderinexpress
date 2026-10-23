import { SaveStateSchema, SaveState } from '../schemas/save';

const STORAGE_PREFIX = 'mfe_save_v1_';

export function createNewSave(playerId: string): SaveState {
  return {
    version: 1,
    playerId,
    chapter: 1,
    currentScene: 'ch1_01_dining',
    currentNode: 'n1',
    sceneSlotsLeft: 5,
    suspicion: 0,
    trust: {
      char_01: 0, char_02: 0, char_03: 0, char_04: 0,
      char_05: 0, char_06: 0, char_07: 0,
    },
    notes: [],
    hintsUsed: { greyCells: 0, memoryTheater: 0, snowWindow: 0 },
    deaths: 0,
    visitedScenes: [],
    unlockedEndings: [],
    updatedAt: Date.now(),
  };
}

export function getPlayerId(): string {
  const key = 'mfe_player_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function saveGame(state: SaveState): void {
  try {
    const key = STORAGE_PREFIX + state.playerId;
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // quota exceeded — молча
  }
}

export function loadGame(): SaveState | null {
  try {
    const playerId = getPlayerId();
    const key = STORAGE_PREFIX + playerId;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = SaveStateSchema.safeParse(parsed);
    if (result.success) return result.data;
    // Попробуем мигрировать
    return migrate(parsed);
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    const playerId = getPlayerId();
    localStorage.removeItem(STORAGE_PREFIX + playerId);
  } catch { /* noop */ }
}

function migrate(raw: unknown): SaveState | null {
  // Простейшая миграция — если version не совпадает, сбрасываем
  return null;
}
