import { Scene } from '../../schemas/scene';

export const ch2_02_conductor_first: Scene = {
  id: 'ch2_02_conductor_first',
  chapter: 2,
  title: 'Первый допрос проводника',
  type: 'mandatory',
  background: 'service',
  characters: ['char_04'],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'dialogue',
      speaker: 'char_04',
      text: 'Я... я был в служебном купе. Проверял документы.',
      tone: 'neutral',
      noteSpans: [{
        id: 'n_ch2_02_01',
        text: 'Проверял документы',
        category: 'alibi',
        target: 'char_04',
        truthKey: 'in_compartment_checking_documents',
      }],
    },
    n2: {
      type: 'narration',
      text: 'Пирогов посмотрел на его пояс. Связки не было.',
    },
    n3: {
      type: 'dialogue',
      speaker: 'char_04',
      text: 'Есть. Но я их не трогал. Связка висела на месте. Всю ночь.',
      tone: 'neutral',
      noteSpans: [{
        id: 'n_ch2_02_02',
        text: 'У меня связка от всех купе',
        category: 'opportunity',
        target: 'char_04',
        truthKey: 'had_keys',
      }],
    },
    n4: {
      type: 'dialogue',
      speaker: 'char_04',
      text: 'Можно. Если знать как.',
      tone: 'neutral',
      noteSpans: [{
        id: 'n_ch2_02_03',
        text: 'Замки можно открыть и снаружи',
        category: 'opportunity',
        target: 'char_04',
        truthKey: 'could_open_locked_doors',
      }],
    },
    n5: {
      type: 'narration',
      text: 'Пирогов достал блокнот, полистал.\n\n— Вы сказали, что были в служебном купе. Но связка ключей всю ночь висела не на месте. И вы не помните, где она. Как это понимать?\n\nМихайлов молчал. Долго. Потом сказал:\n\n— Я... я выходил. Ненадолго. Проверить коридор.\n\n— С ключами?\n\nОн не ответил.',
      noteSpans: [{
        id: 'n_ch2_02_04',
        text: 'Я был в служебном купе — связка всю ночь висела не там',
        category: 'contradiction',
        target: 'char_04',
        truthKey: 'claims_compartment_vs_keys_missing_overnight',
      }],
    },
    n6: {
      type: 'end',
      nextScene: 'ch2_03_breakfast',
      outcome: 'continue',
    },
  },
};
