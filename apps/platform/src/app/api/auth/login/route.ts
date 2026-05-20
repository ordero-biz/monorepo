import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_AUTH_PATHS } from '@/lib/api/constants';
import { backendFetch, setAuthCookie } from '@/lib/api/server';
import type { AuthLoginInput, AuthSession, AuthUser } from '@/lib/api/types';

type BackendLoginResponse = {
  token?: unknown;
  user?: AuthUser;
};

export const POST = async (request: NextRequest) => {
  let input: AuthLoginInput;

  try {
    input = (await request.json()) as AuthLoginInput;
  } catch {
    return NextResponse.json(
      {
        status: 400,
        message: 'Invalid login request.',
      },
      { status: 400 }
    );
  }

  const result = await backendFetch<BackendLoginResponse>({
    path: BACKEND_AUTH_PATHS.login,
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  });

  if (!result.ok) {
    return NextResponse.json(result.error, { status: result.error.status });
  }

  if (typeof result.data.token !== 'string') {
    return NextResponse.json(
      {
        status: 502,
        message: 'Backend did not return a token.',
      },
      { status: 502 }
    );
  }

  const response = NextResponse.json<AuthSession>({
    authenticated: true,
    user: result.data.user,
  });

  setAuthCookie(response, result.data.token);

  return response;
};
