import { createProductGroup } from '@/lib/client/api/products';
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
        name: ' Running Shoes ',
        description: 'Lightweight daily trainer',
        category: '2',
        status: 'ACTIVE',
        productVariants: [
          {
            attributeValueIds: [71],
            barcode: ' barcode-1 ',
            description: 'Blue variant',
            name: ' Running Shoes Blue ',
            sku: ' SHOE-BLUE ',
            status: 'DRAFT',
          },
        ],
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
      status: 'ACTIVE',
      productVariants: [
        {
          attributeValueIds: [71],
          barcode: 'barcode-1',
          description: 'Blue variant',
          name: 'Running Shoes Blue',
          sku: 'SHOE-BLUE',
          status: 'DRAFT',
        },
      ],
    });
  });

  it('returns backend product field errors unchanged', async () => {
    createProductGroupMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Product creation failed.',
        fieldErrors: {
          category: 'Category is required.',
          description: 'Description is too long.',
          name: 'Product name already exists.',
          'productVariants[0].sku': 'SKU already exists.',
          'productVariants[1].barcode': 'Barcode already exists.',
        },
      },
    });

    await expect(
      submitCreateProduct({
        name: 'Running Shoes',
        description: 'Lightweight daily trainer',
        category: '2',
        status: 'DRAFT',
        productVariants: [],
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          category: 'Category is required.',
          description: 'Description is too long.',
          name: 'Product name already exists.',
          'productVariants[0].sku': 'SKU already exists.',
          'productVariants[1].barcode': 'Barcode already exists.',
        },
        formError: 'Product creation failed.',
      },
    });
  });

  it('omits blank product and variant descriptions', async () => {
    createProductGroupMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Running Shoes',
        description: '',
        createdAt: '2026-07-03T07:20:30.291Z',
        category: {
          id: 2,
          name: 'Footwear',
          createdAt: '2026-07-01T07:20:30.291Z',
        },
      },
    });

    await submitCreateProduct({
      name: 'Running Shoes',
      description: '   ',
      category: '2',
      status: 'DRAFT',
      productVariants: [
        {
          attributeValueIds: [],
          barcode: 'barcode-1',
          description: '',
          name: 'Running Shoes',
          sku: 'SHOE-1',
          status: 'ACTIVE',
        },
      ],
    });

    expect(createProductGroupMock).toHaveBeenCalledWith({
      categoryId: 2,
      name: 'Running Shoes',
      status: 'DRAFT',
      productVariants: [
        {
          attributeValueIds: [],
          barcode: 'barcode-1',
          name: 'Running Shoes',
          sku: 'SHOE-1',
          status: 'ACTIVE',
        },
      ],
    });
  });
});
