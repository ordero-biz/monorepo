export type ViewportBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

const createBreakpointStore = (breakpoint: ViewportBreakpoint) => {
  let mediaQuery: MediaQueryList | undefined;
  const subscribers = new Set<() => void>();

  const getMediaQuery = () => {
    if (mediaQuery || !window.matchMedia) {
      return mediaQuery;
    }

    const width = getComputedStyle(document.documentElement)
      .getPropertyValue(`--breakpoint-${breakpoint}`)
      .trim();

    if (width) {
      mediaQuery = window.matchMedia(`(width < ${width})`);
    }

    return mediaQuery;
  };

  const notifySubscribers = () => {
    for (const onChange of subscribers) {
      onChange();
    }
  };

  return {
    subscribe: (onChange: () => void) => {
      if (subscribers.size === 0) {
        getMediaQuery()?.addEventListener('change', notifySubscribers);
      }
      subscribers.add(onChange);

      return () => {
        subscribers.delete(onChange);
        if (subscribers.size === 0) {
          mediaQuery?.removeEventListener('change', notifySubscribers);
          mediaQuery = undefined;
        }
      };
    },
    getSnapshot: () => getMediaQuery()?.matches ?? false,
  };
};

export const viewportBreakpointStores = {
  sm: createBreakpointStore('sm'),
  md: createBreakpointStore('md'),
  lg: createBreakpointStore('lg'),
  xl: createBreakpointStore('xl'),
} satisfies Record<
  ViewportBreakpoint,
  ReturnType<typeof createBreakpointStore>
>;
