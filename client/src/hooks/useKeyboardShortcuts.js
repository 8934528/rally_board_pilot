import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcutsMap = {}, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      const target = event.target;
      const isInput = target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

      if (isInput) return;

      const hasCtrl = event.ctrlKey || event.metaKey;
      const key = event.key ? event.key.toLowerCase() : '';
      const code = event.code ? event.code.toLowerCase() : '';

      if (!hasCtrl) {
        return; 
      }

      // Check if a handler exists for key combination
      let handler = null;
      if (typeof shortcutsMap[key] === 'function') {
        handler = shortcutsMap[key];
      } else if (typeof shortcutsMap[`ctrl+${key}`] === 'function') {
        handler = shortcutsMap[`ctrl+${key}`];
      } else if (code === 'space' && (typeof shortcutsMap['space'] === 'function' || typeof shortcutsMap['ctrl+space'] === 'function')) {
        handler = shortcutsMap['space'] || shortcutsMap['ctrl+space'];
      }

      if (typeof handler === 'function') {
        event.preventDefault();
        event.stopPropagation();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutsMap, enabled]);
}
