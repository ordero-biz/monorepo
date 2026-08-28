import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateWarehouse } from '@/lib/client/api/warehouses';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import type { Warehouse } from '@/lib/domain/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateWarehouseDialog } from './ActivateWarehouseDialog';

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  updateWarehouse: vi.fn(),
}));

const updateWarehouseMock = vi.mocked(updateWarehouse);
const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

const warehouse: Warehouse = {
  id: 1,
  name: 'Main Warehouse',
  status: WAREHOUSE_STATUS.DRAFT,
  address: '123 Commerce Ave',
  comment: 'Primary stock location',
};

const { setup } = prepareStoreSetup({
  component: ActivateWarehouseDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
    warehouse,
  },
});

describe('ActivateWarehouseDialog', () => {
  beforeEach(() => {
    updateWarehouseMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('publishes the warehouse, invalidates caches, and closes on confirm', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: true,
      data: {
        ...warehouse,
        status: WAREHOUSE_STATUS.ACTIVE,
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(updateWarehouseMock).toHaveBeenCalledWith({
      warehouseId: 1,
      status: WAREHOUSE_STATUS.ACTIVE,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: warehousesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.detail(1),
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onUpdatedMock).toHaveBeenCalled();
  });

  it('disables publish and cancel while the request is pending', async () => {
    let resolveUpdate:
      | ((value: Awaited<ReturnType<typeof updateWarehouse>>) => void)
      | undefined;
    updateWarehouseMock.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const publishButton = screen.getByRole('button', { name: 'Publish' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(publishButton);

    expect(publishButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publishing...' })).toBeVisible();

    resolveUpdate?.({
      ok: true,
      data: {
        ...warehouse,
        status: WAREHOUSE_STATUS.ACTIVE,
      },
    });

    await screen.findByRole('button', { name: 'Publish' });
  });

  it('shows the mapped error and keeps the dialog open when publishing fails', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.WAREHOUSE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Cannot edit name or status of an active warehouse',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Publish warehouse' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
    expect(onUpdatedMock).not.toHaveBeenCalled();
  });
});
