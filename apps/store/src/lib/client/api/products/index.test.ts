import {
  createProductGroup,
  getProductGroups,
  getProductGroupsPath,
  getProductVariants,
  getProductVariantsPath,
} from '.';

describe('products client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds product pageable search params', () => {
    expect(
      getProductGroupsPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'createdAt,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/products?page=1&size=10&sort=name%2Casc&sort=createdAt%2Cdesc'
    );
  });

  it('builds product variant pageable search params', () => {
    expect(
      getProductVariantsPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'createdAt,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/products/variants?page=1&size=10&sort=name%2Casc&sort=createdAt%2Cdesc'
    );
  });

  it('gets products from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Running Shoes',
              description: 'Lightweight daily trainer',
              createdAt: '2026-07-03T07:20:30.291Z',
              category: {
                id: 2,
                name: 'Footwear',
                createdAt: '2026-07-01T07:20:30.291Z',
              },
            },
          ],
          page: {
            size: 10,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        })
      )
    );

    await expect(getProductGroups()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Running Shoes',
            description: 'Lightweight daily trainer',
            createdAt: '2026-07-03T07:20:30.291Z',
            category: {
              id: 2,
              name: 'Footwear',
              createdAt: '2026-07-01T07:20:30.291Z',
            },
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/products?page=0&size=10',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the products route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Products lookup failed.',
          code: 'PRODUCTS_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getProductGroups()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Products lookup failed.',
        code: 'PRODUCTS_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('gets product variants from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 7,
              name: 'Running Shoes / Blue / 42',
              description: 'Lightweight daily trainer',
              sku: 'RUN-BLU-42',
              barcode: '1234567890',
              createdAt: '2026-07-20T18:23:01.675Z',
              productVariantAttributeValues: [
                {
                  id: 1,
                  attribute: {
                    id: 2,
                    name: 'Color',
                    sortOrder: 1,
                    createdAt: '2026-07-20T18:23:01.675Z',
                  },
                  attributeValue: {
                    id: 3,
                    name: 'Blue',
                    sortOrder: 1,
                    createdAt: '2026-07-20T18:23:01.675Z',
                  },
                },
              ],
            },
          ],
          page: {
            size: 10,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        })
      )
    );

    await expect(getProductVariants()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 7,
            name: 'Running Shoes / Blue / 42',
            description: 'Lightweight daily trainer',
            sku: 'RUN-BLU-42',
            barcode: '1234567890',
            createdAt: '2026-07-20T18:23:01.675Z',
            productVariantAttributeValues: [
              {
                id: 1,
                attribute: {
                  id: 2,
                  name: 'Color',
                  sortOrder: 1,
                  createdAt: '2026-07-20T18:23:01.675Z',
                },
                attributeValue: {
                  id: 3,
                  name: 'Blue',
                  sortOrder: 1,
                  createdAt: '2026-07-20T18:23:01.675Z',
                },
              },
            ],
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/products/variants?page=0&size=10',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the product variants route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Product variants lookup failed.',
          code: 'PRODUCT_VARIANTS_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getProductVariants()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Product variants lookup failed.',
        code: 'PRODUCT_VARIANTS_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('posts a new product through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 3,
          name: 'Running Shoes',
          description: '',
          createdAt: '2026-07-03T07:20:30.291Z',
          category: {
            id: 2,
            name: 'Footwear',
            createdAt: '2026-07-01T07:20:30.291Z',
          },
        })
      )
    );

    await expect(
      createProductGroup({
        name: 'Running Shoes',
        description: '',
        categoryId: 2,
      })
    ).resolves.toEqual({
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

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/products',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Running Shoes',
          description: '',
          categoryId: 2,
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from product creation', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Product creation failed.',
          fieldErrors: {
            name: 'Product name already exists.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createProductGroup({
        name: 'Running Shoes',
        description: '',
        categoryId: 2,
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Product creation failed.',
        code: undefined,
        fieldErrors: {
          name: 'Product name already exists.',
        },
      },
    });
  });
});
