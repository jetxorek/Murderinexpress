import { Scene } from '../../schemas/scene';

export const ch4_02_accusation: Scene = {
  id: 'ch4_02_accusation',
  chapter: 4,
  title: 'Обвинение',
  type: 'mandatory',
  background: 'dining_car',
  characters: ['char_01', 'char_02', 'char_03', 'char_04', 'char_05', 'char_06', 'char_07'],
  entry: 'n1',
  slotCost: 0,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Пирогов стоит перед столом. Полицейские ждут. Семеро смотрят на него. Пора собирать версию.',
    },
    n2: {
      type: 'end',
      nextScene: 'accusation_ready',
      outcome: 'accusation_ready',
    },
  },
};
