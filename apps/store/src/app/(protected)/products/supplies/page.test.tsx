import { render, screen } from '@testing-library/react';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { getServerSupplies } from '@/lib/server/api/supplies';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import SuppliesPage from './page';

const suppliesListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/features/supplies')>(
    '@/features/supplies'
  )),
  SuppliesList: (props: { paginationInput?: PaginationSearchInput }) => {
    suppliesListMock(props);

    return <div>Supplies list</div>;
  },
  SuppliesListHeader: () => <div>Supplies header</div>,
}));

vi.mock('@/lib/server/api/supplies', () => ({
  getServerSupplies: vi.fn(),
}));

const getServerSuppliesMock = vi.mocked(getServerSupplies);

describe('SuppliesPage', () => {
  beforeEach(() => {
    getServerSuppliesMock.mockReset();
    suppliesListMock.mockReset();
  });

  it('prefetches supplies and hydrates the query cache', async () => {
    const supplies = {
      content: [
        {
          id: 1,
          supplier: {
            id: 5,
            name: 'Fresh Farms',
          },
          warehouse: {
            id: 7,
            name: 'Central warehouse',
          },
          status: 'DRAFT',
          comment: 'Internal note',
          completedAt: null,
          completedBy: null,
          supplyNumber: 'SUP-001',
          supplierInvoiceNumber: 'INV-001',
          totalQuantity: 50,
          totalPrice: 1200.5,
          createdAt: '2026-08-01T17:26:52.128Z',
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

    getServerSuppliesMock.mockResolvedValue({
      ok: true,
      data: supplies,
    });

    render(await SuppliesPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Supplies header')).toBeVisible();
    expect(screen.getByText('Supplies list')).toBeVisible();
    expect(getServerSuppliesMock).toHaveBeenCalledWith({
      page: 1,
      size: 10,
    });
    expect(suppliesListMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 1,
        size: 10,
      },
    });
    expect(
      queryClient.getQueryData(
        suppliesQueryKeys.listPage({
          page: 1,
          size: 10,
        })
      )
    ).toEqual(supplies);
  });

  it('prefetches supplies with pagination from the URL search params', async () => {
    const supplies = {
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
      sort: ['createdAt,desc', 'supplyNumber,asc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerSuppliesMock.mockResolvedValue({
      ok: true,
      data: supplies,
    });

    render(
      await SuppliesPage({
        searchParams: Promise.resolve({
          page: '2',
          size: '10',
          sort: ['createdAt,desc', 'supplyNumber,asc'],
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerSuppliesMock).toHaveBeenCalledWith(paginationInput);
    expect(suppliesListMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(suppliesQueryKeys.listPage(paginationInput))
    ).toEqual(supplies);
  });
});
