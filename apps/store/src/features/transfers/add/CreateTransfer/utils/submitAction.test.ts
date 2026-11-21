import { createTransfer } from '@/lib/client/api/transfers';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { submitCreateTransfer } from './submitAction';

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  createTransfer: vi.fn(),
}));

const createTransferMock = vi.mocked(createTransfer);

const transfer: TransferDetails = {
  id: 5,
  sourceWarehouse: { id: 1, name: 'Main Warehouse', status: 'ACTIVE' },
  destinationWarehouse: { id: 2, name: 'East Warehouse', status: 'ACTIVE' },
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
};

const submitData = {
  sourceWarehouseId: 1,
  destinationWarehouseId: 2,
  transferNumber: 'Weekend restock',
  status: TRANSFER_STATUS.DRAFT,
  transferEntries: [],
};

describe('submitCreateTransfer', () => {
  beforeEach(() => {
    createTransferMock.mockReset();
  });

  it('submits prepared create data and returns the saved result', async () => {
    createTransferMock.mockResolvedValue({ ok: true, data: transfer });

    const result = await submitCreateTransfer(submitData);

    expect(createTransferMock).toHaveBeenCalledExactlyOnceWith(submitData);
    expect(result).toEqual({ ok: true, data: transfer });
  });

  it('preserves backend field errors on create failure', async () => {
    const error = {
      status: 422,
      message: 'Not enough stock.',
      fieldErrors: { 'transferEntries.0.quantity': 'Not enough stock' },
    };
    createTransferMock.mockResolvedValue({ ok: false, error });

    const result = await submitCreateTransfer(submitData);

    expect(result).toEqual({ ok: false, error });
  });
});
