import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_AUTH_PATHS } from '@/lib/api/backendPaths';
import {
  fetchBackendResponse,
  parseBackendResponseData,
  setAuthCookie,
} from '@/lib/api/server';
import type { AuthSession, AuthSignUpInput, Token } from '@/lib/api/types';

type BackendSignUpResponse = {
  token?: Token;
  ownerResponse: {
    id: string;
    email: string;
  };
};

export const POST = async (request: NextRequest) => {
  let input: AuthSignUpInput;

  try {
    input = (await request.json()) as AuthSignUpInput;
  } catch {
    return NextResponse.json(
      {
        status: 400,
        message: 'Invalid sign-up request.',
      },
      { status: 400 }
    );
  }

  const result = await fetchBackendResponse({
    path: BACKEND_AUTH_PATHS.signUp,
    init: {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(input),
    },
  });

  if (!result.ok) {
    return NextResponse.json(result.error, { status: result.error.status });
  }

  const data = await parseBackendResponseData<BackendSignUpResponse>(
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
    user: data.ownerResponse,
  });

  setAuthCookie(response, data.token);

  return response;
};
