import { render, screen } from '@testing-library/react';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { getServerWarehouses } from '@/lib/server/api/warehouses';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import WarehousePage from './page';

const warehousesListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/features/warehouses')>(
    '@/features/warehouses'
  )),
  WarehousesList: (props: { paginationInput?: PaginationSearchInput }) => {
    warehousesListMock(props);

    return <div>Warehouses list</div>;
  },
  WarehousesListHeader: () => <div>Warehouses header</div>,
}));

vi.mock('@/lib/server/api/warehouses', () => ({
  getServerWarehouses: vi.fn(),
}));

const getServerWarehousesMock = vi.mocked(getServerWarehouses);

describe('WarehousePage', () => {
  beforeEach(() => {
    getServerWarehousesMock.mockReset();
    warehousesListMock.mockReset();
  });

  it('prefetches warehouses and hydrates the query cache', async () => {
    const warehouses = {
      content: [
        {
          id: 1,
          code: 'WH-001',
          name: 'Main Warehouse',
          address: '123 Commerce Ave',
          comment: 'Primary stock location',
        },
      ],
      page: {
        size: 25,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerWarehousesMock.mockResolvedValue({
      ok: true,
      data: warehouses,
    });

    render(await WarehousePage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Warehouses header')).toBeVisible();
    expect(screen.getByText('Warehouses list')).toBeVisible();
    expect(getServerWarehousesMock).toHaveBeenCalledWith({
      page: 0,
      size: 25,
    });
    expect(warehousesListMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 0,
        size: 25,
      },
    });
    expect(
      queryClient.getQueryData(
        warehousesQueryKeys.listPage({
          page: 0,
          size: 25,
        })
      )
    ).toEqual(warehouses);
  });

  it('prefetches warehouses with pagination from the URL search params', async () => {
    const warehouses = {
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
      sort: ['name,asc', 'code,desc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerWarehousesMock.mockResolvedValue({
      ok: true,
      data: warehouses,
    });

    render(
      await WarehousePage({
        searchParams: Promise.resolve({
          page: '2',
          size: '10',
          sort: ['name,asc', 'code,desc'],
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerWarehousesMock).toHaveBeenCalledWith(paginationInput);
    expect(warehousesListMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(warehousesQueryKeys.listPage(paginationInput))
    ).toEqual(warehouses);
  });
});
