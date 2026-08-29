import { QueryClient } from '@tanstack/react-query';
import {
  attributeQueryOptions,
  attributesListQueryOptions,
  attributeValuesQueryOptions,
} from './attributesQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('attribute query options', () => {
  it('uses a stable paginated list key and unwraps fetched attributes', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const attributes = {
      content: [
        {
          id: 1,
          name: 'Size',
          sortOrder: 10,
          status: 'DRAFT' as const,
          createdAt: '2026-07-01T10:54:34.839Z',
        },
      ],
      page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
    };
    const fetchAttributes = vi.fn(async () => ({
      ok: true as const,
      data: attributes,
    }));
    const options = attributesListQueryOptions(fetchAttributes, input);

    expect(attributesListQueryOptions(fetchAttributes).queryKey).toEqual([
      'attributes',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['attributes', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      attributes
    );
    expect(fetchAttributes).toHaveBeenCalledWith(input);
  });

  it('uses the attribute id for detail and values queries', async () => {
    const attribute = {
      id: 1,
      name: 'Size',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-07-01T10:54:34.839Z',
    };
    const values = [
      {
        id: 2,
        name: 'Large',
        sortOrder: 10,
        status: 'DRAFT' as const,
        createdAt: '2026-07-01T10:54:34.839Z',
      },
    ];
    const fetchAttribute = vi.fn(async () => ({
      ok: true as const,
      data: attribute,
    }));
    const fetchAttributeValues = vi.fn(async () => ({
      ok: true as const,
      data: values,
    }));
    const detailOptions = attributeQueryOptions(1, fetchAttribute);
    const valuesOptions = attributeValuesQueryOptions(1, fetchAttributeValues);
    const queryClient = createQueryClient();

    expect(detailOptions.queryKey).toEqual(['attributes', 'detail', '1']);
    expect(valuesOptions.queryKey).toEqual([
      'attributes',
      'detail',
      '1',
      'values',
    ]);
    await expect(queryClient.fetchQuery(detailOptions)).resolves.toEqual(
      attribute
    );
    await expect(queryClient.fetchQuery(valuesOptions)).resolves.toEqual(
      values
    );
    expect(fetchAttribute).toHaveBeenCalledWith(1);
    expect(fetchAttributeValues).toHaveBeenCalledWith(1);
  });

  it('throws the normalized API error from the list fetcher', async () => {
    const error = { status: 500, message: 'Could not load attributes.' };
    const options = attributesListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });
});
