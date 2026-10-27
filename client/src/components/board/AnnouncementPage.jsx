function AnnouncementPage({ gameState }) {
  return (
    <section className="board-special-page announcement-page">

      <div className="special-eyebrow">
        ANNOUNCEMENT
      </div>

      <h1>
        {gameState.announcement.text}
      </h1>

    </section>
  );
}

export default AnnouncementPage;
