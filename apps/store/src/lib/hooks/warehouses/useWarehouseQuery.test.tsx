import { renderHook, waitFor } from '@testing-library/react';
import { getWarehouse } from '@/lib/client/api/warehouses';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useWarehouseQuery } from './useWarehouseQuery';

vi.mock('@/lib/client/api/warehouses', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/client/api/warehouses')
  >('@/lib/client/api/warehouses');

  return {
    ...actual,
    getWarehouse: vi.fn(),
  };
});

const getWarehouseMock = vi.mocked(getWarehouse);

const warehouse = {
  id: 1,
  code: 'WH-001',
  name: 'Main Warehouse',
  address: '123 Commerce Ave',
  comment: 'Primary stock location',
};

describe('warehouse query', () => {
  beforeEach(() => {
    getWarehouseMock.mockReset();
  });

  it('returns warehouse details by id', async () => {
    getWarehouseMock.mockResolvedValue({ ok: true, data: warehouse });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useWarehouseQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(warehouse);
    expect(getWarehouseMock).toHaveBeenCalledWith('1');
  });

  it('reads hydrated warehouse details without a client request', async () => {
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    queryClient.setQueryData(warehousesQueryKeys.detail('1'), warehouse);

    const { result } = renderHook(() => useWarehouseQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(warehouse);
    expect(getWarehouseMock).not.toHaveBeenCalled();
  });

  it('exposes a warehouse request error without retrying', async () => {
    const error = { status: 404, message: 'Warehouse not found' };

    getWarehouseMock.mockResolvedValue({ ok: false, error });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useWarehouseQuery('1'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getWarehouseMock).toHaveBeenCalledTimes(1);
  });
});
