import { render, screen } from '@testing-library/react';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { getServerWarehouse } from '@/lib/server/api/warehouses';
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
}));

const getServerWarehouseMock = vi.mocked(getServerWarehouse);

describe('WarehouseDetailPage', () => {
  beforeEach(() => {
    getServerWarehouseMock.mockReset();
  });

  it('prefetches warehouse details and hydrates the query cache', async () => {
    const warehouse = {
      id: 1,
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerWarehouseMock.mockResolvedValue({ ok: true, data: warehouse });

    render(
      await WarehouseDetailPage({ params: Promise.resolve({ id: '1' }) }),
      { wrapper: TestQueryProvider }
    );

    expect(screen.getByText('Warehouse detail 1')).toBeVisible();
    expect(getServerWarehouseMock).toHaveBeenCalledWith('1');
    expect(queryClient.getQueryData(warehousesQueryKeys.detail('1'))).toEqual(
      warehouse
    );
  });
});
