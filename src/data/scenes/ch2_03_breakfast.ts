import { Scene } from '../../schemas/scene';

export const ch2_03_breakfast: Scene = {
  id: 'ch2_03_breakfast',
  chapter: 2,
  title: 'Завтрак',
  type: 'mandatory',
  background: 'dining_car',
  characters: ['char_01', 'char_02', 'char_03', 'char_04', 'char_05', 'char_06', 'char_07'],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'За завтраком никто не ел. Тарелки стояли нетронутые, чай остывал. Семеро сидели за одним столом, но каждый — в своём мире.',
    },
    n2: {
      type: 'narration',
      text: 'И только когда профессор Белов, рассеянно помешивая ложкой в чашке, произнёс: «Арсеньевы... интересно, как они теперь...», — все замерли.',
      noteSpans: [{
        id: 'n_ch2_03_01',
        text: 'Кто-то произносит: «Арсеньевы…»',
        category: 'motive',
        target: 'group',
        truthKey: 'revenge_for_masha',
      }],
    },
    n3: {
      type: 'narration',
      text: 'Тишина была такой густой, что Пирогов услышал, как снег касается стекла. Потом княгиня поставила чашку на блюдце — звонко, нарочито. И сказала:\n\n— Аркадий Петрович, вы, как всегда, не вовремя.',
    },
    n4: {
      type: 'narration',
      text: 'Соколов перекрестился. Быстро, незаметно, как будто поправил воротник. Но Пирогов увидел.',
      noteSpans: [{
        id: 'n_ch2_03_03',
        text: 'Соколов крестится',
        category: 'psychology',
        target: 'char_01',
        truthKey: 'grief_for_arsenyev_family',
      }],
    },
    n5: {
      type: 'narration',
      text: 'Горничная Шмидт уронила чашку. Чай растёкся по скатерти, как карта с неизвестными границами. Она вскочила, принялась вытирать, руки тряслись.\n\n— Простите, — бормотала она. — Простите, я нечаянно.',
      noteSpans: [{
        id: 'n_ch2_03_04',
        text: 'Горничная роняет чашку',
        category: 'psychology',
        target: 'char_06',
        truthKey: 'sees_masha_face',
      }],
    },
    n6: {
      type: 'narration',
      text: 'Княгиня сделала знак проводнику — едва заметный, двумя пальцами. Михайлов кивнул и вышел. Никто, кроме Пирогова, этого не заметил.',
      noteSpans: [{
        id: 'n_ch2_03_05',
        text: 'Княгиня делает знак проводнику',
        category: 'psychology',
        target: 'char_03',
        truthKey: 'commands_conductor',
      }],
    },
    n7: {
      type: 'narration',
      text: 'Графиня Вронская смотрела на княгиню. В её глазах был не страх даже — ужас. Так смотрят на то, что должно случиться и чего нельзя остановить.',
      noteSpans: [{
        id: 'n_ch2_03_06',
        text: 'Графиня смотрит на княгиню с ужасом',
        category: 'psychology',
        target: 'char_02',
        truthKey: 'fear_of_princess',
      }],
    },
    n8: {
      type: 'narration',
      text: 'Все замолчали. Все смотрели в свои тарелки. Все знали что-то, чего не говорили. Пирогов откинулся на спинку стула и подумал: «Вот оно. Вот что бывает, когда люди слишком долго молчат вместе».',
      noteSpans: [{
        id: 'n_ch2_03_07',
        text: 'Все замолкают при этом имени',
        category: 'psychology',
        target: 'group',
        truthKey: 'each_hid_connection',
      }],
    },
    n_ch2_03_08: {
      type: 'narration',
      text: '— Он ведь не говорил по-французски, — сказал Макаров, ни к кому не обращаясь. — Разумов. Я работал с ним год, он ни слова.\n\nПирогов посмотрел на него. Слишком поспешно. Слишком уверенно. Записка на обгоревшей бумаге была на французском. И если Разумов не знал языка, значит, записка была не для него. Или её написал тот, кто хотел, чтобы Пирогов так подумал.',
      noteSpans: [{
        id: 'n_ch2_03_08',
        text: '«Разумов не говорил по-французски» — ложный след',
        category: 'contradiction',
        target: 'char_05',
        truthKey: 'french_language_is_misdirection',
      }],
    },
    n9: {
      type: 'end',
      nextScene: 'ch2_04_interviews',
      outcome: 'continue',
    },
  },
};
