import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateAttributeValuesDialogTrigger } from './CreateAttributeValuesDialogTrigger';

const { setup } = prepareStoreSetup({
  component: CreateAttributeValuesDialogTrigger,
  props: {
    attributeId: 7,
  },
});

describe('CreateAttributeValuesDialogTrigger', () => {
  it('resets unsaved values when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Value' }));

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const firstValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    await user.type(firstValueField, 'Green');
    await user.click(
      within(dialog).getByRole('button', { name: 'Add attribute value' })
    );
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Add attribute values' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Value' }));

    const reopenedDialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });

    expect(
      within(reopenedDialog).getByRole('textbox', {
        name: 'Attribute value 1',
      })
    ).toHaveValue('');
    expect(
      within(reopenedDialog).queryByRole('textbox', {
        name: 'Attribute value 2',
      })
    ).not.toBeInTheDocument();
  });
});
