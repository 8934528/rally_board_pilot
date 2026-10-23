function AnnouncementPage({ gameState }) {
  return (
    <section className="board-special-page announcement-page">

      <div className="special-eyebrow">
        ANNOUNCEMENT
      </div>

      <h1>
        {gameState.announcement.title ||
          'ATTENTION'}
      </h1>

      <p>
        {gameState.announcement.text}
      </p>

    </section>
  );
}

export default AnnouncementPage;
