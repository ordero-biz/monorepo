import { render, screen } from '@testing-library/react';
import {
  PRODUCT_CREATION_MODE,
  type ProductCreationMode,
} from '@/lib/domain/products/constants';
import AddProductPage from './page';

const createProductWorkflowMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/products', async () => ({
  ...(await vi.importActual<typeof import('@/features/products')>(
    '@/features/products'
  )),
  CreateProductWorkflow: ({
    creationMode,
  }: {
    creationMode: ProductCreationMode;
  }) => {
    createProductWorkflowMock(creationMode);

    return (
      <h1>
        {creationMode === PRODUCT_CREATION_MODE.single ? 'Single' : 'Multiple'}
        {' product template'}
      </h1>
    );
  },
}));

describe('AddProductPage', () => {
  beforeEach(() => {
    createProductWorkflowMock.mockReset();
  });

  it('renders the single-product workflow by default', async () => {
    render(await AddProductPage());

    expect(
      screen.getByRole('heading', { name: 'Single product template' })
    ).toBeVisible();
    expect(createProductWorkflowMock).toHaveBeenCalledWith(
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

    expect(
      screen.getByRole('heading', { name: 'Multiple product template' })
    ).toBeVisible();
    expect(createProductWorkflowMock).toHaveBeenCalledWith(
      PRODUCT_CREATION_MODE.multiple
    );
  });
});
