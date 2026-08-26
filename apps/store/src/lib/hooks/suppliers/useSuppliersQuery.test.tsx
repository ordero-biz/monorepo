import { renderHook, waitFor } from '@testing-library/react';
import { getSuppliers } from '@/lib/client/api/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSuppliersQuery } from './useSuppliersQuery';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  getSuppliers: vi.fn(),
}));

const getSuppliersMock = vi.mocked(getSuppliers);

describe('useSuppliersQuery', () => {
  beforeEach(() => {
    getSuppliersMock.mockReset();
  });

  it('returns paginated suppliers and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 1 };
    const suppliers = {
      content: [
        {
          id: 1,
          name: 'Fresh Farms',
          status: SUPPLIER_STATUS.DRAFT,
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        },
      ],
      page: { size: 1, number: 1, totalElements: 2, totalPages: 2 },
    };
    getSuppliersMock.mockResolvedValue({ ok: true, data: suppliers });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useSuppliersQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(suppliers);

    rerender();

    expect(getSuppliersMock).toHaveBeenCalledTimes(1);
    expect(getSuppliersMock).toHaveBeenCalledWith(paginationInput);
  });

  it('exposes a normalized request error without retrying', async () => {
    const error = { status: 500, message: 'Could not load suppliers.' };
    getSuppliersMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSuppliersQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getSuppliersMock).toHaveBeenCalledTimes(1);
  });
});
