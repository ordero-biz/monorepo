import { render, screen } from '@testing-library/react';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getServerAttributes } from '@/lib/server/api/attributes';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import AttributesPage from './page';

const attributesListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/features/attributes')>(
    '@/features/attributes'
  )),
  AttributesList: (props: { paginationInput?: PaginationSearchInput }) => {
    attributesListMock(props);

    return <div>Attributes list</div>;
  },
  AttributesListHeader: () => <div>Attributes header</div>,
}));

vi.mock('@/lib/server/api/attributes', () => ({
  getServerAttributes: vi.fn(),
}));

const getServerAttributesMock = vi.mocked(getServerAttributes);

describe('AttributesPage', () => {
  beforeEach(() => {
    getServerAttributesMock.mockReset();
    attributesListMock.mockReset();
  });

  it('prefetches attributes and hydrates the query cache', async () => {
    const attributes = {
      content: [
        {
          id: 1,
          name: 'Size',
          sortOrder: 10,
          values: ['S', 'M', 'L'],
          createdAt: '2026-05-26T20:55:51.542Z',
        },
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerAttributesMock.mockResolvedValue({
      ok: true,
      data: attributes,
    });

    render(await AttributesPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Attributes header')).toBeVisible();
    expect(screen.getByText('Attributes list')).toBeVisible();
    expect(getServerAttributesMock).toHaveBeenCalledWith({
      page: 1,
      size: 10,
    });
    expect(attributesListMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 1,
        size: 10,
      },
    });
    expect(
      queryClient.getQueryData(
        attributesQueryKeys.listPage({
          page: 1,
          size: 10,
        })
      )
    ).toEqual(attributes);
  });

  it('prefetches attributes with pagination from the URL search params', async () => {
    const attributes = {
      content: [],
      page: {
        size: 10,
        number: 2,
        totalElements: 0,
        totalPages: 0,
      },
    };
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc', 'createdAt,desc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerAttributesMock.mockResolvedValue({
      ok: true,
      data: attributes,
    });

    render(
      await AttributesPage({
        searchParams: Promise.resolve({
          page: '2',
          size: '10',
          sort: ['name,asc', 'createdAt,desc'],
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerAttributesMock).toHaveBeenCalledWith(paginationInput);
    expect(attributesListMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(attributesQueryKeys.listPage(paginationInput))
    ).toEqual(attributes);
  });
});
