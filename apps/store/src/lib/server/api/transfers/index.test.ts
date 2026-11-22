import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { getServerTransfer, getServerTransfers } from '.';

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

describe('transfer server helpers', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchBackendResponseMock.mockReset();
  });

  it('gets transfers with the server auth token and pagination', async () => {
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
      getServerTransfers({ page: 2, size: 10, sort: ['createdAt,desc'] })
    ).resolves.toEqual({ ok: true, data: response });
    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/warehouse-transfers',
      search: 'page=1&size=10&sort=createdAt%2Cdesc',
      token: 'server-token',
      init: { method: 'GET' },
    });
  });

  it('returns an authentication error without a server token', async () => {
    mockAuthCookie();

    await expect(getServerTransfers()).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });

  it('gets a transfer detail using the server auth token', async () => {
    const response = {
      id: 5,
      status: 'DRAFT',
      transferNumber: 'TR-005',
      transferEntries: [],
      version: 1,
    };
    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(response)),
    });

    await expect(getServerTransfer('5')).resolves.toEqual({
      ok: true,
      data: response,
    });
    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/warehouse-transfers/5',
      search: undefined,
      token: 'server-token',
      init: { method: 'GET' },
    });
  });

  it('does not fetch transfer detail without an auth token', async () => {
    mockAuthCookie();

    await expect(getServerTransfer(5)).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });
});
