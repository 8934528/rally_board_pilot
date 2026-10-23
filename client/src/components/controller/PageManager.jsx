import {
  BOARD_PAGE_LIST
} from '../../constants/pages';

function PageManager({
  activePage,
  onChange
}) {
  return (
    <div className="page-manager">

      {BOARD_PAGE_LIST.map(
        (page) => (
          <button
            type="button"
            key={page.id}
            className={
              activePage === page.id
                ? 'sidebar-button active'
                : 'sidebar-button'
            }
            onClick={() =>
              onChange(page.id)
            }
          >
            <span>{page.icon}</span>

            {page.label}
          </button>
        )
      )}

    </div>
  );
}

export default PageManager;
