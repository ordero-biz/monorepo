import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateSupplier } from '@/lib/client/api/suppliers';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateSupplierDialog } from './UpdateSupplierDialog';

const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  updateSupplier: vi.fn(),
}));

const updateSupplierMock = vi.mocked(updateSupplier);

const supplier = {
  id: 1,
  name: 'Fresh Farms',
  email: 'orders@fresh.example',
  phone: '+1 555 0100',
  address: '123 Market St',
  comment: 'Preferred produce supplier',
};

const { setup } = prepareStoreSetup({
  component: UpdateSupplierDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
    supplier,
  },
});

describe('UpdateSupplierDialog', () => {
  beforeEach(() => {
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
    updateSupplierMock.mockReset();
  });

  it('opens with the current supplier values', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });

    expect(within(dialog).getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Fresh Farms'
    );
    expect(within(dialog).getByRole('textbox', { name: 'Email' })).toHaveValue(
      'orders@fresh.example'
    );
    expect(within(dialog).getByRole('textbox', { name: 'Phone' })).toHaveValue(
      '+1 555 0100'
    );
    expect(
      within(dialog).getByRole('textbox', { name: 'Address' })
    ).toHaveValue('123 Market St');
    expect(
      within(dialog).getByRole('textbox', { name: 'Comment' })
    ).toHaveValue('Preferred produce supplier');
  });

  it('submits updated values, closes, invalidates caches, and reports success', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms Updated',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, ' Fresh Farms Updated ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateSupplierMock).toHaveBeenCalledWith({
      supplierId: 1,
      name: 'Fresh Farms Updated',
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: suppliersQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: suppliersQueryKeys.detail(1),
    });
    expect(
      await screen.findByRole('dialog', {
        name: 'Supplier Fresh Farms Updated was updated',
      })
    ).toBeVisible();
    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Supplier update failed.',
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated } = setup();

    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });
    const emailField = within(dialog).getByRole('textbox', {
      name: 'Email',
    });

    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await within(dialog).findByText('Supplier email already exists.')
    ).toBeVisible();
    expect(emailField).toHaveAccessibleDescription(
      'Supplier email already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Supplier update failed.' })
    ).toBeVisible();
    expect(screen.getByRole('dialog', { name: 'Edit supplier' })).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
