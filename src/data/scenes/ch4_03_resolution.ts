import { Scene } from '../../schemas/scene';

export const ch4_03_resolution: Scene = {
  id: 'ch4_03_resolution',
  chapter: 4,
  title: 'Разрешение',
  type: 'mandatory',
  background: 'finale_car',
  characters: ['char_01', 'char_02', 'char_03', 'char_04', 'char_05', 'char_06', 'char_07'],
  entry: 'n1',
  slotCost: 0,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Результат обвинения определяется на основе собранных улик и аргументов.',
    },
    n2: {
      type: 'end',
      nextScene: 'accusation_ready',
      outcome: 'accusation_ready',
    },
  },
};
