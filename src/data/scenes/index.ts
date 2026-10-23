import { Scene } from '../../schemas/scene';
import { ch1_01_dining } from './ch1_01_dining';
import { ch1_02_ratchett } from './ch1_02_ratchett';
import { ch1_03_evening } from './ch1_03_evening';
import { ch1_04_night } from './ch1_04_night';
import { ch1_05_morning } from './ch1_05_morning';
import { ch2_01_crime_scene } from './ch2_01_crime_scene';
import { ch2_02_conductor_first } from './ch2_02_conductor_first';
import { ch2_03_breakfast } from './ch2_03_breakfast';
import { ch2_04_interviews } from './ch2_04_interviews';
import { ch2_05_police_announce } from './ch2_05_police_announce';

export const SCENES: Record<string, Scene> = {
  ch1_01_dining,
  ch1_02_ratchett,
  ch1_03_evening,
  ch1_04_night,
  ch1_05_morning,
  ch2_01_crime_scene,
  ch2_02_conductor_first,
  ch2_03_breakfast,
  ch2_04_interviews,
  ch2_05_police_announce,
};

export const SCENE_ORDER = [
  'ch1_01_dining',
  'ch1_02_ratchett',
  'ch1_03_evening',
  'ch1_04_night',
  'ch1_05_morning',
  'ch2_01_crime_scene',
  'ch2_02_conductor_first',
  'ch2_03_breakfast',
  'ch2_04_interviews',
  'ch2_05_police_announce',
];

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}

export function getNextScene(currentId: string): string | null {
  const idx = SCENE_ORDER.indexOf(currentId);
  if (idx === -1 || idx >= SCENE_ORDER.length - 1) return null;
  return SCENE_ORDER[idx + 1];
}
