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
    const updatedWarehouse = {
      ...warehouse,
      name: 'Central Warehouse',
    };
    updateWarehouseMock.mockResolvedValue({
      ok: true,
      data: updatedWarehouse,
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated, queryClient, renderResult } = setup();
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

    renderResult.rerender({ open: false });
    renderResult.rerender({ open: true, warehouse: updatedWarehouse });

    expect(
      screen.getByRole('textbox', { name: 'Name' })
    ).toHaveValue('Central Warehouse');
  });

  it('reveals required errors after blur and clears them while correcting input', async () => {
    const user = userEvent.setup();
    setup();
    const dialog = screen.getByRole('dialog', { name: 'Edit warehouse' });
    const codeField = within(dialog).getByRole('textbox', { name: 'Code' });

    await user.clear(codeField);

    expect(
      within(dialog).queryByText('Warehouse code is required')
    ).not.toBeInTheDocument();

    await user.tab();

    expect(
      await within(dialog).findByText('Warehouse code is required')
    ).toBeVisible();

    await user.click(codeField);
    await user.type(codeField, 'WH-001');

    await waitFor(() =>
      expect(
        within(dialog).queryByText('Warehouse code is required')
      ).not.toBeInTheDocument()
    );
  });

  it('discards unsaved changes after closing and reopening', async () => {
    const user = userEvent.setup();
    const { onOpenChange, renderResult } = setup();
    const dialog = screen.getByRole('dialog', { name: 'Edit warehouse' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Unsaved warehouse name');
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);

    renderResult.rerender({ open: false });
    renderResult.rerender({ open: true });

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Main Warehouse'
    );
  });

  it('disables another save while the update is in flight', async () => {
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

    const dialog = screen.getByRole('dialog', { name: 'Edit warehouse' });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeVisible();

    resolveUpdate?.({ ok: true, data: warehouse });

    await screen.findByRole('button', { name: 'Save' });
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
    const codeField = within(dialog).getByRole('textbox', { name: 'Code' });

    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await within(dialog).findByText('Warehouse code already exists.')
    ).toBeVisible();
    expect(codeField).toHaveAccessibleDescription(
      'Warehouse code already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Warehouse update failed.' })
    ).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
