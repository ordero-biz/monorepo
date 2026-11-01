import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateWarehouseDialogTrigger } from './CreateWarehouseDialogTrigger';

const { setup } = prepareStoreSetup({
  component: CreateWarehouseDialogTrigger,
});

describe('CreateWarehouseDialogTrigger', () => {
  it('opens the add warehouse dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Warehouse' }));

    expect(screen.getByRole('dialog', { name: 'Add warehouse' })).toBeVisible();
  });

  it('resets unsaved fields when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Warehouse' }));

    const dialog = screen.getByRole('dialog', { name: 'Add warehouse' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.type(nameField, 'Main Warehouse');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Add warehouse' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Warehouse' }));

    expect(
      within(screen.getByRole('dialog', { name: 'Add warehouse' })).getByRole(
        'textbox',
        { name: 'Name' }
      )
    ).toHaveValue('');
  });
});
