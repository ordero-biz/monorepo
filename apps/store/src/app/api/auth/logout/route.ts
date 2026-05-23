import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_AUTH_PATHS } from '@/lib/api/constants';
import {
  backendFetch,
  clearAuthCookie,
  getTokenFromRequest,
} from '@/lib/api/server';
import type { AuthSession } from '@/lib/api/types';

export const POST = async (request: NextRequest) => {
  const token = getTokenFromRequest(request);

  if (token) {
    await backendFetch({
      path: BACKEND_AUTH_PATHS.logout,
      init: {
        method: 'POST',
      },
      token,
    });
  }

  const response = NextResponse.json<AuthSession>({ authenticated: false });

  clearAuthCookie(response);

  return response;
};
