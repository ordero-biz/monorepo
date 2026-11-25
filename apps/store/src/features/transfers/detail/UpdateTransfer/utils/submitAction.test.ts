import { updateTransfer } from '@/lib/client/api/transfers';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { submitUpdateTransfer } from './submitAction';

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  updateTransfer: vi.fn(),
}));

const updateTransferMock = vi.mocked(updateTransfer);

const initialTransfer: TransferDetails = {
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
  comment: 'Fragile',
  dispatchedAt: null,
  dispatchedBy: null,
  completedAt: null,
  completedBy: null,
  createdAt: '2026-11-17T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-11-17T10:00:00Z',
  updatedBy: 'owner@example.test',
  transferEntries: [],
  version: 2,
};

describe('submitUpdateTransfer', () => {
  beforeEach(() => {
    updateTransferMock.mockReset();
  });

  it('saves pending edits and starts the transfer in one versioned request', async () => {
    const updatedTransfer = {
      ...initialTransfer,
      status: TRANSFER_STATUS.IN_TRANSIT,
      comment: null,
      version: 3,
    };
    updateTransferMock.mockResolvedValue({ ok: true, data: updatedTransfer });

    const result = await submitUpdateTransfer({
      transferId: 5,
      expectedVersion: 2,
      submitData: { comment: null, status: TRANSFER_STATUS.IN_TRANSIT },
    });

    expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith({
      transferId: 5,
      expectedVersion: 2,
      comment: null,
      status: TRANSFER_STATUS.IN_TRANSIT,
    });
    expect(result).toEqual({ ok: true, data: updatedTransfer });
  });

  it('preserves backend version and field errors on update failure', async () => {
    const error = {
      status: 409,
      message: 'Transfer was changed by another user.',
      fieldErrors: { expectedVersion: 'Version conflict' },
    };
    updateTransferMock.mockResolvedValue({ ok: false, error });

    const result = await submitUpdateTransfer({
      transferId: 5,
      expectedVersion: 2,
      submitData: { status: TRANSFER_STATUS.IN_TRANSIT },
    });

    expect(result).toEqual({ ok: false, error });
  });
});
