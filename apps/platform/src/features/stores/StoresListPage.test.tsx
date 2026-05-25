import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStores } from '@/lib/api/client';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { StoresListPage } from './StoresListPage';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/api/client', async () => ({
  ...(await vi.importActual<typeof import('@/lib/api/client')>(
    '@/lib/api/client'
  )),
  getStores: vi.fn(),
}));

const getStoresMock = vi.mocked(getStores);

const { setup } = preparePlatformSetup({
  component: StoresListPage,
});

describe('StoresListPage', () => {
  beforeEach(() => {
    getStoresMock.mockReset();
    routerPushMock.mockClear();
  });

  it('renders an empty store card that opens the add-store page', async () => {
    getStoresMock.mockResolvedValue({
      ok: true,
      data: [],
    });

    const user = userEvent.setup();
    setup();

    const addStoreCard = await screen.findByRole('button', {
      name: /add your first store/i,
    });

    expect(screen.getByRole('heading', { name: 'Stores' })).toBeVisible();
    expect(addStoreCard).toBeVisible();

    await user.click(addStoreCard);

    expect(routerPushMock).toHaveBeenCalledWith('/stores/add');
  });

  it('renders the stores returned by the current owner list endpoint', async () => {
    getStoresMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 1,
          name: 'North Shop',
          subDomain: 'north-shop',
        },
      ],
    });

    setup();

    expect(await screen.findByText('North Shop')).toBeVisible();
    expect(screen.getByText('north-shop.ordero.biz')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /add your first store/i })
    ).not.toBeInTheDocument();
  });
});
