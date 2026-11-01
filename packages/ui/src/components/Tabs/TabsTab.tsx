'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import type { TabsTabProps } from './types';

export const TabsTab = ({
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  children,
  disabled = false,
  id,
  ref,
  value,
}: TabsTabProps) => (
  <TabsPrimitive.Tab
    aria-describedby={ariaDescribedBy}
    aria-label={ariaLabel}
    className="inline-flex min-h-[var(--tabs-item-min-height)] min-w-[var(--tabs-item-min-width)] shrink-0 cursor-pointer items-center justify-center gap-[var(--tabs-item-spacing)] border-0 bg-transparent px-0 py-1-5 text-[length:var(--tab-label-size-desktop)] leading-[var(--tab-label-line-height-desktop)] font-[number:var(--tab-label-weight)] whitespace-nowrap text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[active]:font-[number:var(--font-weight-600)] data-[active]:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[0.48] [&_svg]:size-[var(--space-2-5)] [&_svg]:shrink-0"
    data-slot="tabs-tab"
    disabled={disabled}
    id={id}
    ref={ref}
    value={value}
  >
    {children}
  </TabsPrimitive.Tab>
);
