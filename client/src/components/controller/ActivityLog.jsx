function ActivityLog({
  activities = []
}) {
  return (
    <section className="activity-log">

      <div className="section-title">
        ACTIVITY
      </div>

      {activities.length === 0 ? (
        <div className="activity-empty">
          No actions yet.
        </div>
      ) : (
        activities.map(
          (item) => (
            <div
              className="activity-item"
              key={item.id}
            >
              <span>
                {item.message}
              </span>

              <small>
                {item.time}
              </small>
            </div>
          )
        )
      )}

    </section>
  );
}

export default ActivityLog;
