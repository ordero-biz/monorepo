'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttributes } from '@/lib/client/api/attributes';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { attributesListQueryOptions } from '../../query/attributes/attributesQueryOptions';

export const useAttributesQuery = (input?: PaginationSearchInput) =>
  useQuery(attributesListQueryOptions(getAttributes, input));
