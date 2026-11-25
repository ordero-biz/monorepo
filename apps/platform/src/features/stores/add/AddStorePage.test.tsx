import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { storesQueryKeys } from '@/lib/hooks/stores/useStoresQuery';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStorePage } from './AddStorePage';

const { routerPushMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('./AddStoreLayout', () => ({
  AddStoreLayout: ({ onCreated }: { onCreated: () => Promise<void> }) => (
    <button onClick={onCreated} type="button">
      Complete store creation
    </button>
  ),
}));

const { setup } = preparePlatformSetup({
  component: AddStorePage,
});

describe('AddStorePage', () => {
  beforeEach(() => {
    routerPushMock.mockReset();
  });

  it('invalidates stores and redirects after store creation', async () => {
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(
      screen.getByRole('button', { name: 'Complete store creation' })
    );

    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: storesQueryKeys.list,
      })
    );
    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.stores);
  });
});
