import { useFullscreen } from '../../hooks/useFullscreen';
import IconButton from './IconButton';

function FullscreenButton({ variant = 'ghost', size = 'small', className = '' }) {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <IconButton
      icon={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
      label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      variant={variant}
      size={size}
      className={`fullscreen-toggle-btn ${className}`}
      onClick={toggleFullscreen}
    />
  );
}

export default FullscreenButton;
