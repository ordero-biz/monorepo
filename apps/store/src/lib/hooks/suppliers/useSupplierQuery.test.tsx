import { renderHook, waitFor } from '@testing-library/react';
import { getSupplier } from '@/lib/client/api/suppliers';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSupplierQuery } from './useSupplierQuery';

vi.mock('@/lib/client/api/suppliers', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/client/api/suppliers')
  >('@/lib/client/api/suppliers');

  return {
    ...actual,
    getSupplier: vi.fn(),
  };
});

const getSupplierMock = vi.mocked(getSupplier);

describe('supplier query', () => {
  beforeEach(() => {
    getSupplierMock.mockReset();
  });

  it('returns a supplier detail by id', async () => {
    const supplier = {
      id: 1,
      name: 'Fresh Farms',
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    };

    getSupplierMock.mockResolvedValue({
      ok: true,
      data: supplier,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSupplierQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(supplier);
    expect(getSupplierMock).toHaveBeenCalledWith('1');
  });

  it('reads hydrated supplier detail from the cache without a client request', async () => {
    const supplier = {
      id: 1,
      name: 'Fresh Farms',
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    queryClient.setQueryData(suppliersQueryKeys.detail('1'), supplier);

    const { result } = renderHook(() => useSupplierQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(supplier);
    expect(getSupplierMock).not.toHaveBeenCalled();
  });

  it('exposes the supplier detail request error without retrying', async () => {
    const error = {
      status: 404,
      message: 'Supplier not found',
    };

    getSupplierMock.mockResolvedValue({
      ok: false,
      error,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSupplierQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getSupplierMock).toHaveBeenCalledTimes(1);
  });
});
