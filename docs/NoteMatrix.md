# NoteMatrix — Матрица заметок

Полный перечень всех NoteSpan по сценам: что игрок может занести в блокнот, к какой категории и цели это относится, какой ключ истины срабатывает и когда заметка становится сильной.

## Правила силы

- `strong` автоматически: категория `contradiction` и `truth = 'true'`
- `strong` по подкреплению: та же `target` + та же `category` в другой сцене, обе `truth = 'true' | 'plausible'`
- `strong` за риск: заметка из рискованной сцены, пройденной без смерти
- `false` никогда не становится `strong` — всегда `weak`, тянет счёт вниз

## Глава 1

### ch1_01_dining — Вагон-ресторан. Знакомство (M)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch1_01_01` | «Полковник Дмитрий Соколов» | psychology | char_01 | `taps_portcigarette_when_nervous` | true | weak → strong, если есть вторая psychology-заметка по char_01 |
| `n_ch1_01_02` | «Простите, я плохо спала» | psychology | char_02 | `seeks_sympathy` | true | weak → strong (ch2_04b) |
| `n_ch1_01_03` | «Княгиня Наталья Драгомирова» | psychology | char_03 | `pride` | true | weak → strong (ch2_05 / ch3_01a) |
| `n_ch1_01_04` | «Проводник беспрестанно протирает руки» | psychology | char_04 | `wipes_things_constantly` | true | weak → strong (ch1_03b) |
| `n_ch1_01_05` | «Секретарь поправляет очки» | psychology | char_05 | `adjusts_glasses` | true | weak → strong (ch2_04c) |
| `n_ch1_01_06` | «Горничная опускает глаза» | psychology | char_06 | `lowers_eyes` | true | weak → strong (ch2_04d) |
| `n_ch1_01_07` | «Профессор что-то бормочет себе под нос» | psychology | char_07 | `mutters` | true | weak → strong (ch3_01b) |

### ch1_02_ratchett — Разумов предлагает защиту (M)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch1_02_01` | «Я заплачу, сколько скажете» | motive | victim | `offers_money_for_protection` | true | weak (не участвует) |
| `n_ch1_02_02` | «Он кого-то боится» | psychology | victim | `fears_someone` | true | weak (не участвует) |
| `n_ch1_02_03` | «Всё это было давно. Забудьте.» | motive | victim | `dark_past` | true | weak (не участвует) |
| `n_ch1_02_04` | «Угрожающее письмо написано на дорогой бумаге — подделка» | contradiction | group | `threat_letter_is_fabricated` | true | **strong** (contradiction) |

### ch1_03_evening — Вечер. Выбор (C)

#### ch1_03a_poker — Покер (C)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch1_03a_01` | «Соколов постукивает по портсигару» | psychology | char_01 | `taps_portcigarette_when_nervous` | true | strong (подкрепление ch1_01) |
| `n_ch1_03a_02` | «Макаров говорит о Разумове с презрением» | motive | char_05 | `personal_hatred_of_razumov` | true | weak → strong (ch2_04c) |

#### ch1_03b_corridor — Коридор (C)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch1_03b_01` | «Проводник снова протирает руки» | psychology | char_04 | `wipes_things_constantly` | true | strong (подкрепление ch1_01) |
| `n_ch1_03b_02` | «Проводник отпирает купе ключом из связки» | opportunity | char_04 | `had_keys` | true | weak → strong (ch2_02 / ch3_02) |
| `n_ch1_03b_03` | «Графиня стоит у купе Разумова» | opportunity | char_02 | `was_near_compartment` | true | weak |

#### ch1_03c_countess — Разговор с графиней (C)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch1_03c_01` | «Я потеряла близкого человека» | motive | char_02 | `grief_for_niece` | true | weak → strong (ch2_04b) |
| `n_ch1_03c_02` | «Графиня боится княгиню» | psychology | char_02 | `fear_of_princess` | true | weak → strong (ch2_03 / ch3_05) |
| `n_ch1_03c_03` | «Приняла снотворное и спала» | alibi | char_02 | `slept_after_sleeping_pills` | false | weak (всегда) |

### ch1_04_night — Ночь, шум в коридоре (M)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch1_04_01` | «В коридоре слышны шаги и женский голос» | opportunity | group | `all_in_corridor_at_night` | true | weak → strong (ch2_01) |
| `n_ch1_04_02` | «Фигура в тёмном платье у купе» | opportunity | char_02 | `corridor_at_2am` | true | weak → strong (ch2_04b) |
| `n_ch1_04_03` | «В коридоре был человек в форме проводника — не Михайлов» | contradiction | group | `second_conductor_is_disguise` | true | **strong** (contradiction) |

### ch1_05_morning — Тело найдено (M)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch1_05_01` | «Семь ножевых ранений» | motive | group | `all_conspired` | true | weak → strong (ch2_01 / ch2_03) |
| `n_ch1_05_02` | «У всех наготове алиби» | opportunity | group | `everyone_had_alibi_ready` | true | weak |

## Глава 2

### ch2_01_crime_scene — Осмотр купе (M)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch2_01_01` | «Фотография девочки с надписью „Маша“» | motive | group | `revenge_for_masha` | true | strong (подкрепление ch1_05 / ch2_03) |
| `n_ch2_01_02` | «Обгоревшая бумага с обрывком „…АРС…»» | psychology | group | `each_knew_victim_before` | true | weak → strong (ch2_03) |
| `n_ch2_01_03` | «Часы остановились в 2:15» | opportunity | group | `all_in_corridor_at_night` | true | strong (подкрепление ch1_04) |
| `n_ch2_01_04` | «Бумаги Разумова разбросаны, но папок нет» | opportunity | char_05 | `had_access_to_razumov_papers` | true | weak → strong (ch2_04c) |
| `n_ch2_01_05` | «Ёршик для чистки трубки на полу — слишком прямо» | contradiction | char_07 | `pipe_cleaner_is_planted` | true | **strong** (contradiction) |
| `n_ch2_01_06` | «Окно открыто, но следов на снегу под ним нет» | contradiction | group | `open_window_is_staged_escape` | true | **strong** (contradiction) |
| `n_ch2_01_07` | «Красный халат найден в багаже Пирогова» | contradiction | group | `red_kimono_is_plant` | true | **strong** (contradiction) |
| `n_ch2_01_08` | «Разбитые часы — инсценировка: время сбито намеренно» | contradiction | group | `clock_manipulated` | true | **strong** (contradiction) |
| `n_ch2_01_09` | «Спички двух видов в пепельнице — курили двое или инсценировали» | contradiction | group | `two_kinds_of_matches` | true | **strong** (contradiction) |
| `n_ch2_01_10` | «Нож в туалетной сумке не принадлежал Разумову — подброшен» | contradiction | group | `knife_in_sponge_bag_is_plant` | true | **strong** (contradiction) |

### ch2_02_conductor_first — Первый допрос проводника (M)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch2_02_01` | «Проверял документы» | alibi | char_04 | `in_compartment_checking_documents` | false | weak |
| `n_ch2_02_02` | «У меня связка от всех купе» | opportunity | char_04 | `had_keys` | true | strong (подкрепление ch1_03b) |
| `n_ch2_02_03` | «Замки можно открыть и снаружи» | opportunity | char_04 | `could_open_locked_doors` | true | weak → strong (ch3_02) |
| `n_ch2_02_04` | «Я был в служебном купе — связка всю ночь висела не там» | contradiction | char_04 | `claims_compartment_vs_keys_missing_overnight` | true | strong (contradiction) |
| `n_ch2_02_05` | ««Кто-то видел мужчину» — слух, а не показание» | contradiction | char_04 | `witness_saw_man_is_false` | true | **strong** (contradiction) |

### ch2_03_breakfast — Завтрак (M)

| ID | Фрагмент | Категория | Target | truthKey | Truth | Сила |
|---|---|---|---|---|---|---|
| `n_ch2_03_01` | «Кто-то произносит: „Арсеньевы…»» | motive | group | `revenge_for_masha` | true | strong (третье подкрепление) |
| `n_ch2_03_03` | «Соколов крестится» | psychology | char_01 | `grief_for_arsenyev_family` | true | strong (подкрепление ch1_01 / ch2_03) |
| `n_ch2_03_04` | «Горничная роняет чашку» | psychology | char_06 | `sees_masha_face` | true | strong (подкрепление ch1_01 / ch2_03) |
| `n_ch2_03_05` | «Княгиня делает знак проводнику» | psychology | char_03 | `commands_conductor` | true | strong (подкрепление ch1_01 / ch2_03) |
| `n_ch2_03_06` | «Графиня смотрит на княгиню с ужасом» | psychology | char_02 | `fear_of_princess` | true | strong (подкрепление ch1_03c / ch2_03) |
| `n_ch2_03_07` | «Все замолкают при этом имени» | psychology | group | `each_hid_connection` | true | strong (подкрепление ch2_01) |
| `n_ch2_03_08` | ««Разумов не говорил по-французски» — ложный след» | contradiction | char_05 | `french_language_is_misdirection` | true | **strong** (contradiction) |

## Сводка по категориям

| Категория | Всего | Strong | Weak/Plausible |
|---|---|---|---|
| motive | 18 | 6 | 12 |
| opportunity | 15 | 5 | 10 |
| alibi | 10 | 2 | 8 |
| psychology | 28 | 18 | 10 |
| contradiction | 25 | 25 | 0 |
| **Всего** | **96** | **56** | **40** |

## Подброшенные улики (11, contradiction/true)

Первая волна (5): `n_ch2_01_05`, `n_ch2_01_06`, `n_ch2_01_07`, `n_ch2_01_08`, `n_ch3_02_06`.

Вторая волна (6): `n_ch1_02_04`, `n_ch1_04_03`, `n_ch2_01_09`, `n_ch2_01_10`, `n_ch2_02_05`, `n_ch2_03_08`.

Все — strong при взятии. Использование в обвинении даёт +1.5 каждое.

## Ложные заметки (7 штук)

`n_ch1_03c_03`, `n_ch2_02_01`, `n_ch2_04a_04`, `n_ch2_04c_04`, `n_ch2_04d_04`, `n_ch3_01a_01`, `n_ch3_01b_01`.

Каждая — заявленное алиби, которое не подтверждается. Это ловушки: игрок, строящий теорию на алиби персонажа, теряет очки.
