import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateAttributeDialog } from './CreateAttributeDialog';

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

  it('adds and removes attribute value rows', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });

    expect(
      within(dialog).queryAllByRole('button', {
        name: /Remove attribute value/i,
      })
    ).toHaveLength(0);

    await user.type(
      within(dialog).getByRole('textbox', { name: 'New attribute value' }),
      'Blue'
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Add attribute value' })
    );

    expect(within(dialog).getByDisplayValue('Blue')).toBeVisible();
    expect(
      within(dialog).getAllByRole('button', { name: /Remove attribute value/i })
    ).toHaveLength(1);

    await user.click(
      within(dialog).getByRole('button', { name: 'Remove attribute value 1' })
    );

    expect(within(dialog).queryByDisplayValue('Blue')).not.toBeInTheDocument();
    expect(
      within(dialog).queryAllByRole('button', {
        name: /Remove attribute value/i,
      })
    ).toHaveLength(0);
  });

  it('requires an attribute name before create is available and closes on submit', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    expect(createButton).toBeDisabled();

    await user.type(within(dialog).getByPlaceholderText('Color'), 'Material');

    expect(createButton).toBeEnabled();

    await user.click(createButton);

    expect(
      screen.queryByRole('dialog', { name: 'Create new attribute' })
    ).not.toBeInTheDocument();
  });
});
