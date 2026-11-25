'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import type { TabsRootProps } from './types';

export const TabsRoot = ({
  children,
  defaultValue,
  id,
  onValueChange,
  ref,
  value,
}: TabsRootProps) => (
  <TabsPrimitive.Root
    className="flex min-w-0 w-full flex-col"
    data-slot="tabs"
    {...(defaultValue !== undefined ? { defaultValue } : {})}
    id={id}
    onValueChange={onValueChange}
    ref={ref}
    value={value}
  >
    {children}
  </TabsPrimitive.Root>
);
