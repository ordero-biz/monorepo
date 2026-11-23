import { renderHook, waitFor } from '@testing-library/react';
import { getTransfers } from '@/lib/client/api/transfers';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useTransfersQuery } from './useTransfersQuery';

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  getTransfers: vi.fn(),
}));

const getTransfersMock = vi.mocked(getTransfers);

describe('useTransfersQuery', () => {
  beforeEach(() => {
    getTransfersMock.mockReset();
  });

  it('returns paginated transfers and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 10 };
    const transfers = {
      content: [],
      page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
    };
    getTransfersMock.mockResolvedValue({ ok: true, data: transfers });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useTransfersQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(transfers);

    rerender();

    expect(getTransfersMock).toHaveBeenCalledTimes(1);
    expect(getTransfersMock).toHaveBeenCalledWith(paginationInput);
  });
});
