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
            active: true,
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
      {
        id: 'supplier',
        kind: 'collapse',
        label: 'Supplier',
        icon: <Warehouse />,
        items: [
          {
            id: 'supplier-supply',
            kind: 'link',
            label: 'Supply',
            href: '/suppliers/supply',
          },
          {
            id: 'supplier-warehouse',
            kind: 'link',
            label: 'Warehouse',
            href: '/suppliers/warehouse',
          },
        ],
      },
      {
        id: 'orders',
        kind: 'link',
        label: 'Order',
        href: '/orders',
        icon: <ShoppingCart />,
      },
      {
        id: 'finance',
        kind: 'link',
        label: 'Finance',
        href: '/finance',
        icon: <ChartColumn />,
      },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    collapsible: true,
    items: [
      {
        id: 'management-home',
        kind: 'action',
        label: 'Management',
        icon: <Users />,
        onSelect: () => undefined,
      },
      {
        id: 'customers',
        kind: 'link',
        label: 'Customers',
        href: '/customers',
        icon: <Users />,
      },
      {
        id: 'settings',
        kind: 'link',
        label: 'Settings',
        href: '/settings',
        icon: <Settings />,
      },
      {
        id: 'messages',
        kind: 'link',
        label: 'Messages',
        href: '/messages',
        icon: <MessageSquareText />,
        badge: (
          <span className="inline-flex min-w-[24px] items-center justify-center rounded-[var(--radius-0-75-token)] bg-[var(--color-error-8)] px-[var(--space-0-75)] text-[length:var(--label-size-desktop)] leading-[var(--label-line-height-desktop)] font-[var(--label-weight)] text-[var(--error-darker)]">
            32+
          </span>
        ),
      },
      {
        id: 'reports',
        kind: 'link',
        label: 'Report',
        href: 'https://example.com/reports',
        external: true,
        icon: <FileText />,
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
