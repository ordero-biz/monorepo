import type { PaginationSearchInput } from '@/lib/utils/url';

export const unitsOfMeasurementQueryKeys = {
  list: ['units-of-measurement', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...unitsOfMeasurementQueryKeys.list, input ?? {}] as const,
  detail: (unitOfMeasurementId: string | number) =>
    ['units-of-measurement', 'detail', String(unitOfMeasurementId)] as const,
};
