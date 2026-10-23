import { describe, it, expect } from 'vitest';
import { getPresetForScreen } from '../../src/services/audio/sceneMap';
import { PRESETS } from '../../src/services/audio/presets';

describe('getPresetForScreen', () => {
  it('возвращает menu_theme для экрана main_menu', () => {
    expect(getPresetForScreen('main_menu', '')).toBe('menu_theme');
  });

  it('возвращает accusation_theme для экрана accusation', () => {
    expect(getPresetForScreen('accusation', '')).toBe('accusation_theme');
  });

  it('возвращает finale_theme для экрана finale', () => {
    expect(getPresetForScreen('finale', '')).toBe('finale_theme');
  });

  it('возвращает summary_theme для экрана chapter_summary', () => {
    expect(getPresetForScreen('chapter_summary', '')).toBe('summary_theme');
  });

  it('возвращает death_sting для экрана death', () => {
    expect(getPresetForScreen('death', '')).toBe('death_sting');
  });

  it('возвращает silence для неизвестного экрана', () => {
    expect(getPresetForScreen('unknown', '')).toBe('silence');
  });

  it('возвращает train_ambient для сцены ch1_01_dining', () => {
    expect(getPresetForScreen('scene', 'ch1_01_dining')).toBe('train_ambient');
  });

  it('возвращает night_corridor для сцены ch1_04_night', () => {
    expect(getPresetForScreen('scene', 'ch1_04_night')).toBe('night_corridor');
  });

  it('возвращает tension для сцены ch3_03a_confront_countess', () => {
    expect(getPresetForScreen('scene', 'ch3_03a_confront_countess')).toBe('tension');
  });

  it('возвращает train_ambient для неизвестной сцены (default)', () => {
    expect(getPresetForScreen('scene', 'unknown_scene')).toBe('train_ambient');
  });

  it('возвращает silence для hub с неизвестной сценой', () => {
    expect(getPresetForScreen('hub', 'unknown')).toBe('train_ambient');
  });
});

describe('PRESETS registry', () => {
  it('содержит все необходимые пресеты', () => {
    const expectedPresets = [
      'silence',
      'menu_theme',
      'summary_theme',
      'train_ambient',
      'night_corridor',
      'tension',
      'death_sting',
      'accusation_theme',
      'finale_theme',
    ];

    for (const presetId of expectedPresets) {
      expect(PRESETS).toHaveProperty(presetId);
      expect(typeof PRESETS[presetId]).toBe('function');
    }
  });

  it('silence возвращает пустой stop', () => {
    const mockCtx = {} as AudioContext;
    const mockDest = {} as AudioNode;
    const instance = PRESETS.silence(mockCtx, mockDest);
    expect(instance).toHaveProperty('stop');
    expect(typeof instance.stop).toBe('function');
    // Не должно выбрасывать ошибку
    expect(() => instance.stop()).not.toThrow();
  });
});
