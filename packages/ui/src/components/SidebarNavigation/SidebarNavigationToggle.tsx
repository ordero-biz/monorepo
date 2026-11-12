'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { toggleClassName } from './classNames';
import { useSidebarNavigation } from './SidebarNavigationProvider';
import type { SidebarNavigationToggleProps } from './types';

export const SidebarNavigationToggle = ({
  collapseLabel,
  controls,
  expandLabel,
  ref,
}: SidebarNavigationToggleProps) => {
  const { collapsed, collapsible, toggleCollapsed } = useSidebarNavigation();

  if (!collapsible) {
    return null;
  }

  return (
    <ButtonPrimitive
      aria-controls={controls}
      aria-expanded={!collapsed}
      aria-label={collapsed ? expandLabel : collapseLabel}
      className={toggleClassName}
      data-slot="sidebar-navigation-toggle"
      onClick={toggleCollapsed}
      ref={ref}
      title={collapsed ? expandLabel : collapseLabel}
      type="button"
    >
      <ChevronLeft
        aria-hidden="true"
        className={cn(
          'size-4 transition-transform duration-[var(--sidebar-navigation-duration)] motion-reduce:transition-none',
          collapsed && 'rotate-180'
        )}
        strokeWidth={2.5}
      />
    </ButtonPrimitive>
  );
};
