'use client';

import { useQuery } from '@tanstack/react-query';
import { getStores } from '@/lib/client/api/stores';

export const storesQueryKeys = {
  list: ['stores', 'list'] as const,
};

export const useStoresQuery = () =>
  useQuery({
    queryKey: storesQueryKeys.list,
    queryFn: async () => {
      const result = await getStores();

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    retry: false,
  });
