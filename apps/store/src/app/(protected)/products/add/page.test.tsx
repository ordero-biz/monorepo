import { render, screen } from '@testing-library/react';
import {
  PRODUCT_CREATION_MODE,
  type ProductCreationMode,
} from '@/lib/domain/products/constants';
import AddProductPage from './page';

const createProductMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/products', async () => ({
  ...(await vi.importActual<typeof import('@/features/products')>(
    '@/features/products'
  )),
  CreateProduct: ({ creationMode }: { creationMode: ProductCreationMode }) => {
    createProductMock(creationMode);

    return <h1>Product template</h1>;
  },
}));

describe('AddProductPage', () => {
  beforeEach(() => {
    createProductMock.mockReset();
  });

  it('renders the single-product workflow by default', async () => {
    render(await AddProductPage());

    expect(
      screen.getByRole('heading', { name: 'Product template' })
    ).toBeVisible();
    expect(createProductMock).toHaveBeenCalledWith(
      PRODUCT_CREATION_MODE.single
    );
  });

  it('renders the multiple-product workflow from the URL', async () => {
    render(
      await AddProductPage({
        searchParams: Promise.resolve({
          creationMode: PRODUCT_CREATION_MODE.multiple,
        }),
      })
    );

    expect(createProductMock).toHaveBeenCalledWith(
      PRODUCT_CREATION_MODE.multiple
    );
  });
});
