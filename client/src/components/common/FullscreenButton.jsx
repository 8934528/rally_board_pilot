import { useState } from 'react';

import Button from './Button';

function FullscreenButton() {
  const [fullscreen, setFullscreen] =
    useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();

        setFullscreen(true);
      } else {
        await document.exitFullscreen();

        setFullscreen(false);
      }
    } catch {
      setFullscreen(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleFullscreen}>
      {fullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
    </Button>
  );
}

export default FullscreenButton;
