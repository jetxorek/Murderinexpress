# SceneGraph — Граф сцен

Полный граф сцен для всех 4 глав.

## Обозначения

- (M) — обязательная сцена, (C) — сцена на выбор, (R) — рискованная, (D) — сцена смерти
- [N слотов] — сколько слотов главы тратит сцена
- → — переход к следующему узлу/сцене

## Глава 1. «Вечер и утро» — 5 слотов

### `ch1_01_dining` — Вагон-ресторан. Знакомство (M, slot 1)
- background: `dining_car`; characters: [char_01, char_02, char_03, char_04, char_05, char_06, char_07]
- entry `n1` → `n2` (span 01) → `n3` (span 02) → `n4` (span 03) → `n5` (span 04) → `n6` (span 05) → `n7` (span 06) → `n8` (span 07) → `n9` choice → `n10` end → `ch1_02_ratchett`
- noteSpans: `n_ch1_01_01`…`07`

### `ch1_02_ratchett` — Разумов предлагает защиту (M, slot 1)
- background: `dining_car`; characters: [victim]
- entry `n1` → `n2` (span 01) → `n3` (span 02, 03) → `n4` (span 04 — письмо) → `n5` choice → `n6` end → `ch1_03_evening`
- noteSpans: `n_ch1_02_01`…`04`

### `ch1_03_evening` — Вечер. Выбор (C, slot 1)
- background: `corridor`; characters: []
- entry `n1` → `n2` choice → 3 варианта:
  - `n_poker_result` (spans 01, 02) → `n_end` → `ch1_04_night`
  - `n_corridor_result` (spans 01, 02, 03) → `n_end` → `ch1_04_night`
  - `n_countess_result` (spans 01, 02, 03) → `n_end` → `ch1_04_night`

### `ch1_04_night` — Ночь (M, slot 1)
- background: `corridor`; characters: [char_02]
- entry `n1` → `n2` (span 01, 02) → `n3` (span 03 — второй проводник) → `n4` end → `ch1_05_morning`
- noteSpans: `n_ch1_04_01`…`03`

### `ch1_05_morning` — Утро. Тело найдено (M, slot 1)
- background: `compartment_raz`; characters: [char_04, char_07]
- entry `n1` → `n2` → `n3` (span 01) → `n4` (span 02) → `n5` end → chapter_end
- noteSpans: `n_ch1_05_01`, `n_ch1_05_02`

## Глава 2. «Первые допросы» — 6 слотов

### `ch2_01_crime_scene` — Осмотр купе (M, slot 1)
- background: `compartment_raz`; characters: []
- entry `n1` (span 01) → `n2` (span 02) → `n3` (span 03) → `n4` (span 04) → `n_ch2_01_05` (span 05) → `n_ch2_01_06` (span 06) → `n_ch2_01_07` (span 07) → `n_ch2_01_08` (span 08) → `n_ch2_01_09` (span 09) → `n_ch2_01_10` (span 10) → `n5` end → `ch2_02_conductor_first`
- noteSpans: `n_ch2_01_01`…`10`

### `ch2_02_conductor_first` — Первый допрос проводника (M, slot 1)
- background: `service`; characters: [char_04]
- entry `n1` (span 01) → `n2` → `n3` (span 02) → `n4` (span 03) → `n5` (span 04) → `n_ch2_02_05` (span 05) → `n6` end → `ch2_03_breakfast`
- noteSpans: `n_ch2_02_01`…`05`

### `ch2_03_breakfast` — Завтрак (M, slot 1)
- background: `dining_car`; characters: [все 7 подозреваемых]
- entry `n1` → `n2` (span 01) → `n3` → `n4` (span 02) → `n5` (span 03) → `n6` (span 04) → `n7` (span 05) → `n8` (span 06) → `n_ch2_03_08` (span 07 — французский) → `n9` end → `ch2_04_interviews`
- noteSpans: `n_ch2_03_01`…`08`

### `ch2_04_interviews` — Допросы (C, slot 2)
- background: `corridor`; characters: []
- entry `n1` choice → 4 варианта (выбрать 2):
  - `colonel` → `n2` end → `ch2_05_police_announce`
  - `countess` → `n2` end → `ch2_05_police_announce`
  - `secretary` → `n2` end → `ch2_05_police_announce`
  - `maid` → `n2` end → `ch2_05_police_announce`

### `ch2_05_police_announce` — Объявление о полиции (M, slot 1)
- background: `dining_car`; characters: [все 7 подозреваемых]
- entry `n1` → `n2` (span 01) → `n3` → `n4` end → chapter_end

## Глава 3. «Глубокие тайны» — 6 слотов

### `ch3_01_late_interviews` — Поздние допросы (C, slot 2)
- background: `corridor`; characters: []
- entry `n1` choice → 3 варианта (выбрать 2):
  - `princess` → `n_princess_result` (spans 01-04) → `n_end` → `ch3_02_evidence`
  - `professor` → `n_professor_result` (spans 01-04) → `n_end` → `ch3_02_evidence`
  - `conductor` → `n_conductor_result` (spans 01-04) → `n_end` → `ch3_02_evidence`

### `ch3_02_evidence` — Улики (M, slot 1)
- background: `compartment_raz`; characters: []
- entry `n1` → `n2` (span 01) → `n3` (span 02) → `n4` (span 03) → `n5` (span 04) → `n6` (span 05) → `n_ch3_02_06` (span 06) → `n7` end → `ch3_03_risky`
- noteSpans: `n_ch3_02_01`…`06`

### `ch3_03_risky` — Рискованная развилка (C, slot 1)
- background: `corridor`; characters: []
- entry `n1` choice → 4 варианта:
  - `confront_countess` → `n_countess_confront` → `n_countess_choice` → `n_countess_pressure` / `n_countess_sympathy` → `n_end` → `ch3_04_deduction`
  - `search_compartment` → `n_search_result` (spans 01, 02) → `n_search_choice` → `n_search_hide` / `n_search_face` → `n_end` → `ch3_04_deduction`
  - `confront_professor` → `n_professor_confront` (span 01) → `n_professor_choice` → `n_professor_pressure` (spans 02, 03) / `n_professor_retreat` → `n_end` → `ch3_04_deduction`
  - `skip` → `n_end` → `ch3_04_deduction`

### `ch3_04_deduction` — Размышления (M, slot 1)
- background: `snow_window`; characters: []
- entry `n1` → `n2` → `n3` → `n4` end → `ch3_05_storm`

### `ch3_05_storm` — Метель (M, slot 1)
- background: `snow_window`; characters: [все 7 подозреваемых]
- entry `n1` → `n2` (span 01) → `n3` (span 02) → `n4` → `n5` end → chapter_end

## Глава 4. «Развязка» — 4 слота

### `ch4_01_police_arrival` — Приезд полиции (M, slot 1)
- background: `dining_car`; characters: [все 7 подозреваемых]
- entry `n1` → `n2` → `n3` end → accusation_ready

### `ch4_02_accusation` — Обвинение (M, slot 0)
- background: `dining_car`; characters: [все 7 подозреваемых]
- entry `n1` → `n2` end → accusation_ready

### `ch4_03_resolution` — Разрешение (M, slot 0)
- background: `finale_car`; characters: [все 7 подозреваемых]
- entry `n1` → `n2` end → accusation_ready

### `ch4_04_moral_choice` — Моральный выбор (finale, slot 0)
- background: `finale_car`; characters: [все 7 подозреваемых]
- entry `n1` → `n2` end → finale

## Проверки

| Проверка | Результат |
|---|---|
| Все обязательные сцены достижимы | ✅ |
| Нет тупиков (кроме смертей) | ✅ |
| Все ветки сходятся | ✅ |
| Смерть возвращает в граф | ✅ |
| Раннее обвинение не ломает граф | ✅ |
| Пропущенные интервью не блокируют финал | ✅ |
| Все 7 персонажей представлены до первого допроса | ✅ |
| Новые узлы вставлены без разрыва цепочки `next` | ✅ |
| Все новые truthKeys есть в `NoteMatrix.md` | ✅ |
| Все новые заметки — contradiction + true (авто-strong) | ✅ |
| Минимальный путь A остаётся валидным | ✅ (новые заметки опциональны) |
| Все 11 подброшенных улик достижимы | ✅ |
