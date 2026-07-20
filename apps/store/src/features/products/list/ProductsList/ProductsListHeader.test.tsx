import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { PRODUCTS_LIST_MODE } from './constants';
import { ProductsListHeader } from './ProductsListHeader';

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
  component: ProductsListHeader,
  props: {
    listMode: PRODUCTS_LIST_MODE.products,
    onListModeChange: vi.fn(),
  },
});

describe('ProductsListHeader', () => {
  beforeEach(() => {
    routerPushMock.mockClear();
  });

  it('opens the add product page', async () => {
    const user = userEvent.setup();

    setup();

    expect(
      screen.getByRole('heading', { name: 'Products list' })
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Add Product' }));

    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.addProduct);
  });

  it('shows products as the active list mode by default', () => {
    setup();

    expect(
      screen.getByRole('group', { name: 'Product list mode' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(
      screen.getByRole('button', { name: 'Products Groups' })
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes the selected list mode', async () => {
    const user = userEvent.setup();
    const { onListModeChange } = setup({
      onListModeChange: vi.fn(),
    });

    await user.click(screen.getByRole('button', { name: 'Products Groups' }));

    expect(onListModeChange).toHaveBeenCalledWith(
      PRODUCTS_LIST_MODE.productGroups
    );
  });
});
