import { clientRoutes } from '@/lib/client/routes';

export const warehousesRootBreadcrumb = {
  href: clientRoutes.warehouses,
  id: 'warehouses',
  label: 'Warehouses',
} as const;
