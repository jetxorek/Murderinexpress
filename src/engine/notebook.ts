import { Note, NoteSpan } from '../schemas/note';
import { TRUTH_TABLE, TruthValue, NoteCategory } from '../data/truthTable';

export function createNote(span: NoteSpan, sceneId: string, allNotes: Note[]): Note {
  const truth = lookupTruth(span.target, span.category, span.truthKey);
  const strength = computeStrength(span, truth, allNotes, sceneId);
  return {
    ...span,
    sourceScene: sceneId,
    truth,
    strength,
    createdAt: Date.now(),
  };
}

export function lookupTruth(target: string, category: NoteCategory, truthKey: string): TruthValue {
  const table = TRUTH_TABLE[target];
  if (!table) return 'plausible';
  const cat = table[category];
  if (!cat) return 'plausible';
  return cat[truthKey] ?? 'plausible';
}

export function computeStrength(
  span: NoteSpan,
  truth: TruthValue,
  allNotes: Note[],
  sceneId: string
): 'weak' | 'strong' {
  if (truth === 'false') return 'weak';
  if (span.category === 'contradiction' && truth === 'true') return 'strong';
  const sameTargetCat = allNotes.filter(
    n => n.target === span.target && n.category === span.category &&
    n.sourceScene !== sceneId && (n.truth === 'true' || n.truth === 'plausible')
  );
  if (sameTargetCat.length > 0) return 'strong';
  return 'weak';
}

export function findDuplicate(span: NoteSpan, notes: Note[]): boolean {
  return notes.some(n => n.id === span.id);
}

export function validateLink(notes: Note[]): boolean {
  if (notes.length < 2) return false;
  const sameTarget = notes.every(n => n.target === notes[0].target);
  const hasContradiction = notes.some(n => n.category === 'contradiction');
  return sameTarget || hasContradiction;
}
