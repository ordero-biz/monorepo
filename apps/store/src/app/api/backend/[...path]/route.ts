import { clearAuthCookie, getTokenFromRequest } from '@ordero/next-api/server';
import { type NextRequest, NextResponse } from 'next/server';
import { fetchBackendResponse } from '@/lib/server/fetch';

type BackendRouteContext = {
  params: Promise<{
    path: string[];
  }>;
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
  const result = await fetchBackendResponse({
    path: path.join('/'),
    search: request.nextUrl.search,
    token,
    init: {
      method: request.method,
      headers: request.headers,
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
