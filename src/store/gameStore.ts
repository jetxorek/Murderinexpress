import { create } from 'zustand';
import { Note, NoteSpan } from '../schemas/note';
import { AccusationResult } from '../schemas/accusation';
import { createNote, findDuplicate } from '../engine/notebook';
import { evaluate, strengthLabel } from '../engine/accusation';
import { applyEffects, applyDeathScar } from '../engine/effects';
import { getScene, getNextScene } from '../data/scenes';
import { SUSPECT_IDS } from '../data/characters';
import { saveGame, loadGame, createNewSave, getPlayerId, clearSave } from '../engine/save';

export type Screen = 'menu' | 'scene' | 'notebook' | 'accusation' | 'result' | 'finale' | 'chapterEnd';

interface GameState {
  // Progress
  screen: Screen;
  chapter: number;
  currentSceneId: string;
  currentNodeId: string;
  sceneSlotsLeft: number;
  visitedScenes: string[];
  deaths: number;

  // Relationships
  suspicion: number;
  trust: Record<string, number>;

  // Notebook
  notes: Note[];
  hintsUsed: { greyCells: number; memoryTheater: number; snowWindow: number };

  // Accusation
  accusedIds: string[];
  selectedNoteIds: string[];
  lastResult: AccusationResult | null;
  finaleChoice: string | null;

  // UI
  toast: string | null;
  textRevealed: boolean;

  // Actions
  initGame: () => void;
  newGame: () => void;
  continueGame: () => void;
  advanceNode: (nextNodeId?: string) => void;
  setScreen: (screen: Screen) => void;
  addNote: (span: NoteSpan) => void;
  removeNote: (noteId: string) => void;
  toggleAccused: (charId: string) => void;
  toggleNoteForAccusation: (noteId: string) => void;
  submitAccusation: () => void;
  setFinaleChoice: (choice: string) => void;
  applyChoiceEffects: (effects: { trust?: Record<string, number>; suspicion?: number; addNotes?: NoteSpan[]; next?: string }) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  getTextScore: () => number;
  getStrengthLabel: () => string;
  hasSave: () => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'menu',
  chapter: 1,
  currentSceneId: 'ch1_01_dining',
  currentNodeId: 'n1',
  sceneSlotsLeft: 5,
  visitedScenes: [],
  deaths: 0,
  suspicion: 0,
  trust: { char_01: 0, char_02: 0, char_03: 0, char_04: 0, char_05: 0, char_06: 0, char_07: 0 },
  notes: [],
  hintsUsed: { greyCells: 0, memoryTheater: 0, snowWindow: 0 },
  accusedIds: [],
  selectedNoteIds: [],
  lastResult: null,
  finaleChoice: null,
  toast: null,
  textRevealed: false,

  initGame: () => {
    const saved = loadGame();
    if (saved) {
      set({
        chapter: saved.chapter,
        currentSceneId: saved.currentScene,
        currentNodeId: saved.currentNode,
        sceneSlotsLeft: saved.sceneSlotsLeft,
        suspicion: saved.suspicion,
        trust: saved.trust,
        notes: [],
        hintsUsed: saved.hintsUsed,
        deaths: saved.deaths,
        visitedScenes: saved.visitedScenes,
      });
    }
  },

  hasSave: () => {
    return loadGame() !== null;
  },

  newGame: () => {
    clearSave();
    const playerId = getPlayerId();
    const fresh = createNewSave(playerId);
    set({
      screen: 'scene',
      chapter: 1,
      currentSceneId: 'ch1_01_dining',
      currentNodeId: 'n1',
      sceneSlotsLeft: 5,
      suspicion: 0,
      trust: { char_01: 0, char_02: 0, char_03: 0, char_04: 0, char_05: 0, char_06: 0, char_07: 0 },
      notes: [],
      hintsUsed: { greyCells: 0, memoryTheater: 0, snowWindow: 0 },
      deaths: 0,
      visitedScenes: [],
      accusedIds: [],
      selectedNoteIds: [],
      lastResult: null,
      finaleChoice: null,
      textRevealed: false,
    });
    saveGame(fresh);
  },

  continueGame: () => {
    const saved = loadGame();
    if (saved) {
      set({
        screen: 'scene',
        chapter: saved.chapter,
        currentSceneId: saved.currentScene,
        currentNodeId: saved.currentNode,
        sceneSlotsLeft: saved.sceneSlotsLeft,
        suspicion: saved.suspicion,
        trust: saved.trust,
        notes: [],
        hintsUsed: saved.hintsUsed,
        deaths: saved.deaths,
        visitedScenes: saved.visitedScenes,
        textRevealed: false,
      });
    }
  },

  advanceNode: (nextNodeId?: string) => {
    const state = get();
    const scene = getScene(state.currentSceneId);
    if (!scene) return;

    if (nextNodeId) {
      const nextNode = scene.nodes[nextNodeId];
      if (nextNode) {
        if (nextNode.type === 'end') {
          const nextSceneId = nextNode.nextScene;
          if (!nextSceneId) return;
          if (nextSceneId === 'chapter_end') {
            set({ screen: 'chapterEnd' });
            return;
          }
          if (nextSceneId === 'accusation_ready') {
            set({ screen: 'accusation' });
            return;
          }
          const nextScene = getScene(nextSceneId);
          if (nextScene) {
            const newSlots = state.sceneSlotsLeft - (nextScene.slotCost ?? 1);
            set({
              currentSceneId: nextSceneId,
              currentNodeId: nextScene.entry,
              sceneSlotsLeft: Math.max(0, newSlots),
              visitedScenes: [...state.visitedScenes, nextSceneId],
              textRevealed: false,
            });
          }
          return;
        }
        set({ currentNodeId: nextNodeId, textRevealed: false });
      }
    } else {
      // Auto-advance: find next node
      const currentNode = scene.nodes[state.currentNodeId];
      if (currentNode && currentNode.type === 'narration') {
        // Find next node in order
        const nodeKeys = Object.keys(scene.nodes);
        const currentIdx = nodeKeys.indexOf(state.currentNodeId);
        if (currentIdx < nodeKeys.length - 1) {
          const nextKey = nodeKeys[currentIdx + 1];
          const nextNode = scene.nodes[nextKey];
          if (nextNode.type === 'end') {
            get().advanceNode(nextKey);
          } else {
            set({ currentNodeId: nextKey, textRevealed: false });
          }
        }
      }
    }

    // Save
    const s = get();
    saveGame({
      version: 1,
      playerId: getPlayerId(),
      chapter: s.chapter,
      currentScene: s.currentSceneId,
      currentNode: s.currentNodeId,
      sceneSlotsLeft: s.sceneSlotsLeft,
      suspicion: s.suspicion,
      trust: s.trust,
      notes: s.notes.map(n => n.id),
      hintsUsed: s.hintsUsed,
      deaths: s.deaths,
      visitedScenes: s.visitedScenes,
      unlockedEndings: [],
      updatedAt: Date.now(),
    });
  },

  setScreen: (screen) => set({ screen }),

  addNote: (span) => {
    const state = get();
    if (findDuplicate(span, state.notes)) {
      set({ toast: 'Уже в блокноте' });
      setTimeout(() => set({ toast: null }), 2000);
      return;
    }
    const note = createNote(span, state.currentSceneId, state.notes);
    set({ notes: [...state.notes, note], toast: 'Занесено в блокнот ✓' });
    setTimeout(() => set({ toast: null }), 2000);
  },

  removeNote: (noteId) => {
    set({ notes: get().notes.filter(n => n.id !== noteId) });
  },

  toggleAccused: (charId) => {
    const state = get();
    const ids = state.accusedIds.includes(charId)
      ? state.accusedIds.filter(id => id !== charId)
      : [...state.accusedIds, charId];
    set({ accusedIds: ids });
  },

  toggleNoteForAccusation: (noteId) => {
    const state = get();
    const ids = state.selectedNoteIds.includes(noteId)
      ? state.selectedNoteIds.filter(id => id !== noteId)
      : [...state.selectedNoteIds, noteId];
    set({ selectedNoteIds: ids });
  },

  submitAccusation: () => {
    const state = get();
    if (state.accusedIds.length === 0 || state.selectedNoteIds.length < 3) return;
    const result = evaluate(
      { accused: state.accusedIds, noteIds: state.selectedNoteIds },
      state.notes
    );
    set({ lastResult: result, screen: 'result' });
    if (result.outcome === 'full') {
      setTimeout(() => set({ screen: 'finale' }), 100);
    }
  },

  setFinaleChoice: (choice) => {
    set({ finaleChoice: choice });
  },

  applyChoiceEffects: (effects) => {
    const state = get();
    const updated = applyEffects(
      { trust: state.trust, suspicion: state.suspicion },
      effects
    );
    const newNotes = [...state.notes];
    if (effects.addNotes) {
      for (const span of effects.addNotes) {
        if (!findDuplicate(span, newNotes)) {
          newNotes.push(createNote(span, state.currentSceneId, newNotes));
        }
      }
    }
    set({
      trust: updated.trust,
      suspicion: updated.suspicion,
      notes: newNotes,
    });
    if (effects.next) {
      get().advanceNode(effects.next);
    }
  },

  showToast: (msg) => set({ toast: msg }),
  clearToast: () => set({ toast: null }),

  getTextScore: () => {
    const state = get();
    if (state.accusedIds.length === 0 || state.selectedNoteIds.length < 3) return -1;
    const result = evaluate(
      { accused: state.accusedIds, noteIds: state.selectedNoteIds },
      state.notes
    );
    return result.score;
  },

  getStrengthLabel: () => {
    const score = get().getTextScore();
    if (score < 0) return '—';
    return strengthLabel(score);
  },
}));
