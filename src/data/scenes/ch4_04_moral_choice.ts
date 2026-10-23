import { Scene } from '../../schemas/scene';

export const ch4_04_moral_choice: Scene = {
  id: 'ch4_04_moral_choice',
  chapter: 4,
  title: 'Моральный выбор',
  type: 'finale',
  background: 'finale_car',
  characters: ['char_01', 'char_02', 'char_03', 'char_04', 'char_05', 'char_06', 'char_07'],
  entry: 'n1',
  slotCost: 0,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Пирогов назвал все семь имён. Тишина. Княгиня первая подняла голову: «Вы правы, месье. Мы все.»\n\nПолицейский в штатском шагнул вперёд, но Пирогов снова поднял руку.\n\n— Подождите. Дайте мне минуту.\n\nОн посмотрел на семерых. На людей, которые убили человека, чтобы отомстить за ребёнка. На людей, которые не могли жить иначе.\n\nОн думал.',
    },
    n2: {
      type: 'end',
      nextScene: 'finale',
      outcome: 'continue',
    },
  },
};
