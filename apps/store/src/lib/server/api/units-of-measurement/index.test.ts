import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { getServerUnitOfMeasurement, getServerUnitsOfMeasurement } from '.';

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

describe('units of measurement server helpers', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchBackendResponseMock.mockReset();
  });

  it('gets units of measurement with the server auth token', async () => {
    const response = {
      content: [
        {
          id: 1,
          code: 'KG',
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
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

    await expect(getServerUnitsOfMeasurement()).resolves.toEqual({
      ok: true,
      data: response,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/units-of-measurement',
      search: 'page=0&size=10',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets units of measurement with pagination input', async () => {
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

    await getServerUnitsOfMeasurement({
      page: 2,
      size: 10,
      sort: ['name,asc', 'code,desc'],
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/units-of-measurement',
      search: 'page=2&size=10&sort=name%2Casc&sort=code%2Cdesc',
      token: 'server-token',
      init: {
        method: 'GET',
      },
    });
  });

  it('gets a unit of measurement with the server auth token', async () => {
    const unitOfMeasurement = {
      id: 1,
      code: 'KG',
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    };

    mockAuthCookie('server-token');
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(JSON.stringify(unitOfMeasurement)),
    });

    await expect(getServerUnitOfMeasurement(1)).resolves.toEqual({
      ok: true,
      data: unitOfMeasurement,
    });

    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/api/v1/units-of-measurement/1',
      search: undefined,
      token: 'server-token',
      init: { method: 'GET' },
    });
  });

  it('returns an authentication error without a server token', async () => {
    mockAuthCookie();

    await expect(getServerUnitsOfMeasurement()).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });
});
