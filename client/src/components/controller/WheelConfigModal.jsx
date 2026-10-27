import { useState, useMemo, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { DEFAULT_WHEEL_TEXTS, arrangeWheelEntries } from '../../utils/wheelConfig';

function WheelConfigModal({
  open,
  onClose,
  currentEntries = [],
  onSave
}) {
  
  const initialCustoms = useMemo(() => {
    if (!currentEntries || currentEntries.length === 0) return [];
    return currentEntries.filter(
      (entry) => !DEFAULT_WHEEL_TEXTS.includes(entry)
    );
  }, [currentEntries]);

  const [customTexts, setCustomTexts] = useState(initialCustoms);
  const [inputText, setInputText] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (open) {
      setCustomTexts(initialCustoms);
      setInputText('');
      setInputError('');
    }
  }, [open, initialCustoms]);

  const arrangedEntries = useMemo(() => {
    return arrangeWheelEntries(DEFAULT_WHEEL_TEXTS, customTexts);
  }, [customTexts]);

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) {
      setInputError('Please enter a valid text option');
      return;
    }
    if (trimmed.length > 30) {
      setInputError('Option must be 30 characters or fewer');
      return;
    }

    setCustomTexts((prev) => [...prev, trimmed]);
    setInputText('');
    setInputError('');
  };

  const handleRemoveCustom = (index) => {
    setCustomTexts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(arrangedEntries);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="CONFIGURE WHEEL OPTIONS"
      size="wheel"
    >
      <div className="wheel-config-modal-content">



        <div className="wheel-config-row-two-col">

          <div className="wheel-config-section">
            <div className="wheel-section-header">
              <span className="wheel-section-title">DEFAULT GAME TEXTS</span>
              <span className="wheel-section-badge">Required ({DEFAULT_WHEEL_TEXTS.length})</span>
            </div>
            <p className="wheel-section-desc">
              These default options are always included
            </p>
            <div className="wheel-chips-grid">
              {DEFAULT_WHEEL_TEXTS.map((text, idx) => (
                <div key={idx} className="wheel-chip default-chip">
                  <i className="bi bi-shield-check" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="wheel-config-section">
            <div className="wheel-section-header">
              <span className="wheel-section-title">CURRENT WHEEL PREVIEW</span>
              <span className="wheel-section-badge-secondary">
                Total Slices: {arrangedEntries.length}
              </span>
            </div>
            <p className="wheel-section-desc">
              Review the final wheel sequence below
            </p>

            <div className="wheel-preview-chips">
              {arrangedEntries.map((entry, index) => {
                const isDefault = DEFAULT_WHEEL_TEXTS.includes(entry);
                return (
                  <div
                    key={`${entry}-${index}`}
                    className={`wheel-preview-chip ${isDefault ? 'is-default' : 'is-custom'}`}
                  >
                    <span className="slice-index-badge">{index + 1}</span>
                    <span className="slice-text-preview">{entry}</span>
                    <span className="slice-type-tag">{isDefault ? 'Default' : 'Custom'}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="wheel-config-section wheel-custom-add-section">
          <div className="wheel-section-header">
            <span className="wheel-section-title">ADD CUSTOM TEXT</span>
          </div>
          <p className="wheel-section-desc">
            Add your own custom wheel options. Click <strong>Add</strong> to preview them in the wheel sequence before saving.
          </p>

          <form onSubmit={handleAdd} className="wheel-add-form">
            <div className="wheel-input-wrapper">
              <input
                type="text"
                className="wheel-text-input"
                placeholder="Type custom wheel text (e.g. Mystery Prize, Double Trouble)..."
                value={inputText}
                maxLength={30}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (inputError) setInputError('');
                }}
                aria-label="Custom wheel text"
                id="input-custom-wheel-text"
              />
              {inputError && <span className="wheel-input-error">{inputError}</span>}
            </div>
            <Button
              variant="primary"
              size="small"
              type="submit"
              id="btn-add-wheel-text"
            >
              <i className="bi bi-plus-lg" aria-hidden="true" />
              <span>Add</span>
            </Button>
          </form>

          {customTexts.length > 0 && (
            <div className="wheel-custom-list">
              <span className="wheel-custom-list-label">
                Custom texts added ({customTexts.length}) - <em>not yet saved</em>:
              </span>
              <div className="wheel-chips-grid">
                {customTexts.map((text, idx) => (
                  <div key={idx} className="wheel-chip custom-chip">
                    <i className="bi bi-tag" aria-hidden="true" />
                    <span>{text}</span>
                    <button
                      type="button"
                      className="wheel-chip-remove"
                      onClick={() => handleRemoveCustom(idx)}
                      title={`Remove "${text}"`}
                      aria-label={`Remove ${text}`}
                    >
                      <i className="bi bi-x" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="wheel-modal-footer">
          <Button
            variant="secondary"
            size="medium"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="medium"
            onClick={handleSave}
            id="btn-save-wheel-options"
          >
            <i className="bi bi-check2-circle" aria-hidden="true" />
            <span>Save Wheel Options</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default WheelConfigModal;
