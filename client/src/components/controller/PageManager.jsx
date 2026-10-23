import { BOARD_PAGE_LIST } from '../../constants/pages';

function PageManager({ activePage, onChange }) {
  return (
    <div className="page-manager" role="group" aria-label="Board Page Selection">
      {BOARD_PAGE_LIST.map((page) => {
        const isActive = activePage === page.id;
        return (
          <button
            type="button"
            key={page.id}
            id={`btn-page-${page.id}`}
            className={`sidebar-button ${isActive ? 'active' : ''}`}
            onClick={() => onChange(page.id)}
            aria-pressed={isActive}
          >
            <i className={`bi ${page.icon || 'bi-circle'}`} aria-hidden="true" />
            <span className="sidebar-btn-label">{page.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default PageManager;
