import { Scene } from '../../schemas/scene';

export const ch1_03_evening: Scene = {
  id: 'ch1_03_evening',
  chapter: 1,
  title: 'Вечер. Выбор',
  type: 'optional',
  background: 'corridor',
  characters: [],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'После разговора с Разумовым Пирогов вернулся в своё купе, постоял у окна, посмотрел на снег. Снег шёл ровно, без ветра, как будто кто-то наверху просеивал его через сито. До ужина оставалось часа полтора.\n\nОн поправил усы и вышел в коридор.',
    },
    n2: {
      type: 'choice',
      prompt: 'Что делает Пирогов?',
      options: [
        {
          id: 'poker',
          text: 'Зайти в вагон-ресторан — там играют в покер',
          tone: 'neutral',
          effects: { next: 'n_end' },
        },
        {
          id: 'corridor',
          text: 'Пройтись по коридору, посмотреть, кто где',
          tone: 'logical',
          effects: {
            addNotes: [{
              id: 'n_ch1_03b_02',
              text: 'Проводник отпирает купе ключом из связки',
              category: 'opportunity',
              target: 'char_04',
              truthKey: 'had_keys',
            }],
            next: 'n_end',
          },
        },
        {
          id: 'countess',
          text: 'Постучать в купе графини Вронской',
          tone: 'soft',
          effects: {
            addNotes: [
              {
                id: 'n_ch1_03c_01',
                text: 'Я потеряла близкого человека',
                category: 'motive',
                target: 'char_02',
                truthKey: 'grief_for_niece',
              },
              {
                id: 'n_ch1_03c_02',
                text: 'Графиня боится княгиню',
                category: 'psychology',
                target: 'char_02',
                truthKey: 'fear_of_princess',
              },
            ],
            next: 'n_end',
          },
        },
      ],
    },
    n_end: {
      type: 'end',
      nextScene: 'ch1_04_night',
      outcome: 'continue',
    },
  },
};
