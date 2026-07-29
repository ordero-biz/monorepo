import { createProductGroup } from '@/lib/client/api/products';
import { PRODUCT_GENERATION_MODE } from '../constants';
import { submitCreateProduct } from './submitAction';

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  createProductGroup: vi.fn(),
}));

const createProductGroupMock = vi.mocked(createProductGroup);

describe('submitCreateProduct', () => {
  beforeEach(() => {
    createProductGroupMock.mockReset();
  });

  it('creates a product with the submitted values', async () => {
    createProductGroupMock.mockResolvedValue({
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
        productVariants: [
          {
            attributeValueIds: [71],
            barcode: ' barcode-1 ',
            description: 'Blue variant',
            name: ' Running Shoes Blue ',
            sku: ' SHOE-BLUE ',
          },
        ],
        productVariantsGenerationMode: PRODUCT_GENERATION_MODE.one,
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

    expect(createProductGroupMock).toHaveBeenCalledWith({
      categoryId: 2,
      description: 'Lightweight daily trainer',
      name: 'Running Shoes',
      productVariants: [
        {
          attributeValueIds: [71],
          barcode: 'barcode-1',
          description: 'Blue variant',
          name: 'Running Shoes Blue',
          sku: 'SHOE-BLUE',
        },
      ],
    });
  });

  it('maps backend product field errors to form field names', async () => {
    createProductGroupMock.mockResolvedValue({
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
        productVariants: [],
        productVariantsGenerationMode: PRODUCT_GENERATION_MODE.one,
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
