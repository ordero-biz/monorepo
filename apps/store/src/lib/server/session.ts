import {
  resolveServerSession,
  type ServerSessionResult as SharedServerSessionResult,
} from '@ordero/next-api/session';
import { BACKEND_AUTH_PATHS } from '@/lib/server/api/path';
import { fetchBackendResponse } from '@/lib/server/fetch';
import type { AuthUser } from '@/lib/server/types';

export type ServerSessionResult = SharedServerSessionResult<AuthUser>;

export const getServerSession = async (
  token?: string
): Promise<ServerSessionResult> => {
  return resolveServerSession<AuthUser>({
    token,
    mePath: BACKEND_AUTH_PATHS.me,
    fetchBackendResponse,
  });
};
