import { useState, useRef, useCallback } from 'react';
import IconButton from './IconButton';

function RotaryWheel({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  label = 'Round'
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const startValue = useRef(value);

  const increment = useCallback(() => {
    if (value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange]);

  const decrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      increment();
    } else if (e.deltaY > 0) {
      decrement();
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    startValue.current = value;

    const handleMouseMove = (moveEvent) => {
      const deltaY = dragStartY.current - moveEvent.clientY;
      const stepChange = Math.round(deltaY / 15);
      const nextVal = Math.min(max, Math.max(min, startValue.current + stepChange));
      onChange(nextVal);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Rotation angle for dial visual tick 
  const dialRotation = (value * 28) % 360;

  return (
    <div className="rotary-wheel-container" role="group" aria-label={label}>
      <IconButton
        icon="dash"
        label="Decrease round"
        tooltip="Decrease round"
        size="small"
        onClick={decrement}
        disabled={value <= min}
        className="rotary-stepper-btn"
      />

      <div
        className={`rotary-dial ${isDragging ? 'dragging' : ''}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        title="Scroll or drag up/down to adjust round"
        tabIndex={0}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label="Round number dial"
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            e.preventDefault();
            increment();
          } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            e.preventDefault();
            decrement();
          }
        }}
      >
        <div
          className="rotary-dial-ring"
          style={{ transform: `rotate(${dialRotation}deg)` }}
        >
          <div className="rotary-notch" />
          <div className="rotary-ticks">
            <span className="tick t1" />
            <span className="tick t2" />
            <span className="tick t3" />
            <span className="tick t4" />
          </div>
        </div>

        <div className="rotary-dial-center">
          <span className="rotary-value">{value}</span>
        </div>
      </div>

      <IconButton
        icon="plus"
        label="Increase round"
        tooltip="Increase round"
        size="small"
        onClick={increment}
        disabled={value >= max}
        className="rotary-stepper-btn"
      />
    </div>
  );
}

export default RotaryWheel;
