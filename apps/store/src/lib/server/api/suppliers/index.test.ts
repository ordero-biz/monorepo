import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { getServerSupplier, getServerSuppliers } from '.';

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

describe('supplier server helpers', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchBackendResponseMock.mockReset();
  });

  it('gets suppliers with the server auth token', async () => {
    const response = {
      content: [
        {
          id: 1,
          name: 'Fresh Farms',
          status: SUPPLIER_STATUS.DRAFT,
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
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

    await expect(getServerSuppliers()).resolves.toEqual({
      ok: true,
      data: response,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/suppliers',
      search: 'page=0&size=10',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets suppliers with pagination input', async () => {
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

    await getServerSuppliers({
      page: 2,
      size: 10,
      sort: ['name,asc', 'email,desc'],
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/suppliers',
      search: 'page=1&size=10&sort=name%2Casc&sort=email%2Cdesc',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets a supplier detail with the server auth token', async () => {
    const response = {
      id: 1,
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    };

    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(response)),
    });

    await expect(getServerSupplier('1')).resolves.toEqual({
      ok: true,
      data: response,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/suppliers/1',
      search: undefined,
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('returns an authentication error without a server token', async () => {
    mockAuthCookie();

    await expect(getServerSuppliers()).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });

  it('returns an authentication error for supplier detail without a server token', async () => {
    mockAuthCookie();

    await expect(getServerSupplier('1')).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });
});
