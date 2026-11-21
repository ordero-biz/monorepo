import { clientRoutes } from '@/lib/client/routes';

export const transfersRootBreadcrumb = {
  href: clientRoutes.transfers,
  id: 'transfers',
  label: 'Transfers',
} as const;
