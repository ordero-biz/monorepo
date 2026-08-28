import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateWarehouse } from '@/lib/client/api/warehouses';
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
const warehouse = {
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
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
    updateWarehouseMock.mockReset();
  });

  it('publishes the warehouse, refreshes caches, and closes the dialog', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: true,
      data: { ...warehouse, status: WAREHOUSE_STATUS.ACTIVE },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    await waitFor(() =>
      expect(updateWarehouseMock).toHaveBeenCalledWith({
        warehouseId: 1,
        status: WAREHOUSE_STATUS.ACTIVE,
      })
    );
    await waitFor(() => expect(onUpdatedMock).toHaveBeenCalled());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.list,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.detail(1),
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
