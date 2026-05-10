import { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import { GET, POST } from './[...path]/route';

const fetchMock = vi.fn();
const backendApiUrl = 'https://backend.example.test';

describe('backend proxy route handler', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
  });

  it('forwards authenticated requests with a Bearer token', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
        })
      )
    );

    const response = await GET(
      new NextRequest('http://localhost/api/backend/orders?status=open', {
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
      items: [],
    });
    expect(fetchMock.mock.calls[0][0].toString()).toBe(
      `${backendApiUrl}/orders?status=open`
    );
    expect(fetchMock.mock.calls[0][1].headers.get('Authorization')).toBe(
      'Bearer jwt-token'
    );
  });

  it('forwards request bodies for mutations', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
        })
      )
    );

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

    expect(fetchMock.mock.calls[0][1].body).toBe('{"name":"Order 1"}');
    expect(fetchMock.mock.calls[0][1].headers.get('Content-Type')).toBe(
      'application/json'
    );
  });

  it('preserves successful backend status codes and headers', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'order-1',
        }),
        {
          status: 201,
          headers: {
            'content-type': 'application/json',
            location: `${backendApiUrl}/orders/order-1`,
          },
        }
      )
    );

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
      `${backendApiUrl}/orders/order-1`
    );
    await expect(response.json()).resolves.toStrictEqual({
      id: 'order-1',
    });
  });

  it('clears the auth cookie when the backend returns 401', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Token expired.',
        }),
        {
          status: 401,
          statusText: 'Unauthorized',
        }
      )
    );

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
