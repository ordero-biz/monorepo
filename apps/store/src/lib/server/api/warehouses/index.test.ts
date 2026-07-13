import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { getServerWarehouse, getServerWarehouses } from '.';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/lib/server/fetch', () => ({
  fetchBackendResponse: vi.fn(),
}));

const cookiesMock = vi.mocked(cookies);
const fetchBackendResponseMock = vi.mocked(fetchBackendResponse);

const mockAuthCookie = (token?: string) => {
  cookiesMock.mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) =>
      name === AUTH_TOKEN_COOKIE_NAME && token
        ? {
            value: token,
          }
        : undefined
    ),
  } as unknown as Awaited<ReturnType<typeof cookies>>);
};

describe('warehouse server helpers', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchBackendResponseMock.mockReset();
  });

  it('gets warehouses with the server auth token', async () => {
    const response = {
      content: [
        {
          id: 1,
          code: 'WH-001',
          name: 'Main Warehouse',
          address: '123 Commerce Ave',
          comment: 'Primary stock location',
        },
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };

    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(response)),
    });

    await expect(getServerWarehouses()).resolves.toEqual({
      ok: true,
      data: response,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/warehouses',
      search: 'page=0&size=10',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets warehouses with pagination input', async () => {
    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(
        JSON.stringify({
          content: [],
          page: {
            size: 10,
            number: 2,
            totalElements: 0,
            totalPages: 0,
          },
        })
      ),
    });

    await getServerWarehouses({
      page: 2,
      size: 10,
      sort: ['name,asc', 'code,desc'],
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/warehouses',
      search: 'page=2&size=10&sort=name%2Casc&sort=code%2Cdesc',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets a warehouse with the server auth token', async () => {
    const warehouse = {
      id: 1,
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };

    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(warehouse)),
    });

    await expect(getServerWarehouse(1)).resolves.toEqual({
      ok: true,
      data: warehouse,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/warehouses/1',
      search: undefined,
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('returns an authentication error without a server token', async () => {
    mockAuthCookie();

    await expect(getServerWarehouses()).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });
});
