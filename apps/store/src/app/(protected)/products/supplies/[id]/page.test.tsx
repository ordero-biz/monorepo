import { render, screen } from '@testing-library/react';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { getServerSupply } from '@/lib/server/api/supplies';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import SupplyDetailPage from './page';

vi.mock('@/features/supplies', () => ({
  SupplyDetail: ({ supplyId }: { supplyId: string }) => (
    <div>Supply detail {supplyId}</div>
  ),
}));

vi.mock('@/lib/server/api/supplies', () => ({
  getServerSupply: vi.fn(),
}));

const getServerSupplyMock = vi.mocked(getServerSupply);

describe('SupplyDetailPage', () => {
  beforeEach(() => {
    getServerSupplyMock.mockReset();
  });

  it('prefetches the saved supply for the editor', async () => {
    const supply = {
      id: 9,
      supplier: { id: 1, name: 'Fresh Farms', status: 'ACTIVE' },
      warehouse: { id: 2, name: 'Main Warehouse', status: 'ACTIVE' },
      status: SUPPLY_STATUS.DRAFT,
      supplyNumber: 'SUP-009',
      totalQuantity: 0,
      totalPrice: 0,
      supplyEntries: [],
      version: 1,
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    getServerSupplyMock.mockResolvedValue({ ok: true, data: supply });

    render(await SupplyDetailPage({ params: Promise.resolve({ id: '9' }) }), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Supply detail 9')).toBeVisible();
    expect(getServerSupplyMock).toHaveBeenCalledWith('9');
    expect(queryClient.getQueryData(suppliesQueryKeys.detail('9'))).toEqual(
      supply
    );
  });
});
