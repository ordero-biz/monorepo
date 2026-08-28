import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateWarehouseDialogTrigger } from './UpdateWarehouseDialogTrigger';

const { setup } = prepareStoreSetup({
  component: UpdateWarehouseDialogTrigger,
  props: {
    onUpdated: vi.fn(),
    warehouse: {
      id: 1,
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    },
  },
});

describe('UpdateWarehouseDialogTrigger', () => {
  it('opens the warehouse update dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Edit Main Warehouse' })
    );

    expect(
      screen.getByRole('dialog', { name: 'Edit warehouse' })
    ).toBeVisible();
  });

  it('resets unsaved fields when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Edit Main Warehouse' })
    );

    const dialog = screen.getByRole('dialog', { name: 'Edit warehouse' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Central Warehouse');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Edit warehouse' })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Edit Main Warehouse' })
    );

    expect(
      within(screen.getByRole('dialog', { name: 'Edit warehouse' })).getByRole(
        'textbox',
        { name: 'Name' }
      )
    ).toHaveValue('Main Warehouse');
  });
});
