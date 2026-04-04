import { useEffect, useCallback } from 'react';

/**
 * Hook to handle keyboard shortcuts.
 * @param {string[]} keys - Array of keys to trigger on (e.g. ['Control', 'k'] or ['Meta', 'k']). Order doesn't matter, but all must be pressed.
 * @param {Function} callback - Function to call when shortcut is triggered.
 */
export default function useShortcut(keys, callback) {
  const handleKeyDown = useCallback(
    (event) => {
      // Create a set of pressed keys based on the event
      const pressedKeys = new Set();
      if (event.ctrlKey) pressedKeys.add('Control');
      if (event.metaKey) pressedKeys.add('Meta');
      if (event.shiftKey) pressedKeys.add('Shift');
      if (event.altKey) pressedKeys.add('Alt');
      
      // Add the actual key pressed, ignoring modifiers if they are the only ones
      if (!['Control', 'Meta', 'Shift', 'Alt'].includes(event.key)) {
        pressedKeys.add(event.key.toLowerCase());
      }

      // Check if ALL required keys are pressed
      const isMatch = keys.every((key) => {
        if (key.toLowerCase() === 'ctrl' || key.toLowerCase() === 'control') {
          return pressedKeys.has('Control') || pressedKeys.has('Meta'); // map cmd/ctrl to same intent
        }
        return pressedKeys.has(key.toLowerCase());
      });

      if (isMatch) {
        event.preventDefault();
        callback();
      }
    },
    [keys, callback]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
