'use client';

import { useQuery } from '@tanstack/react-query';
import { getSupply } from '@/lib/client/api/supplies';
import { supplyQueryOptions } from '@/lib/query/supplies/suppliesQueryOptions';

export const useSupplyQuery = (supplyId: string | number) =>
  useQuery(supplyQueryOptions(supplyId, getSupply));
