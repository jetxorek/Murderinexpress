import { describe, it, expect } from 'vitest';
import { getPresetForScreen } from '../src/services/audio/sceneMap';
import { PRESETS } from '../src/services/audio/presets';

describe('getPresetForScreen', () => {
  it('возвращает menu_theme для экрана menu', () => {
    expect(getPresetForScreen('menu', '')).toBe('menu_theme');
  });

  it('возвращает accusation_theme для экрана accusation', () => {
    expect(getPresetForScreen('accusation', '')).toBe('accusation_theme');
  });

  it('возвращает finale_theme для экрана finale', () => {
    expect(getPresetForScreen('finale', '')).toBe('finale_theme');
  });

  it('возвращает summary_theme для экрана chapterEnd', () => {
    expect(getPresetForScreen('chapterEnd', '')).toBe('summary_theme');
  });

  it('возвращает silence для экрана notebook', () => {
    expect(getPresetForScreen('notebook', '')).toBe('silence');
  });

  it('возвращает night_corridor для сцены ch1_04_night', () => {
    expect(getPresetForScreen('scene', 'ch1_04_night')).toBe('night_corridor');
  });

  it('возвращает train_ambient для сцены ch1_01_dining', () => {
    expect(getPresetForScreen('scene', 'ch1_01_dining')).toBe('train_ambient');
  });

  it('возвращает tension для сцены ch3_03_risky', () => {
    expect(getPresetForScreen('scene', 'ch3_03_risky')).toBe('tension');
  });

  it('возвращает tension для сцены ch3_05_storm', () => {
    expect(getPresetForScreen('scene', 'ch3_05_storm')).toBe('tension');
  });

  it('возвращает night_corridor для сцены ch3_04_deduction', () => {
    expect(getPresetForScreen('scene', 'ch3_04_deduction')).toBe('night_corridor');
  });

  it('возвращает tension для сцены ch4_01_police_arrival', () => {
    expect(getPresetForScreen('scene', 'ch4_01_police_arrival')).toBe('tension');
  });

  it('возвращает finale_theme для сцены ch4_04_moral_choice', () => {
    expect(getPresetForScreen('scene', 'ch4_04_moral_choice')).toBe('finale_theme');
  });

  it('возвращает silence для неизвестного экрана', () => {
    expect(getPresetForScreen('unknown', '')).toBe('silence');
  });

  it('возвращает silence для неизвестной сцены', () => {
    expect(getPresetForScreen('scene', 'unknown_scene')).toBe('silence');
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
