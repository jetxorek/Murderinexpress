# ChangeLog — История изменений

## [0.1.2] — 2026-10-23

### Added
- 6 подброшенных улик: `threat_letter_is_fabricated`, `second_conductor_is_disguise`, `knife_in_sponge_bag_is_plant`, `two_kinds_of_matches`, `witness_saw_man_is_false`, `french_language_is_misdirection`.
- 6 truthKeys в `src/data/truthTable.ts` (char_04, char_05, group).
- 1 узел в `ch1_02_ratchett.ts`, 1 в `ch1_04_night.ts`, 2 в `ch2_01_crime_scene.ts`, 1 в `ch2_02_conductor_first.ts`, 1 в `ch2_03_breakfast.ts`.
- `NoteMatrix.md` (96 заметок, contradiction: 25) и `SceneGraph.md` обновлены.

## [0.1.1] — 2026-10-23

### Added
- 5 подброшенных улик из романа Кристи: `pipe_cleaner_is_planted`, `open_window_is_staged_escape`, `red_kimono_is_plant`, `clock_manipulated`, `button_is_planted`.
- 5 truthKeys в `src/data/truthTable.ts` (char_04, char_07, group).
- 4 узла в `ch2_01_crime_scene.ts`, 1 узел в `ch3_02_evidence.ts`.
- `NoteMatrix.md` и `SceneGraph.md` обновлены.

## [0.1.0] — 2026-10-23

### Initial Release
- Полная реализация 4 глав игры.
- 19 сцен с полной текстовой реализацией.
- Система заметок через выделение текста.
- Система обвинения с оценкой по таблице истин.
- 4 концовки (Закон, Справедливость, Молчание, Провал).
- Процедурный звук через Web Audio API (9 мелодий).
- UI с Lucide иконками.
- Сохранение/загрузка через localStorage.
