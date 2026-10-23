# Architectural Decision Records

## ADR-019. Процедурный звук через Web Audio API

**Дата:** 2026-10-23  
**Статус:** Принято

**Контекст.** ADR-012 зафиксировал MVP без звука (нет аудиофайлов, `audio.ts` — заглушка). PO хочет атмосферный звук, но без генерации и хранения mp3. Qwen Coder умеет писать код для Web Audio API.

**Решение.**
- Звук синтезируется процедурно в браузере через Web Audio API (`src/services/audio/*`).
- Никаких mp3/webp-аудиофайлов в MVP. `ASSETS.audio` (пути `.mp3`) остаётся зарезервированным для будущего, но не используется.
- Публичное API — `audio.playPreset(id)` (см. `types.ts`).
- Пресеты: `silence`, `menu_theme`, `summary_theme`, `train_ambient`, `night_corridor`, `tension`, `death_sting`, `accusation_theme`, `finale_theme`.
- Маппинг «экран/сцена → пресет» — `sceneMap.ts`, функция `getPresetForScreen(screen, sceneId)`.
- `AudioContext` создаётся только по user gesture (autoplay policy): `audio.init()` вызывается из `AudioController` на первом `pointerdown`/`keydown`.
- Громкость и mute хранятся в `localStorage` (`mfe_audio_volume`, `mfe_audio_muted`), не в `SaveState`.
- Звук можно полностью отключить: `audio.setMuted(true)`.

**Последствия.**
- ADR-012 частично заменяется: «нет фиксированных аудиофайлов» — верно, «нет звука» — больше нет.
- `engine/*` не знает о звуке. React-интеграция — отдельный слой (`AudioController` в `src/screens/`, P-Audio-2).
- Для аудиофилов качество ниже студийного mp3 — приемлемо для атмосферного MVP.

---
