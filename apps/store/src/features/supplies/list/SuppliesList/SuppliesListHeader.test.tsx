import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliesListHeader } from './SuppliesListHeader';

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
  component: SuppliesListHeader,
});

describe('SuppliesListHeader', () => {
  beforeEach(() => {
    routerPushMock.mockClear();
  });

  it('renders the supplies title and breadcrumb', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Supplies list' })
    ).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByText(
        'Supplies'
      )
    ).toHaveAttribute('aria-current', 'page');
  });

  it('opens the create supply page', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: 'Add supply' }));

    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.addSupply);
  });
});
