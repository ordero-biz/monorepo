import { QueryClient } from '@tanstack/react-query';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import {
  transferQueryOptions,
  transfersListQueryOptions,
} from './transfersQueryOptions';

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

  it('uses the transfer id for detail queries', async () => {
    const transfer = {
      id: 7,
      sourceWarehouse: {
        id: 1,
        name: 'Main Warehouse',
        status: WAREHOUSE_STATUS.ACTIVE,
      },
      destinationWarehouse: {
        id: 2,
        name: 'East Warehouse',
        status: WAREHOUSE_STATUS.ACTIVE,
      },
      transferNumber: 'Weekend restock',
      status: TRANSFER_STATUS.DRAFT,
      comment: null,
      dispatchedAt: null,
      dispatchedBy: null,
      completedAt: null,
      completedBy: null,
      createdAt: '2026-11-17T10:00:00Z',
      createdBy: 'owner@example.test',
      updatedAt: '2026-11-17T10:00:00Z',
      updatedBy: 'owner@example.test',
      transferEntries: [],
      version: 1,
    } satisfies TransferDetails;
    const fetchTransfer = vi.fn(async () => ({
      ok: true as const,
      data: transfer,
    }));
    const options = transferQueryOptions(7, fetchTransfer);

    expect(options.queryKey).toEqual(['transfers', 'detail', '7']);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      transfer
    );
    expect(fetchTransfer).toHaveBeenCalledWith(7);
  });

  it('throws the normalized API error for detail queries', async () => {
    const error = { status: 404, message: 'Transfer not found.' };
    const options = transferQueryOptions(7, async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });
});
