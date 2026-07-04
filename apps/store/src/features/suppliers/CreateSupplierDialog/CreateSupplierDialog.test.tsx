import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createSupplier } from '@/lib/client/api/suppliers';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateSupplierDialogTrigger } from './CreateSupplierDialogTrigger';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  createSupplier: vi.fn(),
}));

const createSupplierMock = vi.mocked(createSupplier);

const { setup } = prepareStoreSetup({
  component: CreateSupplierDialogTrigger,
});

describe('CreateSupplierDialog', () => {
  beforeEach(() => {
    createSupplierMock.mockReset();
  });

  it('opens the dialog from the add supplier trigger', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: /add supplier/i }));

    expect(screen.getByRole('dialog', { name: 'Add supplier' })).toBeVisible();
  });

  it('requires name, email, phone, and address before add is available', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: /add supplier/i }));

    const dialog = screen.getByRole('dialog', { name: 'Add supplier' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const emailField = within(dialog).getByRole('textbox', {
      name: 'Email',
    });
    const phoneField = within(dialog).getByRole('textbox', {
      name: 'Phone',
    });
    const addressField = within(dialog).getByRole('textbox', {
      name: 'Address',
    });
    const addButton = within(dialog).getByRole('button', { name: 'Add' });

    expect(addButton).toBeDisabled();

    await user.type(nameField, 'Fresh Farms');
    await user.type(emailField, 'not-an-email');
    await user.tab();

    expect(
      within(dialog).getByText('Enter a valid supplier email')
    ).toBeVisible();
    expect(addButton).toBeDisabled();

    await user.clear(emailField);
    await user.type(emailField, 'orders@fresh.example');
    await user.type(phoneField, '+1 555 0100');
    await user.type(addressField, '   ');
    await user.tab();

    expect(
      within(dialog).getByText('Supplier address is required')
    ).toBeVisible();
    expect(addButton).toBeDisabled();

    await user.clear(addressField);
    await user.type(addressField, '123 Market St');

    expect(addButton).toBeEnabled();
  });

  it('closes on submit, resets the form, and invalidates the list', async () => {
    const user = userEvent.setup();
    createSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      },
    });

    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: /add supplier/i }));

    const dialog = screen.getByRole('dialog', { name: 'Add supplier' });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      ' Fresh Farms '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Email' }),
      ' orders@fresh.example '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Phone' }),
      ' +1 555 0100 '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Address' }),
      ' 123 Market St '
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Comment' }),
      ' Preferred produce supplier '
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createSupplierMock).toHaveBeenCalledWith({
      name: 'Fresh Farms',
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
    expect(
      screen.queryByRole('dialog', { name: 'Add supplier' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add supplier/i }));

    const reopenedDialog = screen.getByRole('dialog', {
      name: 'Add supplier',
    });

    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Name' })
    ).toHaveValue('');
    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Email' })
    ).toHaveValue('');
    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Phone' })
    ).toHaveValue('');
    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Address' })
    ).toHaveValue('');
    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Comment' })
    ).toHaveValue('');
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    const user = userEvent.setup();
    createSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Supplier creation failed.',
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
      },
    });

    setup();

    await user.click(screen.getByRole('button', { name: /add supplier/i }));

    const dialog = screen.getByRole('dialog', { name: 'Add supplier' });
    const emailField = within(dialog).getByRole('textbox', {
      name: 'Email',
    });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Fresh Farms'
    );
    await user.type(emailField, 'orders@fresh.example');
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Phone' }),
      '+1 555 0100'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Address' }),
      '123 Market St'
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createSupplierMock).toHaveBeenCalledWith({
      name: 'Fresh Farms',
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: '',
    });
    expect(
      await within(dialog).findByText('Supplier email already exists.')
    ).toBeVisible();
    expect(emailField).toHaveAccessibleDescription(
      'Supplier email already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Supplier creation failed.' })
    ).toBeVisible();
    expect(screen.getByRole('dialog', { name: 'Add supplier' })).toBeVisible();
  });
});
