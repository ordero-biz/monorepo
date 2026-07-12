import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStoreCard } from './AddStoreCard';

const { setup } = preparePlatformSetup({
  component: AddStoreCard,
  props: {
    onClick: vi.fn(),
  },
});

describe('AddStoreCard', () => {
  it('runs the supplied add-store action', async () => {
    const user = userEvent.setup();
    const { onClick } = setup({
      onClick: vi.fn(),
    });

    await user.click(
      screen.getByRole('button', { name: /add your first store/i })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
