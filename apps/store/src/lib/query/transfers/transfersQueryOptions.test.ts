import { QueryClient } from '@tanstack/react-query';
import { transfersListQueryOptions } from './transfersQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('transfer query options', () => {
  it('uses a stable paginated key and unwraps fetched transfers', async () => {
    const input = { page: 2, size: 10, sort: ['createdAt,desc'] };
    const transfers = {
      content: [],
      page: { size: 10, number: 1, totalElements: 0, totalPages: 0 },
    };
    const fetchTransfers = vi.fn(async () => ({
      ok: true as const,
      data: transfers,
    }));
    const options = transfersListQueryOptions(fetchTransfers, input);

    expect(transfersListQueryOptions(fetchTransfers).queryKey).toEqual([
      'transfers',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['transfers', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      transfers
    );
    expect(fetchTransfers).toHaveBeenCalledWith(input);
  });

  it('throws the normalized API error', async () => {
    const error = { status: 500, message: 'Could not load transfers.' };
    const options = transfersListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });
});
