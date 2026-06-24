import { type NextRequest, NextResponse } from 'next/server';
import {
  clearAuthCookie,
  fetchBackendResponse,
  getTokenFromRequest,
} from '@/lib/api/server';

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
    forwardHeadersFrom: request,
    init: {
      method: request.method,
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
