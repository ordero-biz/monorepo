import { createCategory, getCategories, getCategoriesPath } from '.';

describe('category client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds category pageable search params', () => {
    expect(
      getCategoriesPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'sortOrder,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/categories?page=1&size=10&sort=name%2Casc&sort=sortOrder%2Cdesc'
    );
  });

  it('gets categories from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Shoes',
              sortOrder: 10,
              color: '#2563eb',
              createdAt: '2026-07-01T10:54:34.839Z',
              parentCategory: {
                id: 2,
                name: 'Fashion',
                createdAt: '2026-06-30T10:54:34.839Z',
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

    await expect(getCategories()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            color: '#2563eb',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: {
              id: 2,
              name: 'Fashion',
              createdAt: '2026-06-30T10:54:34.839Z',
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
      '/api/backend/api/v1/categories?page=0&size=10',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the categories route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Categories lookup failed.',
          code: 'CATEGORIES_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getCategories()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Categories lookup failed.',
        code: 'CATEGORIES_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('posts a new category through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 3,
          name: 'Sneakers',
          sortOrder: 15,
          color: '#16a34a',
          createdAt: '2026-07-01T11:22:53.562Z',
          parentCategory: {
            id: 1,
            name: 'Shoes',
            createdAt: '2026-07-01T10:54:34.839Z',
          },
        })
      )
    );

    await expect(
      createCategory({
        name: 'Sneakers',
        parentId: 1,
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 3,
        name: 'Sneakers',
        sortOrder: 15,
        color: '#16a34a',
        createdAt: '2026-07-01T11:22:53.562Z',
        parentCategory: {
          id: 1,
          name: 'Shoes',
          createdAt: '2026-07-01T10:54:34.839Z',
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/categories',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Sneakers',
          parentId: 1,
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from category creation', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Category creation failed.',
          fieldErrors: {
            name: 'Category name already exists.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createCategory({
        name: 'Sneakers',
        parentId: 1,
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Category creation failed.',
        code: undefined,
        fieldErrors: {
          name: 'Category name already exists.',
        },
      },
    });
  });
});
