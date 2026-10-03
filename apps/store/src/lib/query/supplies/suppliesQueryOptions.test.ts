import { QueryClient } from '@tanstack/react-query';
import {
  suppliesListQueryOptions,
  supplyQueryOptions,
} from './suppliesQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('supply query options', () => {
  it('uses a stable paginated key and unwraps fetched supplies', async () => {
    const input = { page: 2, size: 10, sort: ['createdAt,desc'] };
    const supplies = {
      content: [],
      page: { size: 10, number: 1, totalElements: 0, totalPages: 0 },
    };
    const fetchSupplies = vi.fn(async () => ({
      ok: true as const,
      data: supplies,
    }));
    const options = suppliesListQueryOptions(fetchSupplies, input);

    expect(suppliesListQueryOptions(fetchSupplies).queryKey).toEqual([
      'supplies',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['supplies', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      supplies
    );
    expect(fetchSupplies).toHaveBeenCalledWith(input);
  });

  it('throws the normalized API error', async () => {
    const error = { status: 500, message: 'Could not load supplies.' };
    const options = suppliesListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });

  it('uses the supply id for detail queries', async () => {
    const supply = {
      id: 7,
      status: 'DRAFT' as const,
      supplier: { id: 2, name: 'Fresh Farms', status: 'ACTIVE' },
      warehouse: { id: 3, name: 'Main warehouse', status: 'ACTIVE' },
      totalQuantity: 0,
      totalPrice: 0,
      version: 1,
      supplyEntries: [],
    };
    const fetchSupply = vi.fn(async () => ({
      ok: true as const,
      data: supply,
    }));
    const options = supplyQueryOptions(7, fetchSupply);

    expect(options.queryKey).toEqual(['supplies', 'detail', '7']);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      supply
    );
    expect(fetchSupply).toHaveBeenCalledWith(7);
  });

  it('throws the normalized API error for detail queries', async () => {
    const error = { status: 404, message: 'Supply not found.' };
    const options = supplyQueryOptions(7, async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });
});
