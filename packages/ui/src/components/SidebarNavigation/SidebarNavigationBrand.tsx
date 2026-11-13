'use client';

import { cn } from '@/ui/lib/utils';
import {
  brandClassName,
  brandLogoClassName,
  brandTitleClassName,
  collapsedHiddenClassName,
} from './classNames';
import type { SidebarNavigationBrandProps } from './types';

export const SidebarNavigationBrand = ({
  logo,
  title,
}: SidebarNavigationBrandProps) => (
  <div className={brandClassName} data-slot="sidebar-navigation-brand">
    <span aria-hidden="true" className={brandLogoClassName}>
      {logo}
    </span>
    <span className={cn(brandTitleClassName, collapsedHiddenClassName)}>
      {title}
    </span>
  </div>
);
