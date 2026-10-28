import { QueryClient } from '@tanstack/react-query';
import {
  warehouseQueryOptions,
  warehouseStockQueryOptions,
  warehousesListQueryOptions,
} from './warehousesQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('warehousesListQueryOptions', () => {
  it('uses a stable paginated key and unwraps fetched warehouses', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const warehouses = {
      content: [
        {
          id: 1,
          code: 'WH-001',
          name: 'Main Warehouse',
          address: '123 Commerce Ave',
          comment: 'Primary stock location',
        },
      ],
      page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
    };
    const fetchWarehouses = vi.fn(async () => ({
      ok: true as const,
      data: warehouses,
    }));
    const options = warehousesListQueryOptions(fetchWarehouses, input);

    expect(warehousesListQueryOptions(fetchWarehouses).queryKey).toEqual([
      'warehouses',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['warehouses', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      warehouses
    );
    expect(fetchWarehouses).toHaveBeenCalledWith(input);
  });

  it('throws the normalized API error from the fetcher', async () => {
    const error = { status: 500, message: 'Could not load warehouses.' };
    const options = warehousesListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });

  it('uses a stable detail key and unwraps a fetched warehouse', async () => {
    const warehouse = {
      id: 1,
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };
    const fetchWarehouse = vi.fn(async () => ({
      ok: true as const,
      data: warehouse,
    }));
    const options = warehouseQueryOptions('1', fetchWarehouse);

    expect(options.queryKey).toEqual(['warehouses', 'detail', '1']);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      warehouse
    );
    expect(fetchWarehouse).toHaveBeenCalledWith('1');
  });
});

describe('warehouseStockQueryOptions', () => {
  it('isolates cached stock by warehouse and page and reuses matching keys', async () => {
    const client = createQueryClient();
    const fetchWarehouseStock = vi.fn(async () => ({
      ok: true as const,
      data: {
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
      },
    }));
    const options = warehouseStockQueryOptions({
      warehouseId: 1,
      fetchWarehouseStock,
      input: { page: 1, size: 10 },
    });
    await client.fetchQuery(options);
    const sameOptions = warehouseStockQueryOptions({
      warehouseId: '1',
      fetchWarehouseStock,
      input: { page: 1, size: 10 },
    });
    expect(client.getQueryData(sameOptions.queryKey)).toEqual({
      content: [],
      page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
    });
    expect(
      client.getQueryData(
        warehouseStockQueryOptions({
          warehouseId: 2,
          fetchWarehouseStock,
          input: { page: 1, size: 10 },
        }).queryKey
      )
    ).toBeUndefined();
    expect(
      client.getQueryData(
        warehouseStockQueryOptions({
          warehouseId: 1,
          fetchWarehouseStock,
          input: { page: 2, size: 10 },
        }).queryKey
      )
    ).toBeUndefined();
    expect(fetchWarehouseStock).toHaveBeenCalledExactlyOnceWith(1, {
      page: 1,
      size: 10,
    });
  });

  it('throws the normalized stock error', async () => {
    const error = { status: 503, message: 'Stock unavailable.' };
    await expect(
      createQueryClient().fetchQuery(
        warehouseStockQueryOptions({
          warehouseId: 1,
          fetchWarehouseStock: async () => ({ ok: false, error }),
        })
      )
    ).rejects.toEqual(error);
  });
});
