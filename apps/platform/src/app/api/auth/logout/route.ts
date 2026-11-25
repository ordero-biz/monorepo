import { clearAuthCookie } from '@ordero/next-api/server';
import { NextResponse } from 'next/server';
import type { AuthSession } from '@/lib/server/types';

export const POST = async () => {
  const response = NextResponse.json<AuthSession>({ authenticated: false });

  clearAuthCookie(response);

  return response;
};
