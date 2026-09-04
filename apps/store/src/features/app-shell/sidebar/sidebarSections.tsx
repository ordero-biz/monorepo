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
        href: clientRoutes.dashboard,
        icon: <LayoutDashboard />,
      },
      {
        id: 'product',
        kind: 'collapse',
        label: 'Product',
        icon: <Package />,
        items: [
          {
            id: 'products',
            kind: 'link',
            label: 'Products',
            href: clientRoutes.products,
          },
          {
            id: 'product-categories',
            kind: 'link',
            label: 'Categories',
            href: clientRoutes.categories,
          },
          {
            id: 'product-attributes',
            kind: 'link',
            label: 'Attributes',
            href: clientRoutes.attributes,
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
