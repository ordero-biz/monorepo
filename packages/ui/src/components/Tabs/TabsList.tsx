'use client';

import './styles.css';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TabsListProps } from './types';
import { useTabsScroll } from './useTabsScroll';

const scrollButtonClassName =
  'inline-flex w-[var(--space-4)] min-h-[var(--tabs-item-min-height)] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-default disabled:opacity-0 [&_svg]:size-[var(--space-2-5)] [&_svg]:rtl:rotate-180';

export const TabsList = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  activateOnFocus = false,
  children,
  id,
  loopFocus = true,
  nextScrollLabel = 'Scroll tabs forward',
  previousScrollLabel = 'Scroll tabs backward',
  ref,
}: TabsListProps) => {
  const { viewportRef, scrollState, scroll } = useTabsScroll();

  return (
    <div className="flex min-w-0 w-full items-stretch">
      {scrollState.overflowing ? (
        <ButtonPrimitive
          aria-label={previousScrollLabel}
          className={scrollButtonClassName}
          disabled={!scrollState.previous}
          onClick={() => scroll('previous')}
        >
          <ChevronLeft aria-hidden="true" />
        </ButtonPrimitive>
      ) : null}
      <div
        className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={viewportRef}
      >
        <TabsPrimitive.List
          activateOnFocus={activateOnFocus}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className="relative isolate flex w-max min-w-full gap-[var(--tabs-mobile-list-spacing)] sm:gap-[var(--tabs-list-spacing)]"
          data-slot="tabs-list"
          id={id}
          loopFocus={loopFocus}
          ref={ref}
        >
          {children}
          <TabsPrimitive.Indicator className="tabs-indicator pointer-events-none absolute bottom-0 left-0 h-[var(--space-2px)] w-[var(--active-tab-width)] bg-foreground" />
        </TabsPrimitive.List>
      </div>
      {scrollState.overflowing ? (
        <ButtonPrimitive
          aria-label={nextScrollLabel}
          className={scrollButtonClassName}
          disabled={!scrollState.next}
          onClick={() => scroll('next')}
        >
          <ChevronRight aria-hidden="true" />
        </ButtonPrimitive>
      ) : null}
    </div>
  );
};
