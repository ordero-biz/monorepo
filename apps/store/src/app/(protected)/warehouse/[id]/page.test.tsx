import { render, screen } from '@testing-library/react';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import {
  getServerWarehouse,
  getServerWarehouseStock,
} from '@/lib/server/api/warehouses';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import WarehouseDetailPage from './page';

vi.mock('@/features/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/features/warehouses')>(
    '@/features/warehouses'
  )),
  WarehouseDetail: ({ warehouseId }: { warehouseId: string }) => (
    <div>Warehouse detail {warehouseId}</div>
  ),
}));

vi.mock('@/lib/server/api/warehouses', () => ({
  getServerWarehouse: vi.fn(),
  getServerWarehouseStock: vi.fn(),
}));

const getServerWarehouseMock = vi.mocked(getServerWarehouse);

describe('WarehouseDetailPage', () => {
  beforeEach(() => {
    getServerWarehouseMock.mockReset();
    vi.mocked(getServerWarehouseStock).mockReset();
    vi.mocked(getServerWarehouseStock).mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { number: 1, size: 25, totalElements: 0, totalPages: 0 },
      },
    });
  });

  it('prefetches warehouse details and hydrates the query cache', async () => {
    const warehouse = {
      phone: null,
      status: WAREHOUSE_STATUS.DRAFT,
      totalItemQuantity: 0,
      id: 1,
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
      totalPrice: 4285,
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerWarehouseMock.mockResolvedValue({ ok: true, data: warehouse });

    render(
      await WarehouseDetailPage({
        params: Promise.resolve({ id: '1' }),
        searchParams: Promise.resolve({ page: '2', size: '25' }),
      }),
      { wrapper: TestQueryProvider }
    );

    expect(screen.getByText('Warehouse detail 1')).toBeVisible();
    expect(getServerWarehouseMock).toHaveBeenCalledWith('1');
    expect(getServerWarehouseStock).toHaveBeenCalledWith('1', {
      page: 2,
      size: 25,
    });
    expect(
      queryClient.getQueryData(
        warehousesQueryKeys.stockPage('1', { page: 2, size: 25 })
      )
    ).toEqual({
      content: [],
      page: { number: 1, size: 25, totalElements: 0, totalPages: 0 },
    });
    expect(queryClient.getQueryData(warehousesQueryKeys.detail('1'))).toEqual(
      warehouse
    );
  });
});
