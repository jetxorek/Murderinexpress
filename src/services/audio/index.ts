/**
 * Процедурный звуковой движок.
 * Публичное API — через `audio` singleton.
 */

export type { AudioPresetId, AudioApi, PresetInstance, PresetFactory } from './types';
export { audio } from './api';
export { getPresetForScreen } from './sceneMap';
