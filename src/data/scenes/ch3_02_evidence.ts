import { Scene } from '../../schemas/scene';

export const ch3_02_evidence: Scene = {
  id: 'ch3_02_evidence',
  chapter: 3,
  title: 'Улики',
  type: 'mandatory',
  background: 'compartment_raz',
  characters: [],
  entry: 'n1',
  slotCost: 1,
  nodes: {
    n1: {
      type: 'narration',
      text: 'Пирогов разложил на столике всё, что удалось собрать. Платок с инициалом «Е», вышитым кириллицей. Пуговица от форменного кителя. Ёршик для трубки. Обгоревшая бумага. Разбитые часы. Каждая вещь по отдельности ничего не значила. Вместе они складывались в узор, который Пирогов пока не мог прочитать.',
    },
    n2: {
      type: 'narration',
      text: 'Платок был тонкий, батистовый, с гербом. Пирогов повертел его в руках. Инициал «Е» был вышит не машинной строчкой, а вручную — мелко, аккуратно. Такие платки делают на заказ.',
      noteSpans: [{
        id: 'n_ch3_02_01',
        text: 'Брошь с гербом Арсеньевых',
        category: 'contradiction',
        target: 'char_02',
        truthKey: 'brooch_belongs_to_arsenyev_family',
      }],
    },
    n3: {
      type: 'narration',
      text: 'В книге княгини — той самой, что она читала всю ночь, — между страницами лежала закладка. Кожаная, с тиснением. На закладке — след от чашки. Пирогов знал, что княгиня не пьёт чай из чашек с отбитыми краями.',
      noteSpans: [{
        id: 'n_ch3_02_02',
        text: 'Закладка на первой странице книги княгини',
        category: 'alibi',
        target: 'char_03',
        truthKey: 'no_direct_confirmation',
      }],
    },
    n4: {
      type: 'narration',
      text: 'Пуговица была от форменного кителя проводника. Такие же пуговицы Пирогов видел на мундире Михайлова. Но у Михайлова все пуговицы были на месте.',
      noteSpans: [{
        id: 'n_ch3_02_03',
        text: 'Пуговица проводника у двери',
        category: 'opportunity',
        target: 'char_04',
        truthKey: 'could_open_locked_doors',
      }],
    },
    n5: {
      type: 'narration',
      text: 'В коридоре, у окна, Пирогов нашёл трубку. Она пахла табаком, который курил только один человек в этом вагоне. Профессор Белов.',
      noteSpans: [{
        id: 'n_ch3_02_04',
        text: 'Трубка профессора в коридоре',
        category: 'opportunity',
        target: 'char_07',
        truthKey: 'corridor_at_night',
      }],
    },
    n6: {
      type: 'narration',
      text: 'В вещах Соколова Пирогов нашёл письмо. Старое, пожелтевшее, с подписью «Николай Арсеньев». Полковник Соколов сказал, что не знал Арсеньевых. Письмо говорило обратное.',
      noteSpans: [{
        id: 'n_ch3_02_05',
        text: 'Письмо Арсеньева к Соколову',
        category: 'contradiction',
        target: 'char_01',
        truthKey: 'claims_not_acquainted_vs_family_friend',
      }],
    },
    n_ch3_02_06: {
      type: 'narration',
      text: 'Пуговица от форменного кителя. Пирогов сравнил её с пуговицами на мундире проводника — Михайлов стоял рядом, бледный, руки по швам. Все пуговицы на месте. Все до одной. Эта — подброшена. Кто-то хотел, чтобы вина легла на проводника.',
      noteSpans: [{
        id: 'n_ch3_02_06_span',
        text: 'У проводника все пуговицы на месте — пуговица подброшена',
        category: 'contradiction',
        target: 'char_04',
        truthKey: 'button_is_planted',
      }],
    },
    n7: {
      type: 'end',
      nextScene: 'ch3_03_risky',
      outcome: 'continue',
    },
  },
};
