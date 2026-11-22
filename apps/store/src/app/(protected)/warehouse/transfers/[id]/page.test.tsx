import { render, screen } from '@testing-library/react';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { getServerTransfer } from '@/lib/server/api/transfers';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import TransferDetailPage from './page';

vi.mock('@/features/transfers', () => ({
  TransferDetail: ({ transferId }: { transferId: string }) => (
    <div>Transfer detail {transferId}</div>
  ),
}));

vi.mock('@/lib/server/api/transfers', () => ({
  getServerTransfer: vi.fn(),
}));

const getServerTransferMock = vi.mocked(getServerTransfer);

describe('TransferDetailPage', () => {
  beforeEach(() => {
    getServerTransferMock.mockReset();
  });

  it('prefetches the saved transfer for the editor', async () => {
    const transfer = {
      id: 5,
      sourceWarehouse: {
        id: 1,
        name: 'Main Warehouse',
        status: WAREHOUSE_STATUS.ACTIVE,
      },
      destinationWarehouse: {
        id: 2,
        name: 'East Warehouse',
        status: WAREHOUSE_STATUS.ACTIVE,
      },
      transferNumber: 'Weekend restock',
      status: TRANSFER_STATUS.DRAFT,
      comment: null,
      dispatchedAt: null,
      dispatchedBy: null,
      completedAt: null,
      completedBy: null,
      createdAt: '2026-11-17T10:00:00Z',
      createdBy: 'owner@example.test',
      updatedAt: '2026-11-17T10:00:00Z',
      updatedBy: 'owner@example.test',
      transferEntries: [],
      version: 1,
    } satisfies TransferDetails;
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    getServerTransferMock.mockResolvedValue({ ok: true, data: transfer });

    render(await TransferDetailPage({ params: Promise.resolve({ id: '5' }) }), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Transfer detail 5')).toBeVisible();
    expect(getServerTransferMock).toHaveBeenCalledWith('5');
    expect(queryClient.getQueryData(transfersQueryKeys.detail('5'))).toEqual(
      transfer
    );
  });
});
