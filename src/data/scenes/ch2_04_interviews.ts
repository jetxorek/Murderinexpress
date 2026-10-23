import { Scene } from '../../schemas/scene';

export const ch2_04_interviews: Scene = {
  id: 'ch2_04_interviews',
  chapter: 2,
  title: 'Допросы',
  type: 'optional',
  background: 'corridor',
  characters: [],
  entry: 'n1',
  slotCost: 2,
  nodes: {
    n1: {
      type: 'choice',
      prompt: 'Кого допросить первым?',
      options: [
        {
          id: 'colonel',
          text: 'Полковника Соколова',
          tone: 'logical',
          effects: {
            addNotes: [
              {
                id: 'n_ch2_04a_01',
                text: 'Я знал её отца',
                category: 'motive',
                target: 'char_01',
                truthKey: 'duty_to_nikolai_arsenyev',
              },
              {
                id: 'n_ch2_04a_02',
                text: 'Соколов отводит взгляд',
                category: 'psychology',
                target: 'char_01',
                truthKey: 'avoids_eye_contact_when_lying',
              },
              {
                id: 'n_ch2_04a_03',
                text: 'Я курил в тамбуре — проводник видел его у купе',
                category: 'contradiction',
                target: 'char_01',
                truthKey: 'claims_vestibule_vs_conductor_saw_him_elsewhere',
              },
            ],
            next: 'n2',
          },
        },
        {
          id: 'countess',
          text: 'Графиню Вронскую',
          tone: 'soft',
          effects: {
            addNotes: [
              {
                id: 'n_ch2_04b_01',
                text: 'Я потеряла близкого человека',
                category: 'motive',
                target: 'char_02',
                truthKey: 'grief_for_niece',
              },
              {
                id: 'n_ch2_04b_02',
                text: 'Графиня теребит брошь',
                category: 'psychology',
                target: 'char_02',
                truthKey: 'touches_brooch_when_lying',
              },
              {
                id: 'n_ch2_04b_03',
                text: 'Я спала — проводник видел её в коридоре',
                category: 'contradiction',
                target: 'char_02',
                truthKey: 'claims_asleep_vs_conductor_saw_her',
              },
            ],
            next: 'n2',
          },
        },
        {
          id: 'secretary',
          text: 'Секретаря Макарова',
          tone: 'logical',
          effects: {
            addNotes: [
              {
                id: 'n_ch2_04c_01',
                text: 'Мой отец разорился, защищая их',
                category: 'motive',
                target: 'char_05',
                truthKey: 'father_ruined_defending_arsenyevs',
              },
              {
                id: 'n_ch2_04c_02',
                text: 'Я знал все его счета',
                category: 'psychology',
                target: 'char_05',
                truthKey: 'knows_financial_schemes',
              },
              {
                id: 'n_ch2_04c_03',
                text: 'Разбирал бумаги — бумаг в купе нет',
                category: 'contradiction',
                target: 'char_05',
                truthKey: 'claims_papers_vs_nothing_found',
              },
            ],
            next: 'n2',
          },
        },
        {
          id: 'maid',
          text: 'Горничную Шмидт',
          tone: 'sympathy',
          effects: {
            addNotes: [
              {
                id: 'n_ch2_04d_01',
                text: 'Я нянчила Машеньку',
                category: 'motive',
                target: 'char_06',
                truthKey: 'grief_for_masha_whom_she_nursed',
              },
              {
                id: 'n_ch2_04d_02',
                text: 'Акцент усиливается, когда она волнуется',
                category: 'psychology',
                target: 'char_06',
                truthKey: 'german_accent_when_emotional',
              },
              {
                id: 'n_ch2_04d_03',
                text: 'Я была у княгини — княгиня говорит иное',
                category: 'contradiction',
                target: 'char_06',
                truthKey: 'claims_with_princess_vs_princess_alibi_also_false',
              },
            ],
            next: 'n2',
          },
        },
      ],
    },
    n2: {
      type: 'end',
      nextScene: 'ch2_05_police_announce',
      outcome: 'continue',
    },
  },
};
