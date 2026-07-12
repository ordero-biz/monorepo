import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createSupplier } from '@/lib/client/api/suppliers';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateSupplierDialog } from './CreateSupplierDialog';

const onOpenChangeMock = vi.fn();

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  createSupplier: vi.fn(),
}));

const createSupplierMock = vi.mocked(createSupplier);

const { setup } = prepareStoreSetup({
  component: CreateSupplierDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('CreateSupplierDialog', () => {
  beforeEach(() => {
    createSupplierMock.mockReset();
    onOpenChangeMock.mockClear();
  });

  it('creates a supplier, closes the dialog, and invalidates the list', async () => {
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
    const user = userEvent.setup();
    const { onOpenChange, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
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
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
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
    const user = userEvent.setup();
    const { onOpenChange } = setup();

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
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
