import { Scene } from '../../schemas/scene';

export const ch2_01_crime_scene: Scene = {
  id: 'ch2_01_crime_scene',
  chapter: 2,
  title: 'Осмотр купе',
  type: 'mandatory',
  background: 'compartment_raz',
  characters: [],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Пирогов вернулся в купе Разумова один. Тело уже унесли, но запах остался. Он открыл окно — снег влетел в щель, холодный, чистый. На секунду стало легче.\n\nНа столике, среди разбросанных бумаг, лежала фотография. Маленькая, потрёпанная, с загнутым углом. Девочка лет десяти, с двумя косичками и серьёзным лицом. На обороте — надпись чернилами: «Маша».',
      noteSpans: [{
        id: 'n_ch2_01_01',
        text: 'Фотография девочки с надписью «Маша»',
        category: 'motive',
        target: 'group',
        truthKey: 'revenge_for_masha',
      }],
    },
    n2: {
      type: 'narration',
      text: 'В пепельнице — обгоревший клочок бумаги. Пирогов достал его пинцетом, поднёс к свету. Буквы расплывались, но две строки читались: «...мни маленькую...» и ниже — «...Арс...». Он не стал додумывать. Он просто запомнил.',
      noteSpans: [{
        id: 'n_ch2_01_02',
        text: 'Обгоревшая бумага с обрывком «…АРС…»',
        category: 'psychology',
        target: 'group',
        truthKey: 'each_knew_victim_before',
      }],
    },
    n3: {
      type: 'narration',
      text: 'Часы на столике. Разбитые, с трещиной на стекле. Стрелки застыли на 2:15. Пирогов повертел их в руках, потом поставил обратно. Слишком аккуратно. Слишком вовремя.',
      noteSpans: [{
        id: 'n_ch2_01_03',
        text: 'Часы остановились в 2:15',
        category: 'opportunity',
        target: 'group',
        truthKey: 'all_in_corridor_at_night',
      }],
    },
    n4: {
      type: 'narration',
      text: 'Под кроватью — папка. Пустая. Бумаги Разумова были разбросаны по всему купе, но папок не осталось. Кто-то забрал их. Или сжёг. Или просто унёс.',
      noteSpans: [{
        id: 'n_ch2_01_04',
        text: 'Бумаги Разумова разбросаны, но папок нет',
        category: 'opportunity',
        target: 'char_05',
        truthKey: 'had_access_to_razumov_papers',
      }],
    },
    n5: {
      type: 'end',
      nextScene: 'ch2_02_conductor_first',
      outcome: 'continue',
    },
  },
};
