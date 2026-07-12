import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { fetchBackendResponse } from '@/lib/server/fetch';
import {
  getServerAttribute,
  getServerAttributes,
  getServerAttributeValues,
} from '.';

vi.mock('next/headers', async () => ({
  ...(await vi.importActual<typeof import('next/headers')>('next/headers')),
  cookies: vi.fn(),
}));

vi.mock('@/lib/server/fetch', async () => ({
  ...(await vi.importActual<typeof import('@/lib/server/fetch')>(
    '@/lib/server/fetch'
  )),
  fetchBackendResponse: vi.fn(),
}));

const cookiesMock = vi.mocked(cookies);
const fetchBackendResponseMock = vi.mocked(fetchBackendResponse);

const mockAuthCookie = (token?: string) => {
  cookiesMock.mockResolvedValue({
    get: vi
      .fn()
      .mockImplementation((name: string) =>
        name === AUTH_TOKEN_COOKIE_NAME && token ? { value: token } : undefined
      ),
  } as unknown as Awaited<ReturnType<typeof cookies>>);
};

describe('attribute server helpers', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchBackendResponseMock.mockReset();
  });

  it('gets paginated attributes with the server auth token', async () => {
    const attributes = {
      content: [
        {
          id: 1,
          name: 'Size',
          sortOrder: 10,
          createdAt: '2026-07-01T10:54:34.839Z',
        },
      ],
      page: {
        size: 10,
        number: 2,
        totalElements: 1,
        totalPages: 1,
      },
    };
    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(attributes)),
    });

    await expect(
      getServerAttributes({
        page: 2,
        size: 10,
        sort: ['name,asc'],
      })
    ).resolves.toEqual({
      ok: true,
      data: attributes,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/attributes',
      search: 'page=2&size=10&sort=name%2Casc',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('uses tokenized paths for attribute details and values', async () => {
    mockAuthCookie('server-token');
    fetchBackendResponseMock
      .mockResolvedValueOnce({
        ok: true,
        data: new Response(
          JSON.stringify({
            id: 12,
            name: 'Size',
            sortOrder: 10,
            createdAt: '2026-07-01T10:54:34.839Z',
          })
        ),
      })
      .mockResolvedValueOnce({
        ok: true,
        data: new Response(JSON.stringify([{ id: 3, value: 'Large' }])),
      });

    await getServerAttribute(12);
    await getServerAttributeValues(12);

    expect(fetchBackendResponseMock).toHaveBeenNthCalledWith(1, {
      path: '/api/v1/attributes/12',
      search: undefined,
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
    expect(fetchBackendResponseMock).toHaveBeenNthCalledWith(2, {
      path: '/api/v1/attributes/12/values',
      search: undefined,
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('returns an authentication error without a server token', async () => {
    mockAuthCookie();

    await expect(getServerAttributes()).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });

  it('returns backend failures without parsing a response body', async () => {
    const error = {
      status: 500,
      message: 'Could not load attributes.',
    };
    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: false,
      error,
    });

    await expect(getServerAttributes()).resolves.toEqual({
      ok: false,
      error,
    });
  });
});
