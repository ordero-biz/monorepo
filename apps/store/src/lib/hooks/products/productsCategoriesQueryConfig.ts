import type { PaginationSearchInput } from '@/lib/utils/url';

export const productsCategoriesQueryInput: PaginationSearchInput = {
  page: 0,
  size: 100,
  sort: ['name,asc'],
};
