import { act, renderHook, waitFor } from '@testing-library/react';
import { updateWarehouse } from '@/lib/client/api/warehouses';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useActivateWarehouse } from './useActivateWarehouse';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  updateWarehouse: vi.fn(),
}));

const updateWarehouseMock = vi.mocked(updateWarehouse);

const setupActivateWarehouseHook = () => {
  const onActivated = vi.fn();
  const queryClient = createTestQueryClient();
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const TestQueryProvider = createTestQueryProvider(queryClient);
  const { result } = renderHook(
    () =>
      useActivateWarehouse({
        onActivated,
        warehouseId: 1,
        warehouseName: 'Main Warehouse',
      }),
    {
      wrapper: TestQueryProvider,
    }
  );

  return {
    invalidateQueriesSpy,
    onActivated,
    result,
  };
};

describe('useActivateWarehouse', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    updateWarehouseMock.mockReset();
  });

  it('publishes the warehouse, invalidates queries, and reports success', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Main Warehouse',
        status: WAREHOUSE_STATUS.ACTIVE,
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
      },
    });
    const { invalidateQueriesSpy, onActivated, result } =
      setupActivateWarehouseHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(updateWarehouseMock).toHaveBeenCalledWith({
        warehouseId: 1,
        status: WAREHOUSE_STATUS.ACTIVE,
      })
    );
    await waitFor(() => expect(onActivated).toHaveBeenCalled());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.list,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.detail(1),
    });
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Warehouse Main Warehouse was published',
      type: 'success',
    });
  });

  it('shows the mapped error and skips success effects when publishing fails', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.WAREHOUSE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const { onActivated, result } = setupActivateWarehouseHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Cannot edit name or status of an active warehouse',
        type: 'error',
      })
    );
    expect(onActivated).not.toHaveBeenCalled();
    expect(result.current.isActivating).toBe(false);
  });
});
