import { render, screen } from '@testing-library/react';
import { PRODUCT_CREATION_MODE } from '@/lib/domain/products/constants';
import AddProductPage from './page';

const createSingleProductMock = vi.hoisted(() => vi.fn());
const createMultipleProductsMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/products', async () => ({
  ...(await vi.importActual<typeof import('@/features/products')>(
    '@/features/products'
  )),
  CreateMultipleProducts: () => {
    createMultipleProductsMock();

    return <h1>Multiple product template</h1>;
  },
  CreateSingleProduct: () => {
    createSingleProductMock();

    return <h1>Single product template</h1>;
  },
}));

describe('AddProductPage', () => {
  beforeEach(() => {
    createMultipleProductsMock.mockReset();
    createSingleProductMock.mockReset();
  });

  it('renders the single-product workflow by default', async () => {
    render(await AddProductPage());

    expect(
      screen.getByRole('heading', { name: 'Single product template' })
    ).toBeVisible();
    expect(createSingleProductMock).toHaveBeenCalledOnce();
    expect(createMultipleProductsMock).not.toHaveBeenCalled();
  });

  it('renders the multiple-product workflow from the URL', async () => {
    render(
      await AddProductPage({
        searchParams: Promise.resolve({
          creationMode: PRODUCT_CREATION_MODE.multiple,
        }),
      })
    );

    expect(
      screen.getByRole('heading', { name: 'Multiple product template' })
    ).toBeVisible();
    expect(createMultipleProductsMock).toHaveBeenCalledOnce();
    expect(createSingleProductMock).not.toHaveBeenCalled();
  });
});
