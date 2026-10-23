import { formatTime } from '../../utils/formatScore';

function TimerPage({ gameState }) {
  return (
    <section
      className={`board-special-page timer-page ${
        gameState.timer.running
          ? 'timer-running'
          : ''
      }`}
    >
      <div className="special-eyebrow">
        TIME REMAINING
      </div>

      <div className="timer-value">
        {formatTime(
          gameState.timer.seconds
        )}
      </div>

      <div className="timer-state">
        {gameState.timer.running
          ? 'GO'
          : 'READY'}
      </div>
    </section>
  );
}

export default TimerPage;
