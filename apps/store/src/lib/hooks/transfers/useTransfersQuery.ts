'use client';

import { useQuery } from '@tanstack/react-query';
import { getTransfers } from '@/lib/client/api/transfers';
import { transfersListQueryOptions } from '@/lib/query/transfers/transfersQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useTransfersQuery = (input?: PaginationSearchInput) =>
  useQuery(transfersListQueryOptions(getTransfers, input));
