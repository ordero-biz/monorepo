import { QueryClient } from '@tanstack/react-query';
import { categoriesListQueryOptions } from './categoriesQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('categoriesListQueryOptions', () => {
  it('uses a stable paginated key and unwraps fetched categories', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const categories = {
      content: [
        {
          id: 1,
          name: 'Shoes',
          sortOrder: 10,
          color: '#2563eb',
          createdAt: '2026-07-01T10:54:34.839Z',
          parentCategory: null,
        },
      ],
      page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
    };
    const fetchCategories = vi.fn(async () => ({
      ok: true as const,
      data: categories,
    }));
    const options = categoriesListQueryOptions(fetchCategories, input);

    expect(categoriesListQueryOptions(fetchCategories).queryKey).toEqual([
      'categories',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['categories', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      categories
    );
    expect(fetchCategories).toHaveBeenCalledWith(input);
  });

  it('throws the normalized API error from the fetcher', async () => {
    const error = { status: 500, message: 'Could not load categories.' };
    const options = categoriesListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });
});
