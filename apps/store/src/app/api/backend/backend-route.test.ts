import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { NextRequest } from 'next/server';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { GET, POST } from './[...path]/route';

const { fetchBackendResponseMock } = vi.hoisted(() => ({
  fetchBackendResponseMock: vi.fn(),
}));

vi.mock('@/lib/server/fetch', () => ({
  fetchBackendResponse: fetchBackendResponseMock,
}));

const fetchBackendResponseMocked = vi.mocked(fetchBackendResponse);

describe('backend proxy route handler', () => {
  beforeEach(() => {
    fetchBackendResponseMocked.mockReset();
  });

  it('rejects unauthenticated requests without contacting the backend', async () => {
    const response = await GET(
      new NextRequest('http://localhost/api/backend/orders'),
      {
        params: Promise.resolve({
          path: ['orders'],
        }),
      }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toStrictEqual({
      status: 401,
      message: 'Authentication required.',
    });
    expect(fetchBackendResponseMocked).not.toHaveBeenCalled();
  });

  it('forwards authenticated requests to the backend helper', async () => {
    fetchBackendResponseMocked.mockResolvedValue({
      ok: true,
      data: new Response(
        JSON.stringify({
          items: [],
        })
      ),
    });

    const response = await GET(
      new NextRequest('http://localhost/api/backend/orders?status=open', {
        headers: {
          origin: 'https://tenant.example.test',
          'x-forwarded-host': 'tenant.example.test',
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
        },
      }),
      {
        params: Promise.resolve({
          path: ['orders'],
        }),
      }
    );

    await expect(response.json()).resolves.toStrictEqual({
      items: [],
    });
    expect(fetchBackendResponseMocked).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'orders',
        search: '?status=open',
        token: 'jwt-token',
        init: expect.objectContaining({
          body: undefined,
          headers: expect.any(Headers),
          method: 'GET',
        }),
      })
    );
    const [backendRequest] = fetchBackendResponseMocked.mock.calls[0] ?? [];
    const requestInit = backendRequest?.init;

    expect(requestInit).toBeDefined();
    expect(new Headers(requestInit?.headers).get('Origin')).toBe(
      'https://tenant.example.test'
    );
  });

  it('forwards request bodies for mutations', async () => {
    fetchBackendResponseMocked.mockResolvedValue({
      ok: true,
      data: new Response(
        JSON.stringify({
          ok: true,
        })
      ),
    });

    await POST(
      new NextRequest('http://localhost/api/backend/orders', {
        body: JSON.stringify({
          name: 'Order 1',
        }),
        headers: {
          'content-type': 'application/json',
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
        },
        method: 'POST',
      }),
      {
        params: Promise.resolve({
          path: ['orders'],
        }),
      }
    );
    const [backendRequest] = fetchBackendResponseMocked.mock.calls[0] ?? [];
    const requestInit = backendRequest?.init;

    expect(requestInit).toBeDefined();
    expect(requestInit?.body).toBeInstanceOf(ReadableStream);
    expect(new Headers(requestInit?.headers).get('Content-Type')).toBe(
      'application/json'
    );
    expect(requestInit?.method).toBe('POST');
  });

  it('preserves successful backend status codes and headers', async () => {
    fetchBackendResponseMocked.mockResolvedValue({
      ok: true,
      data: new Response(
        JSON.stringify({
          id: 'order-1',
        }),
        {
          status: 201,
          headers: {
            'content-type': 'application/json',
            location: 'https://backend.example.test/orders/order-1',
          },
        }
      ),
    });

    const response = await POST(
      new NextRequest('http://localhost/api/backend/orders', {
        body: JSON.stringify({
          name: 'Order 1',
        }),
        headers: {
          'content-type': 'application/json',
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
        },
        method: 'POST',
      }),
      {
        params: Promise.resolve({
          path: ['orders'],
        }),
      }
    );

    expect(response.status).toBe(201);
    expect(response.headers.get('location')).toBe(
      'https://backend.example.test/orders/order-1'
    );
    await expect(response.json()).resolves.toStrictEqual({
      id: 'order-1',
    });
  });

  it('clears the auth cookie when the backend returns 401', async () => {
    fetchBackendResponseMocked.mockResolvedValue({
      ok: false,
      error: {
        message: 'Token expired.',
        status: 401,
      },
    });

    const response = await GET(
      new NextRequest('http://localhost/api/backend/orders', {
        headers: {
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
        },
      }),
      {
        params: Promise.resolve({
          path: ['orders'],
        }),
      }
    );

    await expect(response.json()).resolves.toStrictEqual({
      message: 'Token expired.',
      status: 401,
    });
    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=`
    );
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });
});
