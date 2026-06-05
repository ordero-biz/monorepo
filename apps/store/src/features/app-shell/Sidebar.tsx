'use client';

import {
  SidebarNavigation,
  SidebarNavigationContent,
  SidebarNavigationHeader,
  SidebarNavigationSections,
} from '@ordero/ui';
import { Package } from 'lucide-react';
import { sidebarSections } from './sidebarSections';

export const Sidebar = () => (
  <SidebarNavigation id="store-sidebar">
    <SidebarNavigationHeader>
      <div className="flex items-center gap-[var(--space-1)] px-[var(--space-1-5)]">
        <div className="flex size-[32px] items-center justify-center rounded-[var(--radius-50-token)] bg-primary text-primary-foreground">
          <Package className="size-4" />
        </div>
        <span className="text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] text-[var(--text-primary)]">
          Ordero
        </span>
      </div>
    </SidebarNavigationHeader>
    <SidebarNavigationContent>
      <SidebarNavigationSections sections={sidebarSections} />
    </SidebarNavigationContent>
  </SidebarNavigation>
);
