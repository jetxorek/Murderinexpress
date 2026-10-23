import { Scene } from '../../schemas/scene';

export const ch1_02_ratchett: Scene = {
  id: 'ch1_02_ratchett',
  chapter: 1,
  title: 'Разумов предлагает защиту',
  type: 'mandatory',
  background: 'dining_car',
  characters: ['char_01'],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Степан Разумов появился в вагоне-ресторане через десять минут после того, как все представились. Он не вошёл — он вплыл. Большой, тяжёлый, в дорогом пальто, которое было ему чуть мало. От него пахло одеколоном и чем-то ещё — потом? страхом?\n\nРазумов сел напротив Пирогова, не спросив разрешения. Положил руки на стол. На пальцах — перстни. На лице — улыбка, которая должна была казаться дружелюбной.',
    },
    n2: {
      type: 'dialogue',
      speaker: 'victim',
      text: 'Месье Пирогов, я слышал, вы детектив. Хороший детектив. Я в таких вещах разбираюсь. И я хочу предложить вам работу. Я заплачу, сколько скажете. Вперёд. Только будьте рядом. Смотрите в оба. Ночью. И завтра.',
      tone: 'neutral',
      noteSpans: [{
        id: 'n_ch1_02_01',
        text: 'Я заплачу, сколько скажете',
        category: 'motive',
        target: 'victim',
        truthKey: 'offers_money_for_protection',
      }],
    },
    n3: {
      type: 'narration',
      text: 'Пирогов не любил такие предложения. Не потому, что они были оскорбительны — деньги всегда оскорбительны, если их предлагают вместо слов. А потому, что за ними всегда стоял страх.',
    },
    n4: {
      type: 'dialogue',
      speaker: 'victim',
      text: 'Я никого не боюсь. Я просто... предпочитаю быть осторожным. Осторожность — это не страх, это опыт. У меня был... опыт. Давно. В другой жизни.',
      tone: 'neutral',
      noteSpans: [
        {
          id: 'n_ch1_02_02',
          text: 'Он кого-то боится',
          category: 'psychology',
          target: 'victim',
          truthKey: 'fears_someone',
        },
        {
          id: 'n_ch1_02_03',
          text: 'Всё это было давно. Забудьте.',
          category: 'motive',
          target: 'victim',
          truthKey: 'dark_past',
        },
      ],
    },
    n5: {
      type: 'choice',
      prompt: 'Что отвечает Пирогов?',
      options: [
        {
          id: 'polite_refuse',
          text: 'Отказаться вежливо, но твёрдо',
          tone: 'soft',
          effects: { suspicion: 0, next: 'n6' },
        },
        {
          id: 'sharp_refuse',
          text: 'Отказаться резко',
          tone: 'pressure',
          effects: { suspicion: 10, next: 'n6' },
        },
        {
          id: 'direct_ask',
          text: 'Спросить прямо: «Кто вас хочет убить?»',
          tone: 'logical',
          effects: { suspicion: 5, next: 'n6' },
        },
      ],
    },
    n6: {
      type: 'end',
      nextScene: 'ch1_03_evening',
      outcome: 'continue',
    },
  },
};
