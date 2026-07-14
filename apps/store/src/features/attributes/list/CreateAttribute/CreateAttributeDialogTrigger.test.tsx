import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateAttributeDialogTrigger } from './CreateAttributeDialogTrigger';

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const { setup } = prepareStoreSetup({
  component: CreateAttributeDialogTrigger,
});

describe('CreateAttributeDialogTrigger', () => {
  it('opens the create attribute dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Attribute' }));

    expect(
      screen.getByRole('dialog', { name: 'Add new attribute' })
    ).toBeVisible();
  });

  it('resets unsaved fields when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Add new attribute' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });
    const firstValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    await user.type(nameField, 'Material');
    await user.type(firstValueField, 'Green');
    await user.click(
      within(dialog).getByRole('button', { name: 'Add attribute value' })
    );
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Add new attribute' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Attribute' }));

    const reopenedDialog = screen.getByRole('dialog', {
      name: 'Add new attribute',
    });

    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Name' })
    ).toHaveValue('');
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
