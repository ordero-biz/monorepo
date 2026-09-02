import { clientRoutes } from '@/lib/client/routes';

export const productsRootBreadcrumb = {
  href: clientRoutes.products,
  id: 'product',
  label: 'Products',
} as const;
