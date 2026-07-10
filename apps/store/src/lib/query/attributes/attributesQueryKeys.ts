import type { PaginationSearchInput } from '@/lib/utils/url';

export const attributesQueryKeys = {
  list: ['attributes', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...attributesQueryKeys.list, input ?? {}] as const,
  detail: (attributeId: string | number) =>
    ['attributes', 'detail', String(attributeId)] as const,
  values: (attributeId: string | number) =>
    ['attributes', 'detail', String(attributeId), 'values'] as const,
};
