import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcutsMap = {}, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      const target = event.target;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

      if (isInput) return;

      const key = event.key.toLowerCase();

      if (typeof shortcutsMap[key] === 'function') {
        event.preventDefault();
        shortcutsMap[key](event);
      } else if (event.code === 'Space' && typeof shortcutsMap['space'] === 'function') {
        event.preventDefault();
        shortcutsMap['space'](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutsMap, enabled]);
}
