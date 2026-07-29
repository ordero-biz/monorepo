import { render, screen } from '@testing-library/react';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { getServerSuppliers } from '@/lib/server/api/suppliers';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import SuppliersPage from './page';

const suppliersListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/features/suppliers')>(
    '@/features/suppliers'
  )),
  SuppliersList: (props: { paginationInput?: PaginationSearchInput }) => {
    suppliersListMock(props);

    return <div>Suppliers list</div>;
  },
  SuppliersListHeader: () => <div>Suppliers header</div>,
}));

vi.mock('@/lib/server/api/suppliers', () => ({
  getServerSuppliers: vi.fn(),
}));

const getServerSuppliersMock = vi.mocked(getServerSuppliers);

describe('SuppliersPage', () => {
  beforeEach(() => {
    getServerSuppliersMock.mockReset();
    suppliersListMock.mockReset();
  });

  it('prefetches suppliers and hydrates the query cache', async () => {
    const suppliers = {
      content: [
        {
          id: 1,
          name: 'Fresh Farms',
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
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

    getServerSuppliersMock.mockResolvedValue({
      ok: true,
      data: suppliers,
    });

    render(await SuppliersPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Suppliers header')).toBeVisible();
    expect(screen.getByText('Suppliers list')).toBeVisible();
    expect(getServerSuppliersMock).toHaveBeenCalledWith({
      page: 1,
      size: 10,
    });
    expect(suppliersListMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 1,
        size: 10,
      },
    });
    expect(
      queryClient.getQueryData(
        suppliersQueryKeys.listPage({
          page: 1,
          size: 10,
        })
      )
    ).toEqual(suppliers);
  });

  it('prefetches suppliers with pagination from the URL search params', async () => {
    const suppliers = {
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
      sort: ['name,asc', 'email,desc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerSuppliersMock.mockResolvedValue({
      ok: true,
      data: suppliers,
    });

    render(
      await SuppliersPage({
        searchParams: Promise.resolve({
          page: '2',
          size: '10',
          sort: ['name,asc', 'email,desc'],
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerSuppliersMock).toHaveBeenCalledWith(paginationInput);
    expect(suppliersListMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(suppliersQueryKeys.listPage(paginationInput))
    ).toEqual(suppliers);
  });
});
