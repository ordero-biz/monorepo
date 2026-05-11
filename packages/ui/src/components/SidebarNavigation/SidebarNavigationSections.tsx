'use client';

import { SidebarNavigationMenu } from './SidebarNavigationMenu';
import { SidebarNavigationSection } from './SidebarNavigationSection';
import { SidebarNavigationSectionContent } from './SidebarNavigationSectionContent';
import {
  getVisibleSections,
  shouldSectionBeExpanded,
} from './utils';
import type { SidebarNavigationSectionsProps } from './types';

export const SidebarNavigationSections = ({
  renderLink,
  sections,
}: SidebarNavigationSectionsProps) => {
  const visibleSections = getVisibleSections(sections);

  return (
    <>
      {visibleSections.map((section) => (
        <SidebarNavigationSection
          collapsible={section.collapsible}
          defaultExpanded={shouldSectionBeExpanded(section)}
          hidden={section.hidden}
          id={section.id}
          key={section.id}
          label={section.label}
        >
          <SidebarNavigationSectionContent>
            <SidebarNavigationMenu
              ariaLabel={section.label ?? section.id}
              items={section.items}
              renderLink={renderLink}
            />
          </SidebarNavigationSectionContent>
        </SidebarNavigationSection>
      ))}
    </>
  );
};
