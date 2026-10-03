import { renderHook, waitFor } from '@testing-library/react';
import { getSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSupplyQuery } from './useSupplyQuery';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  getSupply: vi.fn(),
}));

const supply = {
  id: 7,
  supplier: { id: 2, name: 'Fresh Farms', status: 'ACTIVE' },
  warehouse: { id: 3, name: 'Main warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  totalQuantity: 0,
  totalPrice: 0,
  supplyEntries: [],
  version: 1,
};

const getSupplyMock = vi.mocked(getSupply);

describe('supply detail query', () => {
  beforeEach(() => {
    getSupplyMock.mockReset();
  });

  it('loads a saved supply by id', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSupplyQuery('7'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(supply);
    expect(getSupplyMock).toHaveBeenCalledWith('7');
  });

  it('uses prefetched supply detail without another client request', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(suppliesQueryKeys.detail(7), supply);
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSupplyQuery('7'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(supply);
    expect(getSupplyMock).not.toHaveBeenCalled();
  });
});
