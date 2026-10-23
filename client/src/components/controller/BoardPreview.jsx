function BoardPreview({
  gameState
}) {
  return (
    <div className="board-preview">

      <div className="preview-header">
        LIVE BOARD PREVIEW
      </div>

      <div className="preview-screen">

        <div className="preview-round">
          ROUND {gameState.round.number}
        </div>

        <div className="preview-teams">

          <div>
            <strong>
              {gameState.teams.A.name}
            </strong>

            <span>
              {gameState.teams.A.score}
            </span>
          </div>

          <b>VS</b>

          <div>
            <strong>
              {gameState.teams.B.name}
            </strong>

            <span>
              {gameState.teams.B.score}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default BoardPreview;
