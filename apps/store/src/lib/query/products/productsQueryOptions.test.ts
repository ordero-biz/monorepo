import { QueryClient } from '@tanstack/react-query';
import {
  productsListQueryOptions,
  productVariantsListQueryOptions,
} from './productsQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('productsListQueryOptions', () => {
  it('uses a stable paginated key and unwraps fetched products', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const products = {
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
    const fetchProducts = vi.fn(async () => ({
      ok: true as const,
      data: products,
    }));
    const options = productsListQueryOptions(fetchProducts, input);

    expect(productsListQueryOptions(fetchProducts).queryKey).toEqual([
      'products',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['products', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      products
    );
    expect(fetchProducts).toHaveBeenCalledWith(input);
  });

  it('throws the normalized API error from the fetcher', async () => {
    const error = { status: 500, message: 'Could not load products.' };
    const options = productsListQueryOptions(async () => ({
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
      content: [
        {
          id: 7,
          name: 'Canvas Tote / Black',
          description: 'Reusable bag',
          sku: 'TOTE-BLK',
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
                name: 'Black',
                sortOrder: 1,
                createdAt: '2026-07-20T18:23:01.675Z',
              },
            },
          ],
        },
      ],
      page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
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
    ).toEqual(['products', 'variants', 'list', {}]);
    expect(options.queryKey).toEqual(['products', 'variants', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      productVariants
    );
    expect(fetchProductVariants).toHaveBeenCalledWith(input);
  });
});
