import { renderHook, waitFor } from '@testing-library/react';
import { getProductGroups } from '@/lib/client/api/products';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useProductGroupsQuery } from './useProductGroupsQuery';

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  getProductGroups: vi.fn(),
}));

const getProductGroupsMock = vi.mocked(getProductGroups);

describe('useProductGroupsQuery', () => {
  beforeEach(() => {
    getProductGroupsMock.mockReset();
  });

  it('returns paginated product groups and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 1 };
    const productGroups = {
      content: [
        {
          id: 1,
          name: 'Canvas Tote',
          description: 'Reusable bag',
          createdAt: '2026-07-01T10:54:34.839Z',
          category: {
            id: 2,
            name: 'Bags',
            createdAt: '2026-07-01T10:54:34.839Z',
          },
        },
      ],
      page: { size: 1, number: 1, totalElements: 2, totalPages: 2 },
    };
    getProductGroupsMock.mockResolvedValue({ ok: true, data: productGroups });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useProductGroupsQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(productGroups);

    rerender();

    expect(getProductGroupsMock).toHaveBeenCalledTimes(1);
    expect(getProductGroupsMock).toHaveBeenCalledWith(paginationInput);
  });

  it('exposes a normalized request error without retrying', async () => {
    const error = {
      status: 500,
      message: 'Could not load product groups.',
    };
    getProductGroupsMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useProductGroupsQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getProductGroupsMock).toHaveBeenCalledTimes(1);
  });
});
