'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttributes } from '@/lib/client/api/attributes';

export const attributesQueryKeys = {
  list: ['attributes', 'list'] as const,
};

export const useAttributesQuery = () =>
  useQuery({
    queryKey: attributesQueryKeys.list,
    queryFn: async () => {
      const result = await getAttributes();

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    retry: false,
  });
