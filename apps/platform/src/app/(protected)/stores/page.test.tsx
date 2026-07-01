import { screen } from '@testing-library/react';
import { getStores } from '@/lib/client/api/stores';
import { preparePlatformSetup } from '@/test/prepareSetup';
import StoresPage from './page';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/client/api/stores', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/stores')>(
    '@/lib/client/api/stores'
  )),
  getStores: vi.fn(),
}));

const getStoresMock = vi.mocked(getStores);

const { setup } = preparePlatformSetup({
  component: StoresPage,
});

describe('StoresPage', () => {
  beforeEach(() => {
    getStoresMock.mockReset();
    routerPushMock.mockClear();
  });

  it('renders the stores route with loaded stores and add-store action', async () => {
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

    expect(screen.getByRole('heading', { name: 'Stores' })).toBeVisible();
    expect(
      screen.getByText('Manage the storefronts connected to your workspace.')
    ).toBeVisible();
    expect(await screen.findByText('North Shop')).toBeVisible();
    expect(screen.getByText('north-shop.ordero.biz')).toBeVisible();
    expect(
      screen.getByRole('button', { name: /add your first store/i })
    ).toBeVisible();
  });
});
