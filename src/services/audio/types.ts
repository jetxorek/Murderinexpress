export type AudioPresetId =
  | 'silence'
  | 'menu_theme'
  | 'summary_theme'
  | 'train_ambient'
  | 'night_corridor'
  | 'tension'
  | 'death_sting'
  | 'accusation_theme'
  | 'finale_theme';

export type AudioApi = {
  init: () => void;
  isInitialized: () => boolean;
  playPreset: (id: AudioPresetId) => void;
  stop: () => void;
  setVolume: (v: number) => void;
  getVolume: () => number;
  setMuted: (b: boolean) => void;
  isMuted: () => boolean;
};

export type PresetInstance = {
  stop: () => void;
};

export type PresetFactory = (
  ctx: AudioContext,
  destination: AudioNode,
) => PresetInstance;
