import { describe, it, expect } from 'vitest';
import { getPresetForScreen } from '../../src/services/audio/sceneMap';
import { PRESETS } from '../../src/services/audio/presets';
import type { AudioPresetId } from '../../src/services/audio/types';

describe('getPresetForScreen', () => {
  it('main_menu → menu_theme', () => {
    expect(getPresetForScreen('main_menu', '')).toBe('menu_theme');
  });
  it('scene ch1_01_dining → train_ambient', () => {
    expect(getPresetForScreen('scene', 'ch1_01_dining')).toBe('train_ambient');
  });
  it('scene ch1_04_night → night_corridor', () => {
    expect(getPresetForScreen('scene', 'ch1_04_night')).toBe('night_corridor');
  });
  it('scene ch3_03a → tension', () => {
    expect(getPresetForScreen('scene', 'ch3_03a_confront_countess')).toBe('tension');
  });
  it('scene unknown → default train_ambient', () => {
    expect(getPresetForScreen('scene', 'unknown_scene')).toBe('train_ambient');
  });
  it('death → death_sting', () => {
    expect(getPresetForScreen('death', '')).toBe('death_sting');
  });
  it('accusation → accusation_theme', () => {
    expect(getPresetForScreen('accusation', '')).toBe('accusation_theme');
  });
  it('unknown screen → silence', () => {
    expect(getPresetForScreen('unknown', '')).toBe('silence');
  });
});

describe('PRESETS registry', () => {
  const ALL_PRESETS: AudioPresetId[] = [
    'silence', 'menu_theme', 'summary_theme', 'train_ambient',
    'night_corridor', 'tension', 'death_sting', 'accusation_theme',
    'finale_theme',
  ];

  it('every preset id has a factory', () => {
    for (const id of ALL_PRESETS) {
      expect(PRESETS[id], `missing preset: ${id}`).toBeDefined();
      expect(typeof PRESETS[id]).toBe('function');
    }
  });
});
