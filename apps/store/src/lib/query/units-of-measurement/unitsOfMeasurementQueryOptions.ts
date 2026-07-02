import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { unitsOfMeasurementQueryKeys } from './unitsOfMeasurementQueryKeys';

type UnitsOfMeasurementFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<UnitOfMeasurement>>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const unitsOfMeasurementListQueryOptions = (
  fetchUnitsOfMeasurement: UnitsOfMeasurementFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: unitsOfMeasurementQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchUnitsOfMeasurement(input)),
  });
