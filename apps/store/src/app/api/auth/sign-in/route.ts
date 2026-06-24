import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_AUTH_PATHS } from '@/lib/api/backendPaths';
import {
  fetchBackendResponse,
  parseBackendResponseData,
  setAuthCookie,
} from '@/lib/api/server';
import type { AuthSession, AuthSignInInput, Token } from '@/lib/api/types';

type BackendLoginResponse = {
  token?: Token;
};

export const POST = async (request: NextRequest) => {
  let input: AuthSignInInput;

  try {
    input = (await request.json()) as AuthSignInInput;
  } catch {
    return NextResponse.json(
      {
        status: 400,
        message: 'Invalid sign-in request.',
      },
      { status: 400 }
    );
  }

  const backendHeaders = new Headers(request.headers);
  backendHeaders.set('Content-Type', 'application/json');

  const result = await fetchBackendResponse({
    path: BACKEND_AUTH_PATHS.signIn,
    init: {
      method: 'POST',
      headers: backendHeaders,
      body: JSON.stringify(input),
    },
  });

  if (!result.ok) {
    return NextResponse.json(result.error, { status: result.error.status });
  }

  const data = await parseBackendResponseData<BackendLoginResponse>(
    result.data
  );

  if (typeof data?.token !== 'string') {
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
  });

  setAuthCookie(response, data.token);

  return response;
};
