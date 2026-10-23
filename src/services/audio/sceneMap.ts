/**
 * Маппинг экранов и сцен на аудио-пресеты.
 */

import type { AudioPresetId } from './types';

/**
 * Возвращает ID пресета для текущего экрана и сцены.
 * Логика:
 * - menu → menu_theme
 * - scene → зависит от sceneId (глава, тип сцены)
 * - notebook → silence (не меняем ambient)
 * - accusation → accusation_theme
 * - result → зависит от исхода (пока tension)
 * - finale → finale_theme
 * - chapterEnd → summary_theme
 */
export function getPresetForScreen(screen: string, sceneId: string): AudioPresetId {
  switch (screen) {
    case 'menu':
      return 'menu_theme';

    case 'scene':
      return getPresetForScene(sceneId);

    case 'notebook':
      // Не меняем ambient при открытии блокнота
      return 'silence';

    case 'accusation':
      return 'accusation_theme';

    case 'result':
      return 'tension';

    case 'finale':
      return 'finale_theme';

    case 'chapterEnd':
      return 'summary_theme';

    default:
      return 'silence';
  }
}

/**
 * Возвращает пресет для конкретной сцены.
 */
function getPresetForScene(sceneId: string): AudioPresetId {
  // Глава 1
  if (sceneId.startsWith('ch1_')) {
    if (sceneId === 'ch1_04_night') {
      return 'night_corridor';
    }
    return 'train_ambient';
  }

  // Глава 2
  if (sceneId.startsWith('ch2_')) {
    return 'train_ambient';
  }

  // Глава 3
  if (sceneId.startsWith('ch3_')) {
    if (sceneId === 'ch3_03_risky' || sceneId === 'ch3_05_storm') {
      return 'tension';
    }
    if (sceneId === 'ch3_04_deduction') {
      return 'night_corridor';
    }
    return 'train_ambient';
  }

  // Глава 4
  if (sceneId.startsWith('ch4_')) {
    if (sceneId === 'ch4_01_police_arrival' || sceneId === 'ch4_02_accusation') {
      return 'tension';
    }
    if (sceneId === 'ch4_04_moral_choice') {
      return 'finale_theme';
    }
    return 'train_ambient';
  }

  return 'silence';
}
