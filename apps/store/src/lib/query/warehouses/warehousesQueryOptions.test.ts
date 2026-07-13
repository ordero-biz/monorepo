import { QueryClient } from '@tanstack/react-query';
import {
  warehouseQueryOptions,
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
