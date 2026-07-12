import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductsListHeader } from './ProductsListHeader';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

const { setup } = prepareStoreSetup({
  component: ProductsListHeader,
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
});
