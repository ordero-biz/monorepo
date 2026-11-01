import { useEffect, useRef, useState } from 'react';

export const useTabsScroll = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    overflowing: false,
    previous: false,
    next: false,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const list = viewport?.firstElementChild;
    const row = viewport?.parentElement;

    if (!viewport || !list || !row) return;

    const update = () => {
      const position = Math.abs(viewport.scrollLeft);
      const nextState = {
        // Compare with the whole row so buttons disappear when they are no
        // longer needed, even while they still occupy space in the row.
        overflowing: list.scrollWidth > row.clientWidth + 1,
        previous: position > 1,
        next: position < viewport.scrollWidth - viewport.clientWidth - 1,
      };

      setScrollState((previous) =>
        previous.overflowing === nextState.overflowing &&
        previous.previous === nextState.previous &&
        previous.next === nextState.next
          ? previous
          : nextState
      );
    };

    const reveal = (tab: Element | null) => {
      if (!tab) return;

      const bounds = viewport.getBoundingClientRect();
      const tabBounds = tab.getBoundingClientRect();
      const delta =
        tabBounds.left < bounds.left
          ? tabBounds.left - bounds.left
          : Math.max(0, tabBounds.right - bounds.right);

      // Only scroll the tab strip; scrollIntoView can also move the page.
      if (delta) viewport.scrollBy({ left: delta, behavior: 'instant' });
    };

    const revealActive = () => {
      reveal(list.querySelector('[role="tab"][aria-selected="true"]'));
      update();
    };
    const handleFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        reveal(event.target.closest('[role="tab"]'));
      }
    };
    const resizeObserver = new ResizeObserver(revealActive);
    resizeObserver.observe(viewport);
    resizeObserver.observe(list);
    resizeObserver.observe(row);

    const mutationObserver = new MutationObserver(revealActive);
    mutationObserver.observe(list, {
      attributes: true,
      attributeFilter: ['aria-selected'],
      childList: true,
      characterData: true,
      subtree: true,
    });
    viewport.addEventListener('scroll', update, { passive: true });
    viewport.addEventListener('focusin', handleFocus);
    revealActive();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      viewport.removeEventListener('scroll', update);
      viewport.removeEventListener('focusin', handleFocus);
    };
  }, []);

  const scroll = (direction: 'previous' | 'next') => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rtl = getComputedStyle(viewport).direction === 'rtl';
    const sign = (direction === 'next' ? 1 : -1) * (rtl ? -1 : 1);
    viewport.scrollBy({
      left: sign * viewport.clientWidth * 0.8,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };

  return { viewportRef, scrollState, scroll };
};
