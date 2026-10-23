import { useState } from 'react';
import { audio } from '../../services/audio';
import { Icon } from './Icon';

/**
 * Компонент управления звуком: кнопка mute/unmute и ползунок громкости.
 */
export function AudioControls(): JSX.Element {
  const [volume, setVolume] = useState(audio.getVolume());
  const [muted, setMuted] = useState(audio.isMuted());

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    audio.setVolume(newVolume);
    setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    const newMuted = !muted;
    audio.setMuted(newMuted);
    setMuted(newMuted);
  };

  return (
    <div className="audio-controls">
      <button
        className="audio-controls__mute-btn"
        onClick={handleMuteToggle}
        aria-label={muted ? 'Включить звук' : 'Выключить звук'}
      >
        <Icon name={muted ? 'volume-x' : 'volume-2'} size={20} />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="audio-controls__slider"
        aria-label="Громкость"
      />
    </div>
  );
}
