import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateAttributeDialog } from '@/features/attributes';
import { prepareStoreSetup } from '@/test/prepareSetup';

const { setup } = prepareStoreSetup({
  component: CreateAttributeDialog,
});

describe('CreateAttributeDialog', () => {
  it('opens the dialog from the create attribute trigger', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    expect(
      screen.getByRole('dialog', { name: 'Create new attribute' })
    ).toBeVisible();
  });

  it('requires a valid attribute name before create is available', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    expect(createButton).toBeDisabled();

    await user.type(nameField, 'abc');
    await user.tab();

    expect(
      within(dialog).getByText(
        'Attribute name must contain at least 4 characters.'
      )
    ).toBeVisible();
    expect(createButton).toBeDisabled();

    await user.clear(nameField);
    await user.type(nameField, 'Material');

    expect(createButton).toBeEnabled();
  });

  it('closes on submit and resets the form', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    await user.type(nameField, 'Material');

    await user.click(createButton);

    expect(
      screen.queryByRole('dialog', { name: 'Create new attribute' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const reopenedDialog = screen.getByRole('dialog', {
      name: 'Create new attribute',
    });

    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Attribute name' })
    ).toHaveValue('');
  });
});
