'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttributeValues } from '@/lib/client/api';

type UseAttributeValuesQueryArgs = {
  attributeId: string;
  enabled?: boolean;
};

export const attributeValuesQueryKeys = {
  list: (attributeId: string) =>
    ['attributes', 'detail', attributeId, 'values'] as const,
};

export const useAttributeValuesQuery = ({
  attributeId,
  enabled = true,
}: UseAttributeValuesQueryArgs) =>
  useQuery({
    queryKey: attributeValuesQueryKeys.list(attributeId),
    queryFn: async () => {
      const result = await getAttributeValues(attributeId);

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    enabled,
    retry: false,
  });
