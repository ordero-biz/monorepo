'use client';

import { useQuery } from '@tanstack/react-query';
import { getTransfer } from '@/lib/client/api/transfers';
import { transferQueryOptions } from '@/lib/query/transfers/transfersQueryOptions';

export const useTransferQuery = (transferId: string | number) =>
  useQuery(transferQueryOptions(transferId, getTransfer));
