import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteAttributeDialogTrigger } from './DeleteAttributeDialogTrigger';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

const { setup } = prepareStoreSetup({
  component: DeleteAttributeDialogTrigger,
  props: {
    attribute: {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      createdAt: '2026-06-24T20:07:32.467Z',
    },
  },
});

describe('DeleteAttributeDialogTrigger', () => {
  it('opens the delete confirmation dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Delete Color' }));

    expect(
      screen.getByRole('dialog', { name: 'Delete attribute' })
    ).toBeVisible();
  });
});
