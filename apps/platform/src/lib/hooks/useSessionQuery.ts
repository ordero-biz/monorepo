'use client';

import { useQuery } from '@tanstack/react-query';
import { getSession } from '@/lib/api/client';

export const authQueryKeys = {
  session: ['auth', 'session'] as const,
};

export const useSessionQuery = () =>
  useQuery({
    queryKey: authQueryKeys.session,
    queryFn: async () => {
      const result = await getSession();

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    retry: false,
  });
