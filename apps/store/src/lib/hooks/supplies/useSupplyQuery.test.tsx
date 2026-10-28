import { focusManager } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { getSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSupplyQuery } from './useSupplyQuery';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  getSupply: vi.fn(),
}));

const supply = {
  comment: null,
  completedAt: null,
  completedBy: null,
  supplyNumber: 'SUP-001',
  supplierInvoiceNumber: null,
  createdAt: '2026-10-28T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-10-28T10:00:00Z',
  updatedBy: 'owner@example.test',

  id: 7,
  supplier: { id: 2, name: 'Fresh Farms', status: 'ACTIVE' },
  warehouse: { id: 3, name: 'Main warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,

  totalPrice: 0,
  supplyEntries: [],
  version: 1,
} satisfies SupplyDetails;

const getSupplyMock = vi.mocked(getSupply);

describe('supply detail query', () => {
  beforeEach(() => {
    getSupplyMock.mockReset();
  });

  it('loads a saved supply by id', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSupplyQuery('7'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(supply);
    expect(getSupplyMock).toHaveBeenCalledWith('7');
  });

  it('uses prefetched supply detail without another client request', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(suppliesQueryKeys.detail(7), supply);
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSupplyQuery('7'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(supply);
    expect(getSupplyMock).not.toHaveBeenCalled();
  });

  it('refetches on every return to the tab even while the cached supply is fresh', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(suppliesQueryKeys.detail(7), supply);
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, unmount } = renderHook(() => useSupplyQuery('7'), {
      wrapper: TestQueryProvider,
    });

    try {
      expect(result.current.data).toEqual(supply);
      expect(getSupplyMock).not.toHaveBeenCalled();

      for (const version of [2, 3]) {
        const latest = { ...supply, version };
        getSupplyMock.mockResolvedValue({ ok: true, data: latest });
        expect(result.current.isStale).toBe(false);

        act(() => {
          focusManager.setFocused(false);
          focusManager.setFocused(true);
        });

        await waitFor(() => expect(result.current.data).toEqual(latest));
        expect(getSupplyMock).toHaveBeenCalledTimes(version - 1);
        expect(getSupplyMock).toHaveBeenLastCalledWith('7');
      }
    } finally {
      unmount();
      focusManager.setFocused(undefined);
    }
  });
});
