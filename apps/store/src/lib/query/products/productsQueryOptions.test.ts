import { QueryClient } from '@tanstack/react-query';
import {
  productGroupsListQueryOptions,
  productVariantsListQueryOptions,
} from './productsQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('productGroupsListQueryOptions', () => {
  it('uses a stable paginated key and unwraps fetched product groups', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const productGroups = {
      content: [
        {
          id: 1,
          name: 'Canvas Tote',
          description: 'Reusable bag',
          createdAt: '2026-07-01T10:54:34.839Z',
          category: {
            id: 2,
            name: 'Bags',
            createdAt: '2026-07-01T10:54:34.839Z',
          },
        },
      ],
      page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
    };
    const fetchProductGroups = vi.fn(async () => ({
      ok: true as const,
      data: productGroups,
    }));
    const options = productGroupsListQueryOptions(fetchProductGroups, input);

    expect(productGroupsListQueryOptions(fetchProductGroups).queryKey).toEqual([
      'product-groups',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['product-groups', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      productGroups
    );
    expect(fetchProductGroups).toHaveBeenCalledWith(input);
  });

  it('throws the normalized API error from the fetcher', async () => {
    const error = {
      status: 500,
      message: 'Could not load product groups.',
    };
    const options = productGroupsListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });
});

describe('productVariantsListQueryOptions', () => {
  it('uses a stable paginated key and unwraps fetched product variants', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const productVariants = {
      content: [],
      page: { size: 10, number: 1, totalElements: 0, totalPages: 0 },
    };
    const fetchProductVariants = vi.fn(async () => ({
      ok: true as const,
      data: productVariants,
    }));
    const options = productVariantsListQueryOptions(
      fetchProductVariants,
      input
    );

    expect(
      productVariantsListQueryOptions(fetchProductVariants).queryKey
    ).toEqual(['product-variants', 'list', {}]);
    expect(options.queryKey).toEqual(['product-variants', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      productVariants
    );
    expect(fetchProductVariants).toHaveBeenCalledWith(input);
  });
});
