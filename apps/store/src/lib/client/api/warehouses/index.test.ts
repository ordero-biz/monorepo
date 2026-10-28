import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import {
  createWarehouse,
  getWarehouse,
  getWarehouseStock,
  getWarehouseStockPath,
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

  it('builds stock pagination with a zero-based backend page', () => {
    expect(getWarehouseStockPath(7)).toBe(
      '/api/backend/api/v1/warehouses/7/stock?page=0&size=10'
    );
    expect(
      getWarehouseStockPath(7, {
        page: 3,
        size: 25,
        sort: ['quantity,desc', 'totalPrice,asc'],
      })
    ).toBe(
      '/api/backend/api/v1/warehouses/7/stock?page=2&size=25&sort=quantity%2Cdesc&sort=totalPrice%2Casc'
    );
  });

  it('returns paginated warehouse stock through the authenticated proxy', async () => {
    const data = {
      content: [
        {
          productVariant: { id: 2, name: 'Shirt', sku: 'SH', barcode: '123' },
          unitOfMeasurement: { id: 1, name: 'Piece', status: 'ACTIVE' },
          quantity: 4,
          totalPrice: 12.5,
        },
      ],
      page: { number: 1, size: 10, totalElements: 11, totalPages: 2 },
    };
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(data)));
    await expect(
      getWarehouseStock('7', { page: 2, size: 10 })
    ).resolves.toEqual({ ok: true, data });
    expect(fetch).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses/7/stock?page=1&size=10',
      expect.objectContaining({ method: 'GET', cache: 'no-store' })
    );
  });

  it('returns normalized stock request errors', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Stock unavailable.' }), {
        status: 503,
      })
    );
    await expect(getWarehouseStock(7)).resolves.toEqual({
      ok: false,
      error: { status: 503, message: 'Stock unavailable.' },
    });
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
