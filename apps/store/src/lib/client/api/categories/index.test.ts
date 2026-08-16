import {
  createCategory,
  getCategories,
  getCategoriesPath,
  getCategory,
  getCategoryChildren,
  updateCategory,
} from '.';

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
        status: 'ACTIVE',
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
          status: 'ACTIVE',
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
        status: 'ACTIVE',
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

  it('gets a category from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const category = {
      id: 3,
      name: 'Sneakers',
      sortOrder: 15,
      color: '#16a34a',
      createdAt: '2026-07-01T11:22:53.562Z',
    };

    fetchMock.mockResolvedValue(new Response(JSON.stringify(category)));

    await expect(getCategory(3)).resolves.toEqual({
      ok: true,
      data: category,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/categories/3',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it("gets a category's children from the backend proxy", async () => {
    const fetchMock = vi.mocked(fetch);
    const children = [
      {
        id: 3,
        name: 'Running shoes',
        sortOrder: 20,
        color: '#15803d',
        createdAt: '2026-07-01T11:22:53.562Z',
        parentCategory: {
          id: 2,
          name: 'Shoes',
          createdAt: '2026-07-01T10:54:34.839Z',
        },
      },
    ];

    fetchMock.mockResolvedValue(new Response(JSON.stringify(children)));

    await expect(getCategoryChildren(2)).resolves.toEqual({
      ok: true,
      data: children,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/categories/2/children',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from category children lookup', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Category children lookup failed.',
          code: 'CATEGORY_CHILDREN_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getCategoryChildren(2)).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Category children lookup failed.',
        code: 'CATEGORY_CHILDREN_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('patches a category through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const category = {
      id: 3,
      name: 'Running shoes',
      sortOrder: 20,
      color: '#15803d',
      createdAt: '2026-07-01T11:22:53.562Z',
    };

    fetchMock.mockResolvedValue(new Response(JSON.stringify(category)));

    await expect(
      updateCategory({
        categoryId: 3,
        name: 'Running shoes',
        parentId: null,
      })
    ).resolves.toEqual({
      ok: true,
      data: category,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/categories/3',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Running shoes',
          parentId: null,
        }),
        cache: 'no-store',
      })
    );
  });

  it('patches a category status through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const category = {
      id: 3,
      name: 'Running shoes',
      sortOrder: 20,
      status: 'ACTIVE' as const,
      color: '#15803d',
      createdAt: '2026-07-01T11:22:53.562Z',
    };

    fetchMock.mockResolvedValue(new Response(JSON.stringify(category)));

    await expect(
      updateCategory({
        categoryId: 3,
        status: 'ACTIVE',
      })
    ).resolves.toEqual({
      ok: true,
      data: category,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/categories/3',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          status: 'ACTIVE',
        }),
        cache: 'no-store',
      })
    );
  });
});
