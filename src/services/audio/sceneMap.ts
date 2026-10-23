/**
 * Маппинг экранов и сцен на аудио-пресеты.
 */

import type { AudioPresetId } from './types';

const SCENE_PRESETS: Record<string, AudioPresetId> = {
  ch1_01_dining: 'train_ambient',
  ch1_02_ratchett: 'train_ambient',
  ch1_03_evening: 'train_ambient',
  ch1_03a_poker: 'train_ambient',
  ch1_03b_corridor: 'night_corridor',
  ch1_03c_countess: 'train_ambient',
  ch1_04_night: 'night_corridor',
  ch1_05_morning: 'train_ambient',
  ch3_03a_confront_countess: 'tension',
  ch3_03b_search_compartment: 'tension',
  ch3_03c_confront_professor: 'tension',
};

const SCREEN_PRESETS: Record<string, AudioPresetId> = {
  main_menu: 'menu_theme',
  chapter_summary: 'summary_theme',
  accusation: 'accusation_theme',
  accusation_result: 'accusation_theme',
  death: 'death_sting',
  finale: 'finale_theme',
};

const DEFAULT_SCENE_PRESET: AudioPresetId = 'train_ambient';
const DEFAULT_SCREEN_PRESET: AudioPresetId = 'silence';

/**
 * Возвращает ID пресета для текущего экрана и сцены.
 */
export function getPresetForScreen(
  screen: string,
  sceneId: string,
): AudioPresetId {
  if (screen === 'scene' || screen === 'hub') {
    return SCENE_PRESETS[sceneId] ?? DEFAULT_SCENE_PRESET;
  }
  return SCREEN_PRESETS[screen] ?? DEFAULT_SCREEN_PRESET;
}
