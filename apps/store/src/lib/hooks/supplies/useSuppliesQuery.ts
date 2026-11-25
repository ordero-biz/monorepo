'use client';

import { useQuery } from '@tanstack/react-query';
import { getSupplies } from '@/lib/client/api/supplies';
import { suppliesListQueryOptions } from '@/lib/query/supplies/suppliesQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useSuppliesQuery = (input?: PaginationSearchInput) =>
  useQuery(suppliesListQueryOptions(getSupplies, input));
