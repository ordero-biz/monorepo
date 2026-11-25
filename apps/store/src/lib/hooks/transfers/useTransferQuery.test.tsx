import { focusManager } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { getTransfer } from '@/lib/client/api/transfers';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useTransferQuery } from './useTransferQuery';

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  getTransfer: vi.fn(),
}));

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

const getTransferMock = vi.mocked(getTransfer);

describe('transfer detail query', () => {
  beforeEach(() => {
    getTransferMock.mockReset();
  });

  it('loads a saved transfer by id', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useTransferQuery('7'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(transfer);
    expect(getTransferMock).toHaveBeenCalledWith('7');
  });

  it('uses prefetched transfer detail without another client request', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(transfersQueryKeys.detail(7), transfer);
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useTransferQuery('7'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(transfer);
    expect(getTransferMock).not.toHaveBeenCalled();
  });

  it('refetches on every return to the tab even while the cached transfer is fresh', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(transfersQueryKeys.detail(7), transfer);
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, unmount } = renderHook(() => useTransferQuery('7'), {
      wrapper: TestQueryProvider,
    });

    try {
      expect(result.current.data).toEqual(transfer);
      expect(getTransferMock).not.toHaveBeenCalled();

      for (const version of [2, 3]) {
        const latest = { ...transfer, version };
        getTransferMock.mockResolvedValue({ ok: true, data: latest });
        expect(result.current.isStale).toBe(false);

        act(() => {
          focusManager.setFocused(false);
          focusManager.setFocused(true);
        });

        await waitFor(() => expect(result.current.data).toEqual(latest));
        expect(getTransferMock).toHaveBeenCalledTimes(version - 1);
        expect(getTransferMock).toHaveBeenLastCalledWith('7');
      }
    } finally {
      unmount();
      focusManager.setFocused(undefined);
    }
  });
});
