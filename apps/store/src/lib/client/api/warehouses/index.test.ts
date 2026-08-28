import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
import {
  createWarehouse,
  getWarehouse,
  getWarehouses,
  getWarehousesPath,
  updateWarehouse,
} from '.';

describe('warehouse client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds warehouse pageable search params', () => {
    expect(
      getWarehousesPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'code,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/warehouses?page=1&size=10&sort=name%2Casc&sort=code%2Cdesc'
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
            size: 10,
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
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses?page=0&size=10',
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

  it('gets a warehouse from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const warehouse = {
      id: 1,
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };

    fetchMock.mockResolvedValue(new Response(JSON.stringify(warehouse)));

    await expect(getWarehouse(1)).resolves.toEqual({
      ok: true,
      data: warehouse,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses/1',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
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
        status: WAREHOUSE_STATUS.ACTIVE,
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
          status: WAREHOUSE_STATUS.ACTIVE,
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
        status: WAREHOUSE_STATUS.DRAFT,
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

  it('patches a warehouse through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const warehouse = {
      id: 1,
      code: 'WH-002',
      name: 'Updated Warehouse',
      address: '124 Commerce Ave',
      comment: 'Updated stock location',
    };

    fetchMock.mockResolvedValue(new Response(JSON.stringify(warehouse)));

    await expect(
      updateWarehouse({
        warehouseId: 1,
        code: 'WH-002',
        name: 'Updated Warehouse',
        address: '124 Commerce Ave',
        comment: 'Updated stock location',
      })
    ).resolves.toEqual({ ok: true, data: warehouse });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          code: 'WH-002',
          name: 'Updated Warehouse',
          address: '124 Commerce Ave',
          comment: 'Updated stock location',
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the update warehouse route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Warehouse update failed.',
          fieldErrors: { code: 'Warehouse code already exists.' },
        }),
        { status: 422, statusText: 'Unprocessable Entity' }
      )
    );

    await expect(
      updateWarehouse({
        warehouseId: 1,
        code: 'WH-001',
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Warehouse update failed.',
        code: undefined,
        fieldErrors: { code: 'Warehouse code already exists.' },
      },
    });
  });
});
