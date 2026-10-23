import { Scene } from '../../schemas/scene';

export const ch4_01_police_arrival: Scene = {
  id: 'ch4_01_police_arrival',
  chapter: 4,
  title: 'Приезд полиции',
  type: 'mandatory',
  background: 'dining_car',
  characters: ['char_01', 'char_02', 'char_03', 'char_04', 'char_05', 'char_06', 'char_07'],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Полиция прибыла к вечеру. Двое в форме, один в штатском, с папкой. Они вошли в вагон, стряхивая снег с плеч, и посмотрели на Пирогова с тем выражением, с каким смотрят на человека, который слишком много знает.\n\n— Месье Пирогов? — сказал тот, что в штатском. — Мы наслышаны. Говорят, вы уже всё выяснили.',
    },
    n2: {
      type: 'narration',
      text: 'Пирогов поправил усы.\n\n— Почти.\n\nОн собрал всех в вагоне-ресторане. Семеро сидели за столом. Полицейские стояли у двери. Пирогов стоял в центре.\n\n— Господа, — сказал он. — Я знаю, кто убил Степана Разумова.\n\nТишина. Только снег бился в стекло.',
    },
    n3: {
      type: 'end',
      nextScene: 'accusation_ready',
      outcome: 'accusation_ready',
    },
  },
};
