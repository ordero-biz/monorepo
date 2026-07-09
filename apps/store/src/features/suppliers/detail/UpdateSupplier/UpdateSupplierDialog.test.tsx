import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateSupplier } from '@/lib/client/api/suppliers';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateSupplierDialogTrigger } from './UpdateSupplierDialogTrigger';

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
  component: UpdateSupplierDialogTrigger,
  props: {
    onUpdated: vi.fn(),
    supplier,
  },
});

const setupUpdateSupplierDialog = () => {
  const user = userEvent.setup();
  const onUpdated = vi.fn();
  const result = setup({
    onUpdated,
  });

  return {
    ...result,
    onUpdated,
    user,
  };
};

describe('UpdateSupplierDialog', () => {
  beforeEach(() => {
    updateSupplierMock.mockReset();
  });

  it('opens with the current supplier values', async () => {
    const { user } = setupUpdateSupplierDialog();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

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

  it('requires name, email, phone, and address before save is available', async () => {
    const { user } = setupUpdateSupplierDialog();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });
    const emailField = within(dialog).getByRole('textbox', {
      name: 'Email',
    });
    const addressField = within(dialog).getByRole('textbox', {
      name: 'Address',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    expect(saveButton).toBeEnabled();

    await user.clear(emailField);
    await user.type(emailField, 'not-an-email');
    await user.tab();

    expect(
      within(dialog).getByText('Enter a valid supplier email')
    ).toBeVisible();

    await user.clear(addressField);

    expect(saveButton).toBeDisabled();

    await user.type(addressField, '124 Market St');

    expect(saveButton).toBeEnabled();
  });

  it('submits updated values, closes, invalidates the list, and reports success', async () => {
    const { onUpdated, queryClient, user } = setupUpdateSupplierDialog();
    updateSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms Updated',
        email: 'orders.updated@fresh.example',
        phone: '+1 555 0101',
        address: '124 Market St',
        comment: 'Updated supplier',
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });
    const emailField = within(dialog).getByRole('textbox', { name: 'Email' });
    const phoneField = within(dialog).getByRole('textbox', { name: 'Phone' });
    const addressField = within(dialog).getByRole('textbox', {
      name: 'Address',
    });
    const commentField = within(dialog).getByRole('textbox', {
      name: 'Comment',
    });

    await user.clear(nameField);
    await user.type(nameField, ' Fresh Farms Updated ');
    await user.clear(emailField);
    await user.type(emailField, ' orders.updated@fresh.example ');
    await user.clear(phoneField);
    await user.type(phoneField, ' +1 555 0101 ');
    await user.clear(addressField);
    await user.type(addressField, ' 124 Market St ');
    await user.clear(commentField);
    await user.type(commentField, ' Updated supplier ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateSupplierMock).toHaveBeenCalledWith({
      supplierId: 1,
      name: 'Fresh Farms Updated',
      email: 'orders.updated@fresh.example',
      phone: '+1 555 0101',
      address: '124 Market St',
      comment: 'Updated supplier',
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
    expect(
      screen.queryByRole('dialog', { name: 'Edit supplier' })
    ).not.toBeInTheDocument();
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    const { onUpdated, user } = setupUpdateSupplierDialog();
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

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

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
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
