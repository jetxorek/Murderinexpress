import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { audio, getPresetForScreen } from '../services/audio';

/**
 * Хук для управления аудио в зависимости от состояния игры.
 * Подписывается на изменения screen и currentSceneId,
 * вызывает audio.playPreset() при смене.
 */
export function useAudioController(): void {
  const screen = useGameStore((s) => s.screen);
  const currentSceneId = useGameStore((s) => s.currentSceneId);
  const initializedRef = useRef(false);

  // Инициализация AudioContext по первому user gesture
  useEffect(() => {
    if (initializedRef.current) return;

    const handleFirstInteraction = () => {
      // Инициализируем контекст (если ещё не создан)
      audio.init();
      initializedRef.current = true;

      // Небольшая задержка, чтобы контекст перешёл в состояние running
      setTimeout(() => {
        const currentScreen = useGameStore.getState().screen;
        const currentSceneId = useGameStore.getState().currentSceneId;
        if (currentScreen !== 'notebook' && audio.isInitialized()) {
          const presetId = getPresetForScreen(currentScreen, currentSceneId);
          audio.playPreset(presetId);
        }
      }, 100);

      // Удаляем обработчики после первой инициализации
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Воспроизведение пресета при смене экрана/сцены
  useEffect(() => {
    if (!audio.isInitialized()) return;

    // Не меняем ambient при открытии блокнота
    if (screen === 'notebook') return;

    const presetId = getPresetForScreen(screen, currentSceneId);
    audio.playPreset(presetId);
  }, [screen, currentSceneId]);
}
