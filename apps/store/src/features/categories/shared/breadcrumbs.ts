import { clientRoutes } from '@/lib/client/routes';

export const categoriesRootBreadcrumb = {
  href: clientRoutes.categories,
  id: 'categories',
  label: 'Categories',
} as const;
