import Button from '../common/Button';
import { BoardPreviewFrame } from './BoardPreview';
import { BOARD_PAGES } from '../../constants/pages';

const MAX_ANNOUNCEMENT_LENGTH = 280;

function AnnouncementControl({
  gameState,
  draftText,
  onDraftChange,
  isOnBoard,
  onToggle
}) {
  const trimmedText = draftText.trim();
  const hasText = trimmedText.length > 0;
  const canToggle = isOnBoard || hasText;

  const previewGame = {
    ...gameState,
    announcement: {
      title: gameState.announcement.title || '',
      text: trimmedText,
      visible: true
    }
  };

  return (
    <div className="ann" id="announcement-monitor">
      <div className="ann-toolbar">
        <span className={`ann-status ${isOnBoard ? 'is-live' : ''}`}>
          <span className="ann-status-dot" aria-hidden="true" />
          {isOnBoard ? 'ON BOARD' : 'OFF BOARD'}
        </span>

        <span className="ann-count">
          {draftText.length} / {MAX_ANNOUNCEMENT_LENGTH}
        </span>
      </div>

      <div className="ann-layout">
        <div className="ann-preview" id="announcement-preview-row">
          <span className="ann-label">PREVIEW</span>

          <div className="ann-preview-frame">
            {hasText ? (
              <BoardPreviewFrame
                gameState={previewGame}
                page={BOARD_PAGES.ANNOUNCEMENT}
              />
            ) : (
              <div className="ann-empty">
                <i className="bi bi-megaphone" aria-hidden="true" />
                <p>Nothing to preview yet. Type an announcement to see it here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="ann-composer" id="announcement-input-row">
          <label htmlFor="announcement-input" className="ann-label">
            ANNOUNCEMENT TEXT
          </label>

          <textarea
            id="announcement-input"
            className="ann-input"
            value={draftText}
            rows={5}
            maxLength={MAX_ANNOUNCEMENT_LENGTH}
            placeholder="Type announcement here..."
            onChange={(event) => onDraftChange(event.target.value)}
          />


          <div className="ann-actions">
            <Button
              id="btn-announcement-toggle"
              variant={isOnBoard ? 'danger' : 'primary'}
              size="medium"
              disabled={!canToggle}
              onClick={onToggle}
            >
              <i
                className={`bi ${isOnBoard ? 'bi-eye-slash' : 'bi-megaphone'}`}
                aria-hidden="true"
              />
              <span>{isOnBoard ? 'HIDE FROM BOARD' : 'SHOW ON BOARD'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementControl;
