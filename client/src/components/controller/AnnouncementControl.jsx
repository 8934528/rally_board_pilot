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
    <div className="announcement-monitor" id="announcement-monitor">
      <div className="announcement-row" id="announcement-preview-row">
        <div className="announcement-row-label">
          <span className="announcement-label">ANNOUNCEMENT PREVIEW</span>
          <span className={`announcement-state ${isOnBoard ? 'on-board' : ''}`}>
            {isOnBoard ? 'ON BOARD' : 'NOT ON BOARD'}
          </span>
        </div>

        {hasText ? (
          <BoardPreviewFrame
            gameState={previewGame}
            page={BOARD_PAGES.ANNOUNCEMENT}
          />
        ) : (
          <div className="announcement-empty">
            Nothing to preview yet. Type an announcement below.
          </div>
        )}
      </div>

      <div className="announcement-row" id="announcement-input-row">
        <label htmlFor="announcement-input" className="field-label">
          Announcement Text
        </label>

        <textarea
          id="announcement-input"
          className="announcement-input"
          value={draftText}
          rows={3}
          maxLength={MAX_ANNOUNCEMENT_LENGTH}
          placeholder="Type announcement here..."
          onChange={(event) => onDraftChange(event.target.value)}
        />

        <div className="announcement-input-actions">
          <span className="announcement-count">
            {draftText.length}/{MAX_ANNOUNCEMENT_LENGTH}
          </span>

          <Button
            id="btn-announcement-toggle"
            variant={isOnBoard ? 'danger' : 'primary'}
            size="small"
            className="announcement-toggle-btn"
            disabled={!canToggle}
            onClick={onToggle}
          >
            <i
              className={`bi ${isOnBoard ? 'bi-eye-slash' : 'bi-megaphone'}`}
              aria-hidden="true"
            />
            <span>{isOnBoard ? 'HIDE' : 'SHOW'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementControl;
