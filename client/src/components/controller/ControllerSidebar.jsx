import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageManager from './PageManager';

const STATUS_OPTIONS = [
  { id: 'READY', label: 'READY', icon: 'check-circle' },
  { id: 'LIVE', label: 'LIVE', icon: 'broadcast' },
  { id: 'PAUSED', label: 'PAUSED', icon: 'pause-circle' },
  { id: 'FINISHED', label: 'FINISHED', icon: 'flag' }
];

function ControllerSidebar({
  activePage,
  status,
  timerSeconds,
  isTimerRunning,
  onPageChange,
  onStatusChange,
  onOpenTimerModal,
  onOpenThemeModal,
  onOpenPermissionsModal,
  onOpenQuestionModal,
  onOpenStatsModal
}) {
  return (
    <aside className="controller-sidebar" id="controller-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-heading">BOARD VIEW</div>
        <PageManager activePage={activePage} onChange={onPageChange} />
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">GAME STATUS</div>
        <div className="status-controls-list" role="group" aria-label="Game Status Control">
          {STATUS_OPTIONS.map((item) => {
            const isActive = status === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-status-${item.id.toLowerCase()}`}
                type="button"
                className={`status-control-btn ${isActive ? 'active' : ''} status-${item.id.toLowerCase()}`}
                onClick={() => onStatusChange(item.id)}
                aria-pressed={isActive}
              >
                <span className={`status-indicator-dot ${isActive ? 'dot-active' : ''}`} />
                <span className="status-btn-text">{item.label}</span>
                {isActive && (
                  <span className="active-badge" title="Active">
                    <i className="bi bi-check" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading sidebar-heading--tools">Tools and Configuration</div>
        <div className="sidebar-tools-grid">
          

          <button
            type="button"
            id="btn-sidebar-permissions"
            className="sidebar-tool-grid-btn"
            onClick={onOpenPermissionsModal}
          >
            <i className="bi bi-shield-lock" />
            <span>Host Permission</span>
          </button>

          <button
            type="button"
            id="btn-sidebar-questions"
            className="sidebar-tool-grid-btn"
            onClick={onOpenQuestionModal}
          >
            <i className="bi bi-patch-question" />
            <span>Questions</span>
          </button>






          <button
            type="button"
            id="btn-sidebar-stats"
            className="sidebar-tool-grid-btn"
            onClick={onOpenStatsModal}
          >
            <i className="bi bi-graph-up" />
            <span>Game Stats</span>
          </button>

          <button
            type="button"
            id="btn-sidebar-timer"
            className="sidebar-tool-grid-btn"
            onClick={onOpenTimerModal}
          >
            <i className="bi bi-stopwatch" />
            <span>Timer Configuration</span>
          </button>

          <button
            type="button"
            id="btn-sidebar-theme"
            className="sidebar-tool-grid-btn"
            onClick={onOpenThemeModal}
          >
            <i className="bi bi-palette" />
            <span>Board Theme</span>
          </button>

          <Link
            to="/activity"
            id="link-sidebar-activity"
            className="sidebar-tool-grid-btn"
          >
            <i className="bi bi-clock-history" />
            <span>Activity Log</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default ControllerSidebar;
