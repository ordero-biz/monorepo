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
});
