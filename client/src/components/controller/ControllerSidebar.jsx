import PageManager from './PageManager';

function ControllerSidebar({
  activePage,
  status,
  onPageChange,
  onStatusChange
}) {
  return (
    <aside className="controller-sidebar">

      <div className="sidebar-section">

        <div className="sidebar-heading">
          BOARD
        </div>

        <PageManager
          activePage={activePage}
          onChange={onPageChange}
        />

      </div>

      <div className="sidebar-section">

        <div className="sidebar-heading">
          GAME STATUS
        </div>

        {[
          'READY',
          'LIVE',
          'PAUSED',
          'FINISHED'
        ].map((item) => (
          <button
            key={item}
            type="button"
            className={`status-control ${
              item.toLowerCase()
            }`}
            onClick={() =>
              onStatusChange(item)
            }
          >
            {item}
          </button>
        ))}

      </div>

    </aside>
  );
}

export default ControllerSidebar;
