import type { PaginationSearchInput } from '@/lib/utils/url';

export const categoriesQueryKeys = {
  list: ['categories', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...categoriesQueryKeys.list, input ?? {}] as const,
  options: () => [...categoriesQueryKeys.list, 'options'] as const,
  detail: (categoryId: string | number) =>
    ['categories', 'detail', String(categoryId)] as const,
  children: (parentId: string | number) =>
    ['categories', 'detail', String(parentId), 'children'] as const,
};
