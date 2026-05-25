import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStores } from '@/lib/client/api';
import { clientRoutes } from '@/lib/client/routes';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { StoresListPage } from './StoresListPage';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/client/api', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api')>(
    '@/lib/client/api'
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

  it('renders a loading state while stores are loading', () => {
    getStoresMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading stores...')).toBeVisible();
  });

  it('renders an error state and retries loading stores', async () => {
    getStoresMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load stores.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: [
          {
            id: 1,
            name: 'North Shop',
            subDomain: 'north-shop',
          },
        ],
      });

    const user = userEvent.setup();
    setup();

    expect(
      await screen.findByText("We couldn't load your stores right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('North Shop')).toBeVisible();
    expect(getStoresMock).toHaveBeenCalledTimes(2);
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

    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.addStore);
  });

  it('renders stores and keeps the add-store card available', async () => {
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
      screen.getByRole('button', { name: /add your first store/i })
    ).toBeVisible();
  });
});
