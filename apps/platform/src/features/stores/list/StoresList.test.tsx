import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { useStoresQuery } from '@/lib/hooks/stores/useStoresQuery';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { StoresList } from './StoresList';

const { refetchMock, routerPushMock, useStoresQueryMock } = vi.hoisted(() => ({
  refetchMock: vi.fn(),
  routerPushMock: vi.fn(),
  useStoresQueryMock: vi.fn(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/hooks/stores/useStoresQuery', async () => ({
  ...(await vi.importActual<typeof import('@/lib/hooks/stores/useStoresQuery')>(
    '@/lib/hooks/stores/useStoresQuery'
  )),
  useStoresQuery: useStoresQueryMock,
}));

const useStoresQueryMocked = vi.mocked(useStoresQuery);

const { setup } = preparePlatformSetup({
  component: StoresList,
});

describe('StoresList', () => {
  beforeEach(() => {
    refetchMock.mockReset();
    routerPushMock.mockReset();
    useStoresQueryMocked.mockReset();
  });

  it('renders a loading state while stores are loading', () => {
    useStoresQueryMocked.mockReturnValue({
      isPending: true,
    } as never);

    setup();

    expect(screen.getByText('Loading stores...')).toBeVisible();
  });

  it('offers a retry when loading stores fails', async () => {
    useStoresQueryMocked.mockReturnValue({
      isError: true,
      refetch: refetchMock,
    } as never);
    const user = userEvent.setup();

    setup();

    expect(
      screen.getByText("We couldn't load your stores right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('renders stores and takes the user to store creation', async () => {
    useStoresQueryMocked.mockReturnValue({
      data: [
        {
          id: 1,
          name: 'North Shop',
          subDomain: 'north-shop',
        },
      ],
      isError: false,
      isPending: false,
    } as never);
    const user = userEvent.setup();

    setup();

    expect(screen.getByText('North Shop')).toBeVisible();
    expect(screen.getByText('north-shop.ordero.biz')).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: /add your first store/i })
    );

    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.addStore);
  });
});
