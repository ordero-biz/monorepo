import { updateSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { submitUpdateSupply } from './submitAction';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  updateSupply: vi.fn(),
}));

const updateSupplyMock = vi.mocked(updateSupply);

const initialSupply: SupplyDetails = {
  completedAt: null,
  completedBy: null,
  createdAt: '2026-10-28T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-10-28T10:00:00Z',
  updatedBy: 'owner@example.test',

  id: 9,
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-001',
  supplierInvoiceNumber: 'INV-001',
  comment: 'First delivery',

  totalPrice: 560,
  version: 2,
  supplyEntries: [
    {
      id: 17,
      productVariant: {
        barcode: '',
        id: 11,
        name: 'Jasmine Rice 5kg',
        sku: 'RICE-5KG',
      },
      unitOfMeasurement: {
        id: 2,
        name: 'Bag',
        status: 'ACTIVE',
        symbol: 'bag',
      },
      quantity: 20,
      unitPrice: 28,
      comment: 'New batch',
    },
  ],
};

describe('submitUpdateSupply', () => {
  beforeEach(() => {
    updateSupplyMock.mockReset();
  });

  it('saves pending edits and finalizes in one versioned request', async () => {
    const updatedSupply = {
      ...initialSupply,
      status: SUPPLY_STATUS.COMPLETED,
      comment: null,
      version: 3,
    };
    updateSupplyMock.mockResolvedValue({ ok: true, data: updatedSupply });

    const result = await submitUpdateSupply({
      supplyId: 9,
      expectedVersion: 2,
      submitData: { comment: null, status: SUPPLY_STATUS.COMPLETED },
    });

    expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplyId: 9,
      expectedVersion: 2,
      comment: null,
      status: SUPPLY_STATUS.COMPLETED,
    });
    expect(result).toEqual({ ok: true, data: updatedSupply });
  });

  it('preserves backend version and field errors on update failure', async () => {
    const error = {
      status: 409,
      message: 'Supply was changed by another user.',
      fieldErrors: { expectedVersion: 'Version conflict' },
    };
    updateSupplyMock.mockResolvedValue({ ok: false, error });

    const result = await submitUpdateSupply({
      supplyId: 9,
      expectedVersion: 2,
      submitData: { status: SUPPLY_STATUS.COMPLETED },
    });

    expect(result).toEqual({ ok: false, error });
  });
});
