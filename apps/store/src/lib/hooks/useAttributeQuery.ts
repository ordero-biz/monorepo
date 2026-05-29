'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttribute } from '@/lib/client/api';

export const attributeQueryKeys = {
  detail: (attributeId: string) =>
    ['attributes', 'detail', attributeId] as const,
};

export const useAttributeQuery = (attributeId: string) =>
  useQuery({
    queryKey: attributeQueryKeys.detail(attributeId),
    queryFn: async () => {
      const result = await getAttribute(attributeId);

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    retry: false,
  });
