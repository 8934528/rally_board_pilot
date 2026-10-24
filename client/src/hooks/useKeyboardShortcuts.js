import { useEffect } from 'react';

const STANDALONE_KEYS = new Set(['f', 'f11', 'escape']);

export function useKeyboardShortcuts(shortcutsMap = {}, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      const target = event.target;
      const isTypingTarget = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

      if (isTypingTarget) return;

      const key = event.key ? event.key.toLowerCase() : '';
      const code = event.code ? event.code.toLowerCase() : '';

      if (STANDALONE_KEYS.has(key)) {
        const handler = typeof shortcutsMap[key] === 'function' ? shortcutsMap[key] : code === 'escape' && typeof shortcutsMap.escape === 'function' ? shortcutsMap.escape : null;

        if (typeof handler === 'function') {
          event.preventDefault();
          event.stopPropagation();
          handler(event);
        }

        return;
      }

      if (!event.ctrlKey) return;

      
      const shiftedHandler = event.shiftKey && typeof shortcutsMap[`shift+${key}`] === 'function' ? shortcutsMap[`shift+${key}`] : null;

      const handler = shiftedHandler || (typeof shortcutsMap[key] === 'function' ? shortcutsMap[key] : typeof shortcutsMap[`ctrl+${key}`] === 'function' ? shortcutsMap[`ctrl+${key}`] : code === 'space' && typeof shortcutsMap.space === 'function' ? shortcutsMap.space : code === 'space' && typeof shortcutsMap['ctrl+space'] === 'function' ? shortcutsMap['ctrl+space'] : null);

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
