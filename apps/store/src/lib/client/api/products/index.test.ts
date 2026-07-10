import { createProduct, getProducts, getProductsPath } from '.';

describe('products client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds product pageable search params', () => {
    expect(
      getProductsPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'createdAt,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/products?page=2&size=10&sort=name%2Casc&sort=createdAt%2Cdesc'
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

    await expect(getProducts()).resolves.toEqual({
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

    await expect(getProducts()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Products lookup failed.',
        code: 'PRODUCTS_LOOKUP_FAILED',
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
      createProduct({
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
      createProduct({
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
