import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const PERMISSION_DEFINITIONS = [
  {
    key: 'score',
    label: 'Score Adjustments',
    icon: 'bi-trophy',
    description: 'Allow Host to add and subtract team scores'
  },
  {
    key: 'round',
    label: 'Round Progression',
    icon: 'bi-chevron-right',
    description: 'Allow Host to advance to the next round'
  },
  {
    key: 'status',
    label: 'Status & Page Views',
    icon: 'bi-broadcast',
    description: 'Allow Host to set Live / Paused status and switch board views'
  },
  {
    key: 'timer',
    label: 'Game Clock Control',
    icon: 'bi-stopwatch',
    description: 'Allow Host to start, pause, reset, and adjust timer'
  },
  {
    key: 'wheel',
    label: 'Wheel Spin',
    icon: 'bi-arrow-repeat',
    description: 'Allow Host to spin the prize wheel'
  },
  {
    key: 'team',
    label: 'Team Settings',
    icon: 'bi-people',
    description: 'Allow Host to rename teams or change team colors'
  },
  {
    key: 'theme',
    label: 'Theme Selection',
    icon: 'bi-palette',
    description: 'Allow Host to edit board theme gradients'
  },
  {
    key: 'announcement',
    label: 'Announcements',
    icon: 'bi-megaphone',
    description: 'Allow Host to publish banner announcements'
  },
  {
    key: 'winner',
    label: 'Winner Declaration',
    icon: 'bi-award',
    description: 'Allow Host to declare game winner'
  },
  {
    key: 'reset',
    label: 'Reset Game',
    icon: 'bi-arrow-counterclockwise',
    description: 'Allow Host to perform full game reset'
  },
  {
    key: 'wheelConfig',
    label: 'Wheel Configuration',
    icon: 'bi-pie-chart',
    description: 'Allow Host to modify wheel slices and entries'
  },
  {
    key: 'questions',
    label: 'Question Management',
    icon: 'bi-question-circle',
    description: 'Allow Host to select, display, reveal and mark questions'
  }
];

function HostPermissionsModal({
  open,
  onClose,
  permissions = {},
  onUpdate
}) {
  const [localPerms, setLocalPerms] = useState(permissions);

  useEffect(() => {
    if (open) {
      setLocalPerms(permissions || {});
    }
  }, [open, permissions]);

  const handleToggle = (key) => {
    const updated = {
      ...localPerms,
      [key]: !localPerms[key]
    };
    setLocalPerms(updated);
    onUpdate(updated);
  };

  const handleEnableAll = () => {
    const all = {};
    PERMISSION_DEFINITIONS.forEach((p) => {
      all[p.key] = true;
    });
    setLocalPerms(all);
    onUpdate(all);
  };

  const handleResetDefaults = () => {
    const defaults = {
      score: true,
      round: true,
      status: true,
      timer: true,
      wheel: true,
      team: false,
      theme: false,
      announcement: false,
      winner: false,
      reset: false,
      wheelConfig: false,
      questions: false
    };
    setLocalPerms(defaults);
    onUpdate(defaults);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="HOST ROLE PERMISSION MANAGEMENT"
      size="large"
    >
      <div className="permissions-modal-container">
        <div className="permissions-modal-header-desc">
          <p>
            Configure what actions the <strong>Host</strong> console is allowed to execute.
            The server strictly validates these permissions for every incoming socket event.
          </p>

          <div className="permissions-preset-actions">
            <button
              type="button"
              className="btn-link-action"
              onClick={handleResetDefaults}
              id="btn-perms-defaults"
            >
              <i className="bi bi-arrow-counterclockwise" /> Reset to Defaults
            </button>
            <button
              type="button"
              className="btn-link-action"
              onClick={handleEnableAll}
              id="btn-perms-enable-all"
            >
              <i className="bi bi-check-all" /> Enable All
            </button>
          </div>
        </div>

        <div className="permissions-grid">
          {PERMISSION_DEFINITIONS.map((def) => {
            const isGranted = Boolean(localPerms[def.key]);
            return (
              <div
                key={def.key}
                className={`permission-card ${isGranted ? 'is-granted' : 'is-denied'}`}
                id={`perm-card-${def.key}`}
                onClick={() => handleToggle(def.key)}
              >
                <div className="perm-card-icon">
                  <i className={`bi ${def.icon}`} aria-hidden="true" />
                </div>

                <div className="perm-card-content">
                  <div className="perm-card-title-row">
                    <span className="perm-card-title">{def.label}</span>
                    <span className={`perm-card-badge ${isGranted ? 'badge-granted' : 'badge-denied'}`}>
                      {isGranted ? 'GRANTED' : 'RESTRICTED'}
                    </span>
                  </div>
                  <p className="perm-card-desc">{def.description}</p>
                </div>

                <div className="perm-card-toggle">
                  <input
                    type="checkbox"
                    checked={isGranted}
                    onChange={() => handleToggle(def.key)}
                    id={`toggle-perm-${def.key}`}
                    aria-label={`Toggle ${def.label} permission`}
                  />
                  <span className="perm-toggle-slider" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="permissions-modal-footer">
          <Button
            variant="primary"
            size="medium"
            onClick={onClose}
            id="btn-close-permissions"
          >
            <i className="bi bi-check2" />
            <span>Done</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default HostPermissionsModal;
