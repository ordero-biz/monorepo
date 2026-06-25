import { clearAuthCookie, getTokenFromRequest } from '@ordero/next-api/server';
import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_AUTH_PATHS } from '@/lib/api/backendPaths';
import { fetchBackendResponse } from '@/lib/api/server';
import type { AuthSession } from '@/lib/api/types';

export const POST = async (request: NextRequest) => {
  const token = getTokenFromRequest(request);

  if (token) {
    await fetchBackendResponse({
      path: BACKEND_AUTH_PATHS.logout,
      init: {
        method: 'POST',
        headers: request.headers,
      },
      token,
    });
  }

  const response = NextResponse.json<AuthSession>({ authenticated: false });

  clearAuthCookie(response);

  return response;
};
