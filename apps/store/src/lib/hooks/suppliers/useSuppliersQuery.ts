'use client';

import { useQuery } from '@tanstack/react-query';
import { getSuppliers } from '@/lib/client/api/suppliers';
import { suppliersListQueryOptions } from '@/lib/query/suppliers/suppliersQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useSuppliersQuery = (input?: PaginationSearchInput) =>
  useQuery(suppliersListQueryOptions(getSuppliers, input));
