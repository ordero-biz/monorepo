'use client';

import type { ApiError, ApiResult } from '@ordero/api-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/client/api/auth';
import { clientRoutes } from '@/lib/client/routes';
import type { AuthSession } from '@/lib/server/types';
import { authQueryKeys } from './useSessionQuery';

export const useLogOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logoutMutation = useMutation<AuthSession, ApiError>({
    mutationFn: async () => {
      const result = await logout();

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: (session) => {
      queryClient.clear();
      queryClient.setQueryData(authQueryKeys.session, session);
      router.replace(clientRoutes.signIn);
    },
  });

  const logOut = async (): Promise<ApiResult<AuthSession>> => {
    try {
      const data = await logoutMutation.mutateAsync();

      return {
        ok: true,
        data,
      };
    } catch (error) {
      return {
        ok: false,
        error: error as ApiError,
      };
    }
  };

  return {
    isLoggingOut: logoutMutation.isPending,
    logOut,
  };
};
