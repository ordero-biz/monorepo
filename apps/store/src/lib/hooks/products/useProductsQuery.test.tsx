import { renderHook, waitFor } from '@testing-library/react';
import { getProducts } from '@/lib/client/api/products';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useProductsQuery } from './useProductsQuery';

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  getProducts: vi.fn(),
}));

const getProductsMock = vi.mocked(getProducts);

describe('useProductsQuery', () => {
  beforeEach(() => {
    getProductsMock.mockReset();
  });

  it('returns paginated products and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 1 };
    const products = {
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
    getProductsMock.mockResolvedValue({ ok: true, data: products });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useProductsQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(products);

    rerender();

    expect(getProductsMock).toHaveBeenCalledTimes(1);
    expect(getProductsMock).toHaveBeenCalledWith(paginationInput);
  });

  it('exposes a normalized request error without retrying', async () => {
    const error = { status: 500, message: 'Could not load products.' };
    getProductsMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useProductsQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getProductsMock).toHaveBeenCalledTimes(1);
  });
});
