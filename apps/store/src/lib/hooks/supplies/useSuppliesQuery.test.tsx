import { renderHook, waitFor } from '@testing-library/react';
import { getSupplies } from '@/lib/client/api/supplies';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSuppliesQuery } from './useSuppliesQuery';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  getSupplies: vi.fn(),
}));

const getSuppliesMock = vi.mocked(getSupplies);

describe('useSuppliesQuery', () => {
  beforeEach(() => {
    getSuppliesMock.mockReset();
  });

  it('returns paginated supplies and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 10 };
    const supplies = {
      content: [],
      page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
    };
    getSuppliesMock.mockResolvedValue({ ok: true, data: supplies });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useSuppliesQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(supplies);

    rerender();

    expect(getSuppliesMock).toHaveBeenCalledTimes(1);
    expect(getSuppliesMock).toHaveBeenCalledWith(paginationInput);
  });
});
