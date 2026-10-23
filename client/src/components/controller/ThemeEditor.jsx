import {
  defaultThemes
} from '../../data/defaultThemes';

function ThemeEditor({
  currentTheme,
  onChange
}) {
  return (
    <section className="theme-editor">

      <div className="section-title">
        BOARD THEME
      </div>

      <div className="theme-grid">

        {defaultThemes.map(
          (theme) => (
            <button
              type="button"
              key={theme.id}
              className={
                currentTheme.primary ===
                theme.primary
                  ? 'theme-option active'
                  : 'theme-option'
              }
              style={{
                background:
                  `linear-gradient(${theme.direction}, ${theme.primary}, ${theme.secondary})`
              }}
              onClick={() =>
                onChange(theme)
              }
            >
              {theme.name}
            </button>
          )
        )}

      </div>

    </section>
  );
}

export default ThemeEditor;
