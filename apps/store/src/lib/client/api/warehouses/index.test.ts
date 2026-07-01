import { getWarehousesSearch } from '@/lib/domain/warehouses';
import { createWarehouse, getWarehouses, getWarehousesPath } from '.';

describe('warehouse client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds warehouse pageable search params', () => {
    expect(getWarehousesSearch()).toBe('page=0&size=25');
    expect(
      getWarehousesPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'code,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/warehouses?page=2&size=10&sort=name%2Casc&sort=code%2Cdesc'
    );
  });

  it('gets warehouses from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
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
            size: 25,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        })
      )
    );

    await expect(getWarehouses()).resolves.toEqual({
      ok: true,
      data: {
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
          size: 25,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses?page=0&size=25',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the warehouses route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Warehouses lookup failed.',
          code: 'WAREHOUSES_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getWarehouses()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Warehouses lookup failed.',
        code: 'WAREHOUSES_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('posts a new warehouse through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          code: 'WH-001',
          name: 'Main Warehouse',
          address: '123 Commerce Ave',
          comment: 'Primary stock location',
        })
      )
    );

    await expect(
      createWarehouse({
        code: 'WH-001',
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        code: 'WH-001',
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          code: 'WH-001',
          name: 'Main Warehouse',
          address: '123 Commerce Ave',
          comment: 'Primary stock location',
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the create warehouse route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Warehouse creation failed.',
          fieldErrors: {
            code: 'Warehouse code already exists.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createWarehouse({
        code: 'WH-001',
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Warehouse creation failed.',
        code: undefined,
        fieldErrors: {
          code: 'Warehouse code already exists.',
        },
      },
    });
  });
});
