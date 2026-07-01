import { render, screen } from '@testing-library/react';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { getServerWarehouses } from '@/lib/server/api/warehouses';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import WarehousePage from './page';

vi.mock('@/features/warehouses', () => ({
  WarehousesList: () => <div>Warehouses list</div>,
  WarehousesListHeader: () => <div>Warehouses header</div>,
}));

vi.mock('@/lib/server/api/warehouses', () => ({
  getServerWarehouses: vi.fn(),
}));

const getServerWarehousesMock = vi.mocked(getServerWarehouses);

describe('WarehousePage', () => {
  beforeEach(() => {
    getServerWarehousesMock.mockReset();
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
    expect(getServerWarehousesMock).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(warehousesQueryKeys.list)).toEqual(
      warehouses
    );
  });
});
