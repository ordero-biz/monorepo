import { clientRoutes } from '@/lib/client/routes';

export const suppliersRootBreadcrumb = {
  href: clientRoutes.suppliers,
  id: 'suppliers',
  label: 'Suppliers',
} as const;
