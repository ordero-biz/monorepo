import { renderHook, waitFor } from '@testing-library/react';
import { getWarehouses } from '@/lib/client/api/warehouses';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useWarehousesQuery } from './useWarehousesQuery';

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouses: vi.fn(),
}));

const getWarehousesMock = vi.mocked(getWarehouses);

describe('useWarehousesQuery', () => {
  beforeEach(() => {
    getWarehousesMock.mockReset();
  });

  it('returns paginated warehouses and reuses fresh cached data', async () => {
    const paginationInput = { page: 1, size: 1 };
    const warehouses = {
      content: [
        {
          id: 1,
          code: 'WH-001',
          name: 'Main Warehouse',
          address: '123 Commerce Ave',
          comment: 'Primary stock location',
        },
      ],
      page: { size: 1, number: 1, totalElements: 2, totalPages: 2 },
    };
    getWarehousesMock.mockResolvedValue({ ok: true, data: warehouses });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(
      () => useWarehousesQuery(paginationInput),
      { wrapper: TestQueryProvider }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(warehouses);

    rerender();

    expect(getWarehousesMock).toHaveBeenCalledTimes(1);
    expect(getWarehousesMock).toHaveBeenCalledWith(paginationInput);
  });

  it('exposes a normalized request error without retrying', async () => {
    const error = { status: 500, message: 'Could not load warehouses.' };
    getWarehousesMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useWarehousesQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getWarehousesMock).toHaveBeenCalledTimes(1);
  });
});
