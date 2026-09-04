import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { PRODUCTS_LIST_MODE } from '@/lib/domain/products/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
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
    listMode: PRODUCTS_LIST_MODE.productVariants,
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
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByText(
        'Products'
      )
    ).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Add Product' }));

    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.addProduct);
  });

  it('shows products as the active list mode by default', () => {
    setup();

    expect(
      screen.getByRole('group', { name: 'Product list mode' })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Product Variants' })
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Product Groups' })
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes the selected list mode', async () => {
    const user = userEvent.setup();
    const { onListModeChange } = setup({
      onListModeChange: vi.fn(),
    });

    await user.click(screen.getByRole('button', { name: 'Product Groups' }));

    expect(onListModeChange).toHaveBeenCalledWith(
      PRODUCTS_LIST_MODE.productGroups
    );
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
