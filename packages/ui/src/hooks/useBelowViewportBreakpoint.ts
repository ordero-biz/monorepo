'use client';

import { useSyncExternalStore } from 'react';
import {
  type ViewportBreakpoint,
  viewportBreakpointStores,
} from './viewportBreakpointStore';

export type { ViewportBreakpoint } from './viewportBreakpointStore';

const getServerSnapshot = () => false;

/** Returns whether the viewport is narrower than the selected breakpoint. */
export const useBelowViewportBreakpoint = (breakpoint: ViewportBreakpoint) => {
  const { subscribe, getSnapshot } = viewportBreakpointStores[breakpoint];
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
