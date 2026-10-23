import { Scene } from '../../schemas/scene';

export const ch2_05_police_announce: Scene = {
  id: 'ch2_05_police_announce',
  chapter: 2,
  title: 'Объявление о полиции',
  type: 'mandatory',
  background: 'dining_car',
  characters: ['char_01', 'char_02', 'char_03', 'char_04', 'char_05', 'char_06', 'char_07'],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Проводник вошёл в вагон-ресторан и объявил, что путь почти расчищен. Полиция будет на станции через несколько часов. Может быть, к вечеру. Может быть, к утру. Как получится.\n\nВсе выслушали молча. Никто не обрадовался.',
    },
    n2: {
      type: 'narration',
      text: 'Княгиня усмехнулась. Не громко, но в тишине это прозвучало как выстрел. Она смотрела на графиню, и в её взгляде было что-то похожее на торжество.',
      noteSpans: [{
        id: 'n_ch2_05_01',
        text: 'Княгиня усмехается, глядя на графиню',
        category: 'psychology',
        target: 'char_03',
        truthKey: 'contempt_for_weakness',
      }],
    },
    n3: {
      type: 'narration',
      text: 'Графиня отвернулась. Плечи у неё дрожали. Пирогов подумал: «Она не боится полиции. Она боится того, что полиция узнает».',
    },
    n4: {
      type: 'end',
      nextScene: 'chapter_end',
      outcome: 'chapter_end',
    },
  },
};
