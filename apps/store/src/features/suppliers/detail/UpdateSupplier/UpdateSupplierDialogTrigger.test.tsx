import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateSupplier } from '@/lib/client/api/suppliers';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateSupplierDialogTrigger } from './UpdateSupplierDialogTrigger';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  updateSupplier: vi.fn(),
}));

const updateSupplierMock = vi.mocked(updateSupplier);

const { setup } = prepareStoreSetup({
  component: UpdateSupplierDialogTrigger,
  props: {
    onUpdated: vi.fn(),
    supplier: {
      id: 1,
      name: 'Fresh Farms',
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    },
  },
});

describe('UpdateSupplierDialogTrigger', () => {
  beforeEach(() => {
    updateSupplierMock.mockReset();
  });

  it('opens the supplier update dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    expect(screen.getByRole('dialog', { name: 'Edit supplier' })).toBeVisible();
  });

  it('resets unsaved fields when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Fresh Farms Updated');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Edit supplier' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    expect(
      within(screen.getByRole('dialog', { name: 'Edit supplier' })).getByRole(
        'textbox',
        { name: 'Name' }
      )
    ).toHaveValue('Fresh Farms');
  });

  it('uses the saved values when the dialog is reopened after an update', async () => {
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
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, ' Fresh Farms Updated ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Supplier Fresh Farms Updated was updated')
    ).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Edit supplier' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    expect(
      within(screen.getByRole('dialog', { name: 'Edit supplier' })).getByRole(
        'textbox',
        { name: 'Name' }
      )
    ).toHaveValue('Fresh Farms Updated');
  });
});
