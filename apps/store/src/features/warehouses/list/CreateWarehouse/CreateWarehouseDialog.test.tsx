import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWarehouse } from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
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

  it('keeps the action enabled and validates required fields on submit', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });
    const addButton = within(dialog).getByRole('button', {
      name: 'Save draft',
    });

    expect(addButton).toBeEnabled();
    await user.click(addButton);

    expect(
      await within(dialog).findByText('Warehouse name is required')
    ).toBeVisible();
    expect(createWarehouseMock).not.toHaveBeenCalled();
  });

  it('defaults to Draft and changes the action when Active is selected', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });

    expect(
      within(dialog).getByRole('radio', { name: /^Draft\b/ })
    ).toBeChecked();
    expect(
      within(dialog).getByRole('button', { name: 'Save draft' })
    ).toBeVisible();

    await user.click(within(dialog).getByRole('radio', { name: /^Active\b/ }));

    expect(
      within(dialog).getByRole('button', { name: 'Publish' })
    ).toBeVisible();
  });

  it('explains the effects of each warehouse status', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });

    expect(
      within(dialog).getByText(
        'Editable only. Cannot be used in supplies or tracked in analytics. Can be activated later'
      )
    ).toBeVisible();
    expect(
      within(dialog).getByText(
        'Fully functional. Can be used in supplies and tracked in analytics. Name and status cannot be edited after publishing'
      )
    ).toBeVisible();
  });

  it('creates a warehouse, closes the dialog, and invalidates the list', async () => {
    const user = userEvent.setup();
    createWarehouseMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
      },
    });

    const { onOpenChange, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });

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
    await user.click(within(dialog).getByRole('radio', { name: /^Active\b/ }));
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }));

    expect(createWarehouseMock).toHaveBeenCalledWith({
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
      status: WAREHOUSE_STATUS.ACTIVE,
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
          name: 'Warehouse name already exists.',
        },
      },
    });

    const { onOpenChange } = setup();

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Main Warehouse'
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Save draft' })
    );

    expect(createWarehouseMock).toHaveBeenCalledWith({
      name: 'Main Warehouse',
      comment: '',
      status: WAREHOUSE_STATUS.DRAFT,
    });
    expect(
      await within(dialog).findByText('Warehouse name already exists.')
    ).toBeVisible();
    expect(
      within(dialog).getByRole('textbox', { name: 'Name' })
    ).toHaveAccessibleDescription('Warehouse name already exists.');
    expect(
      await screen.findByRole('dialog', { name: 'Warehouse creation failed.' })
    ).toBeVisible();
    expect(screen.getByRole('dialog', { name: 'Add warehouse' })).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
