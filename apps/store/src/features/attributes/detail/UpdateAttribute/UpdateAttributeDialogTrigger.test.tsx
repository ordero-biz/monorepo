import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateAttributeDialogTrigger } from './UpdateAttributeDialogTrigger';

const { setup } = prepareStoreSetup({
  component: UpdateAttributeDialogTrigger,
  props: {
    attribute: {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      createdAt: '2026-06-24T20:07:32.467Z',
    },
    onUpdated: vi.fn(),
  },
});

describe('UpdateAttributeDialogTrigger', () => {
  it('opens the update attribute dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    expect(
      screen.getByRole('dialog', { name: 'Edit Attribute' })
    ).toBeVisible();
  });

  it('resets an unsaved name when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    const nameField = screen.getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, 'Material');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Edit Attribute' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    expect(screen.getByRole('textbox', { name: 'Attribute name' })).toHaveValue(
      'Color'
    );
  });
});
