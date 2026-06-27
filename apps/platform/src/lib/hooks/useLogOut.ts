'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { logout } from '@/lib/client/api';
import { clientRoutes } from '@/lib/client/routes';
import { authQueryKeys } from './useSessionQuery';

export const useLogOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logOut = useCallback(async () => {
    setIsLoggingOut(true);

    const result = await logout();

    if (!result.ok) {
      setIsLoggingOut(false);
      return result;
    }

    queryClient.clear();
    queryClient.setQueryData(authQueryKeys.session, result.data);
    router.replace(clientRoutes.signIn);

    return result;
  }, [queryClient, router]);

  return {
    isLoggingOut,
    logOut,
  };
};
