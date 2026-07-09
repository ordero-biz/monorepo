import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Attribute, AttributeValue } from '@/lib/domain/attributes';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { attributesQueryKeys } from './attributesQueryKeys';

type AttributeId = string | number;

type AttributesFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Attribute>>>;

type AttributeFetcher = (
  attributeId: AttributeId
) => Promise<ApiResult<Attribute>>;

type AttributeValuesFetcher = (
  attributeId: AttributeId
) => Promise<ApiResult<AttributeValue[]>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const attributesListQueryOptions = (
  fetchAttributes: AttributesFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: attributesQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchAttributes(input)),
  });

export const attributeQueryOptions = (
  attributeId: AttributeId,
  fetchAttribute: AttributeFetcher
) =>
  queryOptions({
    queryKey: attributesQueryKeys.detail(attributeId),
    queryFn: () => unwrapApiResult(fetchAttribute(attributeId)),
  });

export const attributeValuesQueryOptions = (
  attributeId: AttributeId,
  fetchAttributeValues: AttributeValuesFetcher
) =>
  queryOptions({
    queryKey: attributesQueryKeys.values(attributeId),
    queryFn: () => unwrapApiResult(fetchAttributeValues(attributeId)),
  });
