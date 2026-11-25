'use client';

import { Accordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/ui/lib/utils';
import {
  accordionPanelClassName,
  accordionPanelContentClassName,
  sectionLabelClassName,
  sectionRootClassName,
} from './classNames';
import { useSidebarNavigationScope } from './SidebarNavigationScopeProvider';
import type { SidebarNavigationSectionProps } from './types';
import { useSidebarNavigationExpansion } from './useSidebarNavigationExpansion';
import { toAccordionItemIds } from './utils';

export const SidebarNavigationSection = ({
  children,
  collapsible = false,
  defaultExpanded = false,
  hidden = false,
  id,
  label,
  ref,
}: SidebarNavigationSectionProps) => {
  const defaultOpenIds = useMemo(
    () => (defaultExpanded ? [id] : []),
    [defaultExpanded, id]
  );
  const [openSectionIds, setOpenSectionIds] = useSidebarNavigationExpansion({
    defaultKey: String(defaultExpanded),
    defaultOpenIds,
    groupKey: `section:${id}`,
  });
  const { renderCollapsed } = useSidebarNavigationScope();

  if (hidden) {
    return null;
  }

  if (!collapsible || !label || renderCollapsed) {
    return (
      <section
        className={sectionRootClassName}
        data-slot="sidebar-navigation-section"
        id={id}
        ref={ref}
      >
        {label ? (
          <div
            aria-hidden={renderCollapsed ? true : undefined}
            className={cn(
              sectionLabelClassName,
              'whitespace-nowrap',
              renderCollapsed && 'invisible'
            )}
          >
            {label}
          </div>
        ) : null}
        {children}
      </section>
    );
  }

  return (
    <section
      className={sectionRootClassName}
      data-slot="sidebar-navigation-section"
      id={id}
      ref={ref}
    >
      <Accordion.Root
        onValueChange={(nextValue) =>
          setOpenSectionIds(toAccordionItemIds(nextValue))
        }
        value={openSectionIds}
      >
        <Accordion.Item
          className="group/section flex flex-col gap-[var(--space-0-5)]"
          value={id}
        >
          <Accordion.Header className="m-0">
            <Accordion.Trigger
              className={cn(sectionLabelClassName, 'cursor-pointer')}
            >
              <span className="min-w-0 flex-1 truncate">{label}</span>
              <span className="flex size-[var(--space-2)] shrink-0 items-center justify-center transition-transform duration-150 motion-reduce:transition-none group-data-[open]/section:rotate-180">
                <ChevronDown />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel
            aria-label={`${label} section`}
            className={accordionPanelClassName}
          >
            <div className={accordionPanelContentClassName}>{children}</div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </section>
  );
};
