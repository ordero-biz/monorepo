'use client';
import {
  SidebarNavigation,
  SidebarNavigationContent,
  SidebarNavigationHeader,
  type SidebarNavigationSectionConfig,
  SidebarNavigationSections,
} from '@ordero/ui';
import {
  ChartColumn,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from 'lucide-react';

const sidebarSections: SidebarNavigationSectionConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        kind: 'link',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard />,
      },
      {
        id: 'product',
        kind: 'collapse',
        label: 'Product',
        icon: <Package />,
        items: [
          {
            id: 'product-all',
            kind: 'link',
            label: 'Product',
            href: '/products',
          },
          {
            id: 'product-categories',
            kind: 'link',
            label: 'Categories',
            href: '/products/categories',
          },
          {
            id: 'product-attributes',
            kind: 'link',
            label: 'Attributes',
            href: '/products/attributes',
          },
          {
            id: 'product-warehouse',
            kind: 'link',
            label: 'Warehouse',
            href: '/products/warehouse',
          },
        ],
      },
    ],
  },
];

export const StoreSidebar = () => (
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
