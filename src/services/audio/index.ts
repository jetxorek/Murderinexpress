/**
 * Процедурный звуковой движок.
 * Публичное API — через `audio` singleton.
 */

export type { AudioPresetId, AudioApi, PresetInstance, PresetFactory } from './types';
export { audio, getPresetForScreen } from './api';
