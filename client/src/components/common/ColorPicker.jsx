import { useState, useEffect } from 'react';

const PRESET_COLORS = [
  '#FF4D6D', // Crimson pink
  '#4D7CFE', // Electric blue
  '#31E981', // Emerald green
  '#FBBF24', // Amber gold
  '#A78BFA', // Violet
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#EC4899'  // Fuchsia
];

function ColorPicker({
  value,
  onChange,
  label = 'Color'
}) {
  const [hex, setHex] = useState(value || '#4D7CFE');

  useEffect(() => {
    if (value) {
      setHex(value);
    }
  }, [value]);

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChange(val);
    }
  };

  const handlePresetSelect = (c) => {
    setHex(c);
    onChange(c);
  };

  const handleNativeChange = (e) => {
    const val = e.target.value;
    setHex(val);
    onChange(val);
  };

  return (
    <div className="rbp-color-picker" role="group" aria-label={label}>
      <div className="color-swatches-row">
        {PRESET_COLORS.map((c) => {
          const isSelected = hex.toUpperCase() === c.toUpperCase();
          return (
            <button
              key={c}
              type="button"
              className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => handlePresetSelect(c)}
              aria-label={`Select color ${c}`}
              aria-pressed={isSelected}
            >
              {isSelected && <i className="bi bi-check" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="color-input-controls">
        <label className="color-preview-trigger" title="Pick custom color">
          <input
            type="color"
            value={hex}
            onChange={handleNativeChange}
            className="visually-hidden-color-input"
            aria-label="Custom color picker"
          />
          <span
            className="color-preview-box"
            style={{ backgroundColor: hex }}
          />
        </label>

        <input
          type="text"
          value={hex}
          onChange={handleHexChange}
          maxLength={7}
          className="color-hex-input"
          placeholder="#000000"
          aria-label="Hex color value"
        />
      </div>
    </div>
  );
}

export default ColorPicker;
