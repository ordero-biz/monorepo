import { clearAuthCookie, getTokenFromRequest } from '@ordero/next-api/server';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/api/session';
import type { AuthSession } from '@/lib/api/types';

export const GET = async (request: NextRequest) => {
  const token = getTokenFromRequest(request);
  const result = await getServerSession(token);

  if (!result.ok) {
    return NextResponse.json(result.error, { status: result.error.status });
  }

  const response = NextResponse.json<AuthSession>(result.session);

  if (result.shouldClearAuthCookie) {
    clearAuthCookie(response);
  }

  return response;
};
