import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { TransfersListHeader } from './TransfersListHeader';

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

const { setup } = prepareStoreSetup({
  component: TransfersListHeader,
});

describe('TransfersListHeader', () => {
  beforeEach(() => {
    routerPushMock.mockClear();
  });

  it('renders the transfers title and breadcrumb', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Transfers list' })
    ).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByText(
        'Transfers'
      )
    ).toHaveAttribute('aria-current', 'page');
  });

  it('opens the create transfer page', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: 'Add transfer' }));

    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.addTransfer);
  });
});
