import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateSupplierDialogTrigger } from './CreateSupplierDialogTrigger';

const { setup } = prepareStoreSetup({
  component: CreateSupplierDialogTrigger,
});

describe('CreateSupplierDialogTrigger', () => {
  it('opens the add supplier dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Supplier' }));

    expect(screen.getByRole('dialog', { name: 'Add supplier' })).toBeVisible();
  });

  it('resets unsaved fields when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Supplier' }));

    const dialog = screen.getByRole('dialog', { name: 'Add supplier' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.type(nameField, 'Fresh Farms');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Add supplier' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Supplier' }));

    expect(
      within(screen.getByRole('dialog', { name: 'Add supplier' })).getByRole(
        'textbox',
        { name: 'Name' }
      )
    ).toHaveValue('');
  });
});
