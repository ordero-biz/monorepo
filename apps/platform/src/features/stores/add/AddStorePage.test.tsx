import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore } from '@/lib/client/api/stores';
import { clientRoutes } from '@/lib/client/routes';
import { storesQueryKeys } from '@/lib/hooks/stores/useStoresQuery';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStorePage } from './AddStorePage';

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
  createStore: vi.fn(),
}));

const createStoreMock = vi.mocked(createStore);

const { setup } = preparePlatformSetup({
  component: AddStorePage,
});

describe('AddStorePage', () => {
  beforeEach(() => {
    createStoreMock.mockReset();
    routerPushMock.mockClear();
  });

  it('invalidates stores and redirects after creating a store', async () => {
    createStoreMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'North Shop',
        subDomain: 'north-shop',
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.type(screen.getByRole('textbox', { name: 'Subdomain' }), 'shop');
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Shop');
    await user.click(screen.getByRole('button', { name: 'Create store' }));

    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: storesQueryKeys.list,
      })
    );
    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.stores);
  });
});
