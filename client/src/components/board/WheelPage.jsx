import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { audioManager } from '../../audio/audioManager';

const SEGMENT_COLORS = [
  '#FF4D6D',
  '#4D7CFE',
  '#31E981',
  '#FBBF24',
  '#A78BFA',
  '#F97316',
  '#06B6D4',
  '#EC4899',
  '#10B981',
  '#6366F1',
  '#E11D48',
  '#8B5CF6'
];

function WheelPage({ gameState, mini = false, showResultModal = true }) {
  const entries = gameState?.wheel?.entries || [];
  const spinning = gameState?.wheel?.spinning;
  const result = gameState?.wheel?.result;
  const winnerIndex = gameState?.wheel?.winnerIndex;

  const [resultModalOpen, setResultModalOpen] = useState(false);

  useEffect(() => {
    if (spinning && !mini) {
      audioManager.playWheelSpinSequence(3200);
    } else if (!spinning && !mini) {
    }
  }, [spinning, mini]);

  useEffect(() => {
    if (result && !spinning) {
      setResultModalOpen(true);
      const timer = setTimeout(() => {
        setResultModalOpen(false);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setResultModalOpen(false);
    }
  }, [result, spinning]);

  const count = Math.max(entries.length, 1);
  const segmentAngle = 360 / count;

  const gradientStops = entries.map((_, i) => {
    const col = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
    const start = (i / count) * 360;
    const end = ((i + 1) / count) * 360;
    return `${col} ${start}deg ${end}deg`;
  }).join(', ');

  let targetAngle = 0;
  if (winnerIndex !== null && winnerIndex !== undefined && count > 0) {
    const segmentCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    targetAngle = 1440 + (360 - segmentCenter);
  } else if (spinning) {
    targetAngle = 1800;
  }

  const wheelStyle = {
    background: gradientStops ? `conic-gradient(${gradientStops})` : undefined,
    transform: spinning || winnerIndex !== null ? `rotate(${targetAngle}deg)` : 'rotate(0deg)',
    transition: spinning ? 'transform 3.2s cubic-bezier(0.12, 0.8, 0.2, 1)' : 'none'
  };

  return (
    <div className={`board-wheel-screen ${mini ? 'mini-wheel-mode' : ''}`} id="board-wheel-screen">
      <div className="wheel-pointer-container" aria-hidden="true">
        <div className="wheel-pointer-arrow" />
      </div>

      <div className="wheel-stage-container">
        <div
          className={`board-wheel ${spinning ? 'is-spinning' : ''}`}
          style={wheelStyle}
          role="img"
          aria-label="Game prize wheel"
        >
          {entries.map((entry, index) => {
            const rot = index * segmentAngle + segmentAngle / 2;
            return (
              <div
                key={`${entry}-${index}`}
                className="wheel-slice-label"
                style={{
                  transform: `rotate(${rot}deg)`
                }}
              >
                <span className="slice-text">{entry}</span>
              </div>
            );
          })}

          <div className="board-wheel-hub">
            <span className="hub-text">{spinning ? 'SPINNING' : 'RALLY'}</span>
          </div>
        </div>
      </div>

      {!mini && showResultModal && (
        <Modal
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          title="WHEEL RESULT"
          size="medium"
        >
          <div className="wheel-result-modal-body">
            <div className="result-banner-label">SELECTED OUTCOME</div>
            <div className="result-highlight-text">{result}</div>
            <button
              type="button"
              className="rbp-button rbp-button-primary mt-3"
              onClick={() => setResultModalOpen(false)}
            >
              DISMISS
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default WheelPage;
