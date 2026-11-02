import { useEffect } from 'react';
import { useDemo } from '@/app/DemoContext';

/**
 * Registers the presenter keyboard shortcut:
 *  P -> show / hide presenter controls
 */
export function useKeyboardShortcuts() {
  const { togglePresenter } = useDemo();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'p':
          togglePresenter();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    togglePresenter,
  ]);
}
