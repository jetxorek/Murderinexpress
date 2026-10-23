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
import { ch3_01_late_interviews } from './ch3_01_late_interviews';
import { ch3_02_evidence } from './ch3_02_evidence';
import { ch3_03_risky } from './ch3_03_risky';
import { ch3_04_deduction } from './ch3_04_deduction';
import { ch3_05_storm } from './ch3_05_storm';
import { ch4_01_police_arrival } from './ch4_01_police_arrival';
import { ch4_02_accusation } from './ch4_02_accusation';
import { ch4_03_resolution } from './ch4_03_resolution';
import { ch4_04_moral_choice } from './ch4_04_moral_choice';

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
  ch3_01_late_interviews,
  ch3_02_evidence,
  ch3_03_risky,
  ch3_04_deduction,
  ch3_05_storm,
  ch4_01_police_arrival,
  ch4_02_accusation,
  ch4_03_resolution,
  ch4_04_moral_choice,
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
  'ch3_01_late_interviews',
  'ch3_02_evidence',
  'ch3_03_risky',
  'ch3_04_deduction',
  'ch3_05_storm',
  'ch4_01_police_arrival',
  'ch4_02_accusation',
  'ch4_03_resolution',
  'ch4_04_moral_choice',
];

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}

export function getNextScene(currentId: string): string | null {
  const idx = SCENE_ORDER.indexOf(currentId);
  if (idx === -1 || idx >= SCENE_ORDER.length - 1) return null;
  return SCENE_ORDER[idx + 1];
}
