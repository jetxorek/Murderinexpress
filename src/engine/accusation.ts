import { Note } from '../schemas/note';
import { AccusationInput, AccusationResult, AccusationOutcome } from '../schemas/accusation';
import { TRUTH_TABLE } from '../data/truthTable';
import type { NoteCategory } from '../data/truthTable';

const ALL_CATEGORIES: NoteCategory[] = ['motive', 'opportunity', 'alibi', 'psychology', 'contradiction'];

export function evaluate(input: AccusationInput, notes: Note[]): AccusationResult {
  const accusedSet = new Set(input.accused);
  // Шаг 1: фильтр релевантности
  const relevant = notes.filter(n =>
    input.noteIds.includes(n.id) &&
    (accusedSet.has(n.target) || n.target === 'group')
  );

  // Шаг 2: покрытие категорий
  const coveredCats = new Set(relevant.map(n => n.category));
  const coverage = coveredCats.size;

  // Шаг 3: валидность
  let validity = 0;
  let validCount = 0;
  for (const note of relevant) {
    if (note.truth === 'true') { validity += 1; validCount++; }
    else if (note.truth === 'plausible') { /* 0 */ }
    else if (note.truth === 'false') { validity -= 1; }
  }

  // Шаг 4: сила
  let strongCount = 0;
  let strengthBonus = 0;
  for (const note of relevant) {
    if (note.strength === 'strong') {
      strengthBonus += 0.5;
      strongCount++;
    }
  }

  // Шаг 5: консистентность
  let contradictionPenalty = 0;
  const catTargets = new Map<string, string[]>();
  for (const note of relevant) {
    const key = `${note.target}:${note.category}`;
    if (!catTargets.has(key)) catTargets.set(key, []);
    catTargets.get(key)!.push(note.truthKey);
  }
  // Проверяем противоречия в рамках одной категории+цели
  for (const [, keys] of catTargets) {
    if (keys.length > 1) {
      // Если есть и true и false в одной категории — противоречие
      contradictionPenalty += 2;
    }
  }

  const score = validity + strengthBonus - contradictionPenalty;
  const accusedCount = input.accused.length;

  // Определяем исход
  let outcome: AccusationOutcome;
  if (score >= 8 && coverage === 5 && accusedCount === 7) {
    outcome = 'full';
  } else if (score >= 4 && coverage >= 3) {
    outcome = 'partial_high';
  } else if (score >= 1 && coverage >= 3) {
    outcome = 'partial_low';
  } else {
    outcome = 'fail';
  }

  const missingCategories = ALL_CATEGORIES.filter(c => !coveredCats.has(c));

  return {
    score,
    coverage,
    validCount,
    strongCount,
    contradictionPenalty,
    outcome,
    missingCategories,
    accusedCount,
  };
}

export function strengthLabel(score: number): string {
  if (score < 1) return 'Слабое';
  if (score < 4) return 'Шаткое';
  if (score < 8) return 'Убедительное';
  return 'Неопровержимое';
}

export function strengthColor(score: number): string {
  if (score < 1) return '#666';
  if (score < 4) return '#b8935a';
  if (score < 8) return '#4a6b4a';
  return '#2d5a2d';
}
