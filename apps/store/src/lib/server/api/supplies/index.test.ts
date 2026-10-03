import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { getServerSupplies, getServerSupply } from '.';

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
    get: vi
      .fn()
      .mockImplementation((name: string) =>
        name === AUTH_TOKEN_COOKIE_NAME && token ? { value: token } : undefined
      ),
  } as unknown as Awaited<ReturnType<typeof cookies>>);
};

describe('supply server helpers', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchBackendResponseMock.mockReset();
  });

  it('gets supplies with the server auth token and pagination', async () => {
    const response = {
      content: [],
      page: { size: 10, number: 1, totalElements: 0, totalPages: 0 },
    };

    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(response)),
    });

    await expect(
      getServerSupplies({ page: 2, size: 10, sort: ['createdAt,desc'] })
    ).resolves.toEqual({ ok: true, data: response });
    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/supplies',
      search: 'page=1&size=10&sort=createdAt%2Cdesc',
      token: 'server-token',
      init: { method: 'GET' },
    });
  });

  it('returns an authentication error without a server token', async () => {
    mockAuthCookie();

    await expect(getServerSupplies()).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });

  it('gets a supply detail using the server auth token', async () => {
    const response = {
      id: 7,
      status: 'DRAFT',
      supplyNumber: 'SUP-007',
      supplyEntries: [],
      version: 1,
    };
    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(response)),
    });

    await expect(getServerSupply('7')).resolves.toEqual({
      ok: true,
      data: response,
    });
    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/supplies/7',
      search: undefined,
      token: 'server-token',
      init: { method: 'GET' },
    });
  });

  it('does not fetch supply detail without an auth token', async () => {
    mockAuthCookie();

    await expect(getServerSupply(7)).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });
});
