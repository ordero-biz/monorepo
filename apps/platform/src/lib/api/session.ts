import {
  resolveServerSession,
  type ServerSessionResult as SharedServerSessionResult,
} from '@ordero/next-api/session';
import { BACKEND_AUTH_PATHS } from '@/lib/api/constants';
import { fetchBackendData } from '@/lib/api/server';
import type { AuthUser } from '@/lib/api/types';

export type ServerSessionResult = SharedServerSessionResult<AuthUser>;

export const getServerSession = async (
  token?: string
): Promise<ServerSessionResult> => {
  return resolveServerSession<AuthUser>({
    token,
    mePath: BACKEND_AUTH_PATHS.me,
    fetchBackendData,
  });
};
