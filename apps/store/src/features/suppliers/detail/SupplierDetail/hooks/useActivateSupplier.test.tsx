import { act, renderHook, waitFor } from '@testing-library/react';
import { updateSupplier } from '@/lib/client/api/suppliers';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useActivateSupplier } from './useActivateSupplier';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  updateSupplier: vi.fn(),
}));

const updateSupplierMock = vi.mocked(updateSupplier);

const setupActivateSupplierHook = () => {
  const onActivated = vi.fn();
  const queryClient = createTestQueryClient();
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const TestQueryProvider = createTestQueryProvider(queryClient);
  const { result } = renderHook(
    () =>
      useActivateSupplier({
        onActivated,
        supplierId: 1,
        supplierName: 'Fresh Farms',
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

describe('useActivateSupplier', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    updateSupplierMock.mockReset();
  });

  it('publishes the supplier, invalidates queries, and reports success', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        status: SUPPLIER_STATUS.ACTIVE,
      },
    });
    const { invalidateQueriesSpy, onActivated, result } =
      setupActivateSupplierHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(updateSupplierMock).toHaveBeenCalledWith({
        supplierId: 1,
        status: SUPPLIER_STATUS.ACTIVE,
      })
    );
    await waitFor(() => expect(onActivated).toHaveBeenCalled());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: suppliersQueryKeys.list,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: suppliersQueryKeys.detail(1),
    });
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Supplier Fresh Farms was published',
      type: 'success',
    });
  });

  it('shows the mapped error and skips success effects when publishing fails', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.SUPPLIER_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const { onActivated, result } = setupActivateSupplierHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Cannot edit name or status of an active supplier',
        type: 'error',
      })
    );
    expect(onActivated).not.toHaveBeenCalled();
    expect(result.current.isActivating).toBe(false);
  });
});
