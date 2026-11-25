import { act, renderHook } from '@testing-library/react';
import {
  useBelowViewportBreakpoint,
  type ViewportBreakpoint,
} from './useBelowViewportBreakpoint';

describe('useBelowViewportBreakpoint', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--breakpoint-md');
    document.documentElement.style.removeProperty('--breakpoint-lg');
    vi.unstubAllGlobals();
  });

  it('shares one media query listener until the last consumer unmounts', () => {
    document.documentElement.style.setProperty('--breakpoint-md', '900px');
    const mediaQuery = Object.assign(new EventTarget(), { matches: false });
    const addListener = vi.spyOn(mediaQuery, 'addEventListener');
    const removeListener = vi.spyOn(mediaQuery, 'removeEventListener');
    const matchMedia = vi.fn(() => mediaQuery);
    vi.stubGlobal('matchMedia', matchMedia);

    const first = renderHook(() => useBelowViewportBreakpoint('md'));
    const second = renderHook(() => useBelowViewportBreakpoint('md'));

    expect(matchMedia).toHaveBeenCalledExactlyOnceWith('(width < 900px)');
    expect(addListener).toHaveBeenCalledTimes(1);
    expect(first.result.current).toBe(false);
    expect(second.result.current).toBe(false);

    act(() => {
      mediaQuery.matches = true;
      mediaQuery.dispatchEvent(new Event('change'));
    });

    expect(first.result.current).toBe(true);
    expect(second.result.current).toBe(true);

    first.unmount();
    expect(removeListener).not.toHaveBeenCalled();

    act(() => {
      mediaQuery.matches = false;
      mediaQuery.dispatchEvent(new Event('change'));
    });
    expect(second.result.current).toBe(false);

    second.unmount();
    expect(removeListener).toHaveBeenCalledExactlyOnceWith(
      ...addListener.mock.calls[0]
    );
  });

  it('switches subscriptions when the breakpoint changes', () => {
    document.documentElement.style.setProperty('--breakpoint-md', '900px');
    document.documentElement.style.setProperty('--breakpoint-lg', '1200px');
    const mediumQuery = Object.assign(new EventTarget(), { matches: false });
    const largeQuery = Object.assign(new EventTarget(), { matches: true });
    const removeMediumListener = vi.spyOn(mediumQuery, 'removeEventListener');
    vi.stubGlobal('matchMedia', (query: string) =>
      query === '(width < 900px)' ? mediumQuery : largeQuery
    );

    const { rerender, result } = renderHook(
      (breakpoint: ViewportBreakpoint) =>
        useBelowViewportBreakpoint(breakpoint),
      { initialProps: 'md' }
    );
    expect(result.current).toBe(false);

    rerender('lg');
    expect(result.current).toBe(true);
    expect(removeMediumListener).toHaveBeenCalledOnce();

    act(() => {
      largeQuery.matches = false;
      largeQuery.dispatchEvent(new Event('change'));
    });
    expect(result.current).toBe(false);
  });
});
