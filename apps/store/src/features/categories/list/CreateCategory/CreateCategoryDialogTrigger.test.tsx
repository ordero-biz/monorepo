import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateCategoryDialogTrigger } from './CreateCategoryDialogTrigger';

const { setup } = prepareStoreSetup({
  component: CreateCategoryDialogTrigger,
  props: {
    availableCategories: [
      {
        id: 1,
        name: 'Shoes',
        sortOrder: 10,
        color: '#2563eb',
        createdAt: '2026-07-01T10:54:34.839Z',
      },
    ],
  },
});

describe('CreateCategoryDialogTrigger', () => {
  it('opens the create category dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Create Category' }));

    expect(
      screen.getByRole('dialog', { name: 'Create new category' })
    ).toBeVisible();
  });

  it('resets unsaved fields when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Create Category' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new category' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.type(nameField, 'Sneakers');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Create new category' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create Category' }));

    const reopenedDialog = screen.getByRole('dialog', {
      name: 'Create new category',
    });

    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Name' })
    ).toHaveValue('');
  });
});
