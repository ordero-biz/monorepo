'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import type { TabsPanelProps } from './types';

export const TabsPanel = ({
  children,
  keepMounted = false,
  ref,
  value,
}: TabsPanelProps) => (
  <TabsPrimitive.Panel
    className="min-w-0 pt-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    data-slot="tabs-panel"
    keepMounted={keepMounted}
    ref={ref}
    value={value}
  >
    {children}
  </TabsPrimitive.Panel>
);
