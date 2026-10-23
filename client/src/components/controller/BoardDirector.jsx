function BoardDirector({
  activePage,
  status
}) {
  return (
    <div className="board-director">

      <div className="director-live">
        <span className="director-dot" />
        ON AIR
      </div>

      <div className="director-page">
        {activePage.toUpperCase()}
      </div>

      <div className="director-status">
        {status}
      </div>

    </div>
  );
}

export default BoardDirector;
