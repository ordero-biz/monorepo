import { renderHook, waitFor } from '@testing-library/react';
import { getProductVariants } from '@/lib/client/api/products';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useProductVariantsQuery } from './useProductVariantsQuery';

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  getProductVariants: vi.fn(),
}));

const getProductVariantsMock = vi.mocked(getProductVariants);

describe('useProductVariantsQuery', () => {
  beforeEach(() => {
    getProductVariantsMock.mockReset();
  });

  it('returns paginated product variants and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 1 };
    const productVariants = {
      content: [
        {
          id: 7,
          name: 'Canvas Tote / Black',
          description: 'Reusable bag',
          sku: 'TOTE-BLK',
          barcode: '1234567890',
          createdAt: '2026-07-20T18:23:01.675Z',
          productVariantAttributeValues: [],
        },
      ],
      page: { size: 1, number: 1, totalElements: 2, totalPages: 2 },
    };
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: productVariants,
    });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useProductVariantsQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(productVariants);

    rerender();

    expect(getProductVariantsMock).toHaveBeenCalledTimes(1);
    expect(getProductVariantsMock).toHaveBeenCalledWith(paginationInput);
  });

  it('exposes a normalized request error without retrying', async () => {
    const error = {
      status: 500,
      message: 'Could not load product variants.',
    };
    getProductVariantsMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useProductVariantsQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getProductVariantsMock).toHaveBeenCalledTimes(1);
  });

  it('does not request product variants while disabled', () => {
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(
      () => useProductVariantsQuery(undefined, { enabled: false }),
      { wrapper: TestQueryProvider }
    );

    expect(result.current.fetchStatus).toBe('idle');
    expect(getProductVariantsMock).not.toHaveBeenCalled();
  });
});
