import { type NextRequest, NextResponse } from 'next/server';
import {
  backendRequest,
  clearAuthCookie,
  getTokenFromRequest,
} from '@/lib/api/server';

type BackendRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const getForwardHeaders = (request: NextRequest) => {
  const headers = new Headers();
  const allowList = ['accept', 'content-type'];

  for (const [key, value] of request.headers.entries()) {
    if (allowList.includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  return headers;
};

const handleBackendRequest = async (
  request: NextRequest,
  context: BackendRouteContext
) => {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      {
        status: 401,
        message: 'Authentication required.',
      },
      { status: 401 }
    );
  }

  const { path } = await context.params;
  const result = await backendRequest({
    path: path.join('/'),
    search: request.nextUrl.search,
    token,
    init: {
      method: request.method,
      headers: getForwardHeaders(request),
      body: request.body ?? undefined,
    },
  });

  if (!result.ok) {
    const response = NextResponse.json(result.error, {
      status: result.error.status,
    });

    if (result.error.status === 401) {
      clearAuthCookie(response);
    }

    return response;
  }

  return result.data;
};

export const GET = handleBackendRequest;
export const POST = handleBackendRequest;
export const PUT = handleBackendRequest;
export const PATCH = handleBackendRequest;
export const DELETE = handleBackendRequest;
