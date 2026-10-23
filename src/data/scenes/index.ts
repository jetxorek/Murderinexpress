import { Scene } from '../../schemas/scene';
import { ch1_01_dining } from './ch1_01_dining';
import { ch1_02_ratchett } from './ch1_02_ratchett';
import { ch1_03_evening } from './ch1_03_evening';
import { ch1_04_night } from './ch1_04_night';
import { ch1_05_morning } from './ch1_05_morning';

export const SCENES: Record<string, Scene> = {
  ch1_01_dining,
  ch1_02_ratchett,
  ch1_03_evening,
  ch1_04_night,
  ch1_05_morning,
};

export const SCENE_ORDER = [
  'ch1_01_dining',
  'ch1_02_ratchett',
  'ch1_03_evening',
  'ch1_04_night',
  'ch1_05_morning',
];

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}

export function getNextScene(currentId: string): string | null {
  const idx = SCENE_ORDER.indexOf(currentId);
  if (idx === -1 || idx >= SCENE_ORDER.length - 1) return null;
  return SCENE_ORDER[idx + 1];
}
