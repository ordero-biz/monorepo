import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { StoresListPage } from './StoresListPage';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

const { setup } = preparePlatformSetup({
  component: StoresListPage,
});

describe('StoresListPage', () => {
  beforeEach(() => {
    routerPushMock.mockClear();
  });

  it('renders an empty store card that opens the add-store page', async () => {
    const user = userEvent.setup();
    setup();

    const addStoreCard = screen.getByRole('button', {
      name: /add your first store/i,
    });

    expect(screen.getByRole('heading', { name: 'Stores' })).toBeVisible();
    expect(addStoreCard).toBeVisible();

    await user.click(addStoreCard);

    expect(routerPushMock).toHaveBeenCalledWith('/stores/add');
  });
});
