import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { getServerProductGroups, getServerProductVariants } from '.';

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

describe('product server helpers', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchBackendResponseMock.mockReset();
  });

  it('gets products with the server auth token', async () => {
    const response = {
      content: [
        {
          id: 1,
          name: 'Running Shoes',
          description: 'Lightweight daily trainer',
          createdAt: '2026-07-03T07:20:30.291Z',
          category: {
            id: 2,
            name: 'Footwear',
            createdAt: '2026-07-01T07:20:30.291Z',
          },
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

    await expect(getServerProductGroups()).resolves.toEqual({
      ok: true,
      data: response,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/products',
      search: 'page=0&size=10',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets products with pagination input', async () => {
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

    await getServerProductGroups({
      page: 2,
      size: 10,
      sort: ['name,asc', 'createdAt,desc'],
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/products',
      search: 'page=1&size=10&sort=name%2Casc&sort=createdAt%2Cdesc',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets product variants with the server auth token', async () => {
    const response = {
      content: [
        {
          id: 7,
          name: 'Running Shoes / Blue / 42',
          description: 'Lightweight daily trainer',
          sku: 'RUN-BLU-42',
          barcode: '1234567890',
          createdAt: '2026-07-20T18:23:01.675Z',
          productVariantAttributeValues: [
            {
              id: 1,
              attribute: {
                id: 2,
                name: 'Color',
                sortOrder: 1,
                createdAt: '2026-07-20T18:23:01.675Z',
              },
              attributeValue: {
                id: 3,
                name: 'Blue',
                sortOrder: 1,
                createdAt: '2026-07-20T18:23:01.675Z',
              },
            },
          ],
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

    await expect(getServerProductVariants()).resolves.toEqual({
      ok: true,
      data: response,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/products/variants',
      search: 'page=0&size=10',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets product variants with pagination input', async () => {
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

    await getServerProductVariants({
      page: 2,
      size: 10,
      sort: ['name,asc', 'createdAt,desc'],
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/products/variants',
      search: 'page=1&size=10&sort=name%2Casc&sort=createdAt%2Cdesc',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('returns an authentication error without a server token', async () => {
    mockAuthCookie();

    await expect(getServerProductGroups()).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });
});
