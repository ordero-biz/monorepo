import { clientRoutes } from '@/lib/client/routes';

export const suppliesRootBreadcrumb = {
  href: clientRoutes.supplies,
  id: 'supplies',
  label: 'Supplies',
} as const;
