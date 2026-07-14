import { createProduct } from '@/lib/client/api/products';
import { submitCreateProduct } from './submitAction';

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  createProduct: vi.fn(),
}));

const createProductMock = vi.mocked(createProduct);

describe('submitCreateProduct', () => {
  beforeEach(() => {
    createProductMock.mockReset();
  });

  it('creates a product with the submitted values', async () => {
    createProductMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Running Shoes',
        description: 'Lightweight daily trainer',
        createdAt: '2026-07-03T07:20:30.291Z',
        category: {
          id: 2,
          name: 'Footwear',
          createdAt: '2026-07-01T07:20:30.291Z',
        },
      },
    });

    await expect(
      submitCreateProduct({
        attributes: [],
        attributeValues: {},
        productName: ' Running Shoes ',
        description: 'Lightweight daily trainer',
        category: '2',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 3,
        name: 'Running Shoes',
        description: 'Lightweight daily trainer',
        createdAt: '2026-07-03T07:20:30.291Z',
        category: {
          id: 2,
          name: 'Footwear',
          createdAt: '2026-07-01T07:20:30.291Z',
        },
      },
    });

    expect(createProductMock).toHaveBeenCalledWith({
      categoryId: 2,
      description: 'Lightweight daily trainer',
      name: 'Running Shoes',
    });
  });

  it('maps backend product field errors to form field names', async () => {
    createProductMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Product creation failed.',
        fieldErrors: {
          categoryId: 'Category is required.',
          description: 'Description is too long.',
          name: 'Product name already exists.',
        },
      },
    });

    await expect(
      submitCreateProduct({
        attributes: [],
        attributeValues: {},
        productName: 'Running Shoes',
        description: 'Lightweight daily trainer',
        category: '2',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          category: 'Category is required.',
          description: 'Description is too long.',
          productName: 'Product name already exists.',
        },
        formError: 'Product creation failed.',
      },
    });
  });
});
