import { QueryClient } from '@tanstack/react-query';
import { suppliesListQueryOptions } from './suppliesQueryOptions';

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
});
