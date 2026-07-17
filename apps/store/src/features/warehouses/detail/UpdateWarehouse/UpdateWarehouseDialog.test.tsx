import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateWarehouse } from '@/lib/client/api/warehouses';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateWarehouseDialog } from './UpdateWarehouseDialog';

const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  updateWarehouse: vi.fn(),
}));

const updateWarehouseMock = vi.mocked(updateWarehouse);

const warehouse = {
  id: 1,
  code: 'WH-001',
  name: 'Main Warehouse',
  address: '123 Commerce Ave',
  comment: 'Primary stock location',
};

const { setup } = prepareStoreSetup({
  component: UpdateWarehouseDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
    warehouse,
  },
});

describe('UpdateWarehouseDialog', () => {
  beforeEach(() => {
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
    updateWarehouseMock.mockReset();
  });

  it('submits changes, closes, and refreshes warehouse caches', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: true,
      data: { ...warehouse, name: 'Updated Warehouse' },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', { name: 'Edit warehouse' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, ' Updated Warehouse ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateWarehouseMock).toHaveBeenCalledWith({
      warehouseId: 1,
      code: 'WH-001',
      name: 'Updated Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: warehousesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.detail(1),
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onUpdated).toHaveBeenCalled();
  });

  it('shows backend field errors and keeps the dialog open', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Warehouse update failed.',
        fieldErrors: { code: 'Warehouse code already exists.' },
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated } = setup();
    const dialog = screen.getByRole('dialog', { name: 'Edit warehouse' });

    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await within(dialog).findByText('Warehouse code already exists.')
    ).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
