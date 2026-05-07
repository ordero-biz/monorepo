'use client';

import { Accordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';
import {
  sectionLabelClassName,
  sectionRootClassName,
} from './sidebarNavigationStyles';
import { toAccordionItemIds } from './sidebarNavigationUtils';
import type { SidebarNavigationSectionProps } from './types';

export const SidebarNavigationSection = forwardRef<
  HTMLDivElement,
  SidebarNavigationSectionProps
>(
  (
    {
      children,
      collapsible = false,
      defaultExpanded = false,
      hidden = false,
      id,
      label,
    },
    ref
  ) => {
    const [openSectionIds, setOpenSectionIds] = useState<string[]>(
      defaultExpanded ? [id] : []
    );

    useEffect(() => {
      setOpenSectionIds(defaultExpanded ? [id] : []);
    }, [defaultExpanded, id]);

    if (hidden) {
      return null;
    }

    if (!collapsible || !label) {
      return (
        <div
          className={sectionRootClassName}
          data-slot="sidebar-navigation-section"
          id={id}
          ref={ref}
        >
          {label ? <div className={sectionLabelClassName}>{label}</div> : null}
          {children}
        </div>
      );
    }

    return (
      <Accordion.Root
        className={sectionRootClassName}
        onValueChange={(nextValue) =>
          setOpenSectionIds(toAccordionItemIds(nextValue))
        }
        value={openSectionIds}
      >
        <Accordion.Item
          className="group/section flex flex-col gap-[var(--space-0-5)]"
          data-slot="sidebar-navigation-section"
          id={id}
          ref={ref}
          value={id}
        >
          <Accordion.Header className="m-0">
            <Accordion.Trigger className={sectionLabelClassName}>
              <span className="min-w-0 flex-1 truncate">{label}</span>
              <span className="flex size-[var(--space-2)] shrink-0 items-center justify-center transition-transform group-data-[open]/section:rotate-180">
                <ChevronDown />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel
            aria-label={`${label} section`}
            className="overflow-hidden"
          >
            {children}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );
  }
);

SidebarNavigationSection.displayName = 'SidebarNavigationSection';
