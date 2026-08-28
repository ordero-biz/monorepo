import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
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
        sort: ['name,asc', 'address,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/warehouses?page=1&size=10&sort=name%2Casc&sort=address%2Cdesc'
    );
  });

  it('gets warehouses from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);
    const warehouse = {
      id: 1,
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [warehouse],
          page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
        })
      )
    );

    await expect(getWarehouses()).resolves.toEqual({
      ok: true,
      data: {
        content: [warehouse],
        page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
      },
    });
  });

  it('gets a warehouse from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const warehouse = {
      id: 1,
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
      expect.objectContaining({ method: 'GET', cache: 'no-store' })
    );
  });

  it('posts a new warehouse through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const warehouse = {
      id: 1,
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(warehouse)));

    await expect(
      createWarehouse({
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
        status: WAREHOUSE_STATUS.ACTIVE,
      })
    ).resolves.toEqual({ ok: true, data: warehouse });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Main Warehouse',
          address: '123 Commerce Ave',
          comment: 'Primary stock location',
          status: WAREHOUSE_STATUS.ACTIVE,
        }),
      })
    );
  });

  it('patches a warehouse through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const warehouse = {
      id: 1,
      name: 'Updated Warehouse',
      address: '124 Commerce Ave',
      comment: 'Updated stock location',
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(warehouse)));

    await expect(
      updateWarehouse({
        warehouseId: 1,
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
          name: 'Updated Warehouse',
          address: '124 Commerce Ave',
          comment: 'Updated stock location',
        }),
      })
    );
  });

  it('sends null when clearing a warehouse address', async () => {
    const fetchMock = vi.mocked(fetch);
    const warehouse = {
      id: 1,
      name: 'Main Warehouse',
      address: null,
      comment: 'Primary stock location',
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(warehouse)));

    await expect(
      updateWarehouse({
        warehouseId: 1,
        address: null,
      })
    ).resolves.toEqual({ ok: true, data: warehouse });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ address: null }),
      })
    );
  });
});
