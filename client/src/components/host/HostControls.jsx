import Tooltip from '../common/Tooltip';
import { useGame } from '../../context/GameContext';

function HostControls({
  onLive,
  onPause,
  onPage,
  status,
  activePage
}) {
  const { hasHostPermission } = useGame();

  if (!hasHostPermission('status')) {
    return null;
  }

  const isLive = status === 'LIVE';
  const isPaused = status === 'PAUSED';
  const isScoreboard = activePage === 'scoreboard';

  return (
    <div
      className="host-controls"
      role="group"
      aria-label="Host primary game controls"
    >
      <Tooltip content="Go Live (CTRL + L)">
        <span>
          <button
            type="button"
            className={`rbp-icon-btn rbp-icon-btn-small ${
              isLive ? 'rbp-button-success active-live' : 'rbp-button-secondary'
            }`}
            onClick={onLive}
            id="btn-host-live"
            aria-label="Go Live"
            aria-pressed={isLive}
          >
            <i className="bi bi-broadcast" aria-hidden="true" />
          </button>
        </span>
      </Tooltip>

      <Tooltip content="Pause (CTRL + P)">
        <span>
          <button
            type="button"
            className={`rbp-icon-btn rbp-icon-btn-small ${
              isPaused ? 'rbp-button-warning active-pause' : 'rbp-button-secondary'
            }`}
            onClick={onPause}
            id="btn-host-pause"
            aria-label="Pause"
            aria-pressed={isPaused}
          >
            <i className="bi bi-pause-circle-fill" aria-hidden="true" />
          </button>
        </span>
      </Tooltip>

      <Tooltip content="Scoreboard">
        <span>
          <button
            type="button"
            className={`rbp-icon-btn rbp-icon-btn-small ${
              isScoreboard ? 'rbp-button-primary active-scoreboard' : 'rbp-button-secondary'
            }`}
            onClick={() => onPage('scoreboard')}
            id="btn-host-show-scoreboard"
            aria-label="Show Scoreboard"
            aria-pressed={isScoreboard}
          >
            <i className="bi bi-trophy" aria-hidden="true" />
          </button>
        </span>
      </Tooltip>
    </div>
  );
}

export default HostControls;
