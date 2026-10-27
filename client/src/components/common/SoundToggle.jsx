import { useState, useEffect } from 'react';
import Tooltip from './Tooltip';
import { audioManager } from '../../audio/audioManager';

function SoundToggle({ className = '', id = 'btn-sound-toggle' }) {
  const [muted, setMuted] = useState(audioManager.isMuted());

  useEffect(() => {
    setMuted(audioManager.isMuted());
  }, []);

  const handleToggle = () => {
    const nextMuted = audioManager.toggleMute();
    setMuted(nextMuted);
    if (!nextMuted) {
      audioManager.play('buttonClick');
    }
  };

  return (
    <Tooltip content={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}>
      <button
        type="button"
        id={id}
        className={`rbp-icon-btn rbp-icon-btn-small ${muted ? 'rbp-button-secondary opacity-75' : 'rbp-button-secondary'} ${className}`.trim()}
        onClick={handleToggle}
        aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
        aria-pressed={!muted}
      >
        <i
          className={`bi ${muted ? 'bi-volume-mute' : 'bi-volume-up'}`}
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  );
}

export default SoundToggle;
