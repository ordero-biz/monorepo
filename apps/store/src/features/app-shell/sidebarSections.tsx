import type { SidebarNavigationSectionConfig } from '@ordero/ui';
import { LayoutDashboard, Package } from 'lucide-react';
import { clientRoutes } from '@/lib/client/routes';

export const sidebarSections: SidebarNavigationSectionConfig[] = [
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
            id: 'product-units-of-measurement',
            kind: 'link',
            label: 'Units of measurement',
            href: clientRoutes.unitsOfMeasurement,
          },
          {
            id: 'product-suppliers',
            kind: 'link',
            label: 'Suppliers',
            href: clientRoutes.suppliers,
          },
          {
            id: 'product-warehouse',
            kind: 'link',
            label: 'Warehouse',
            href: clientRoutes.warehouses,
          },
        ],
      },
    ],
  },
];
