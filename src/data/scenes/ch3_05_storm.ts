import { Scene } from '../../schemas/scene';

export const ch3_05_storm: Scene = {
  id: 'ch3_05_storm',
  chapter: 3,
  title: 'Метель',
  type: 'mandatory',
  background: 'snow_window',
  characters: ['char_01', 'char_02', 'char_03', 'char_04', 'char_05', 'char_06', 'char_07'],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Метель усилилась. Снег бил в стёкла, как будто хотел попасть внутрь. Поезд стоял. Полиция задерживалась. В вагоне стало тесно от людей и тишины.',
    },
    n2: {
      type: 'narration',
      text: 'Княгиня сидела в вагоне-ресторане, разложив шахматы. Она играла сама с собой. Или делала вид.',
      noteSpans: [{
        id: 'n_ch3_05_01',
        text: 'Княгиня раскладывает шахматы',
        category: 'psychology',
        target: 'char_03',
        truthKey: 'chess_player',
      }],
    },
    n3: {
      type: 'narration',
      text: 'Графиня стояла у окна, глядя на снег. Потом обернулась и посмотрела на княгиню. Долго. Княгиня не подняла глаз от доски. Графиня отвернулась.',
      noteSpans: [{
        id: 'n_ch3_05_02',
        text: 'Графиня снова ищет взгляд княгини',
        category: 'psychology',
        target: 'char_02',
        truthKey: 'fear_of_princess',
      }],
    },
    n4: {
      type: 'narration',
      text: 'Пирогов стоял в дверях и смотрел на них. На всех семерых. На людей, которые знали друг друга до того, как сели в этот поезд. На людей, которые знали, что произойдёт. На людей, которые молчали.\n\nОн поправил усы.\n\n— Пора, — сказал он сам себе. — Пора назвать имена.',
    },
    n5: {
      type: 'end',
      nextScene: 'chapter_end',
      outcome: 'chapter_end',
    },
  },
};
