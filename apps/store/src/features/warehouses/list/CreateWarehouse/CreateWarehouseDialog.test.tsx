import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWarehouse } from '@/lib/client/api/warehouses';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateWarehouseDialog } from './CreateWarehouseDialog';

const onOpenChangeMock = vi.fn();

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  createWarehouse: vi.fn(),
}));

const createWarehouseMock = vi.mocked(createWarehouse);

const { setup } = prepareStoreSetup({
  component: CreateWarehouseDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('CreateWarehouseDialog', () => {
  beforeEach(() => {
    createWarehouseMock.mockReset();
    onOpenChangeMock.mockClear();
  });

  it('requires code, name, and address before add is available', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });
    const codeField = within(dialog).getByRole('textbox', {
      name: 'Code',
    });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const addressField = within(dialog).getByRole('textbox', {
      name: 'Address',
    });
    const addButton = within(dialog).getByRole('button', { name: 'Add' });

    expect(addButton).toBeDisabled();

    await user.type(codeField, 'WH-001');
    await user.type(nameField, 'Main Warehouse');
    expect(addButton).toBeDisabled();

    await user.type(addressField, '   ');
    await user.tab();

    expect(
      within(dialog).getByText('Warehouse address is required')
    ).toBeVisible();
    expect(addButton).toBeDisabled();

    await user.clear(addressField);
    await user.type(addressField, '123 Commerce Ave');

    expect(addButton).toBeEnabled();
  });

  it('creates a warehouse, closes the dialog, and invalidates the list', async () => {
    const user = userEvent.setup();
    createWarehouseMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        code: 'WH-001',
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
      },
    });

    const { onOpenChange, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Code' }),
      ' WH-001 '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      ' Main Warehouse '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Address' }),
      ' 123 Commerce Ave '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Comment' }),
      ' Primary stock location '
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createWarehouseMock).toHaveBeenCalledWith({
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: warehousesQueryKeys.list,
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    const user = userEvent.setup();
    createWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Warehouse creation failed.',
        fieldErrors: {
          code: 'Warehouse code already exists.',
        },
      },
    });

    const { onOpenChange } = setup();

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });
    const codeField = within(dialog).getByRole('textbox', {
      name: 'Code',
    });

    await user.type(codeField, 'WH-001');
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Main Warehouse'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Address' }),
      '123 Commerce Ave'
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createWarehouseMock).toHaveBeenCalledWith({
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: '',
    });
    expect(
      await within(dialog).findByText('Warehouse code already exists.')
    ).toBeVisible();
    expect(codeField).toHaveAccessibleDescription(
      'Warehouse code already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Warehouse creation failed.' })
    ).toBeVisible();
    expect(screen.getByRole('dialog', { name: 'Add warehouse' })).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
