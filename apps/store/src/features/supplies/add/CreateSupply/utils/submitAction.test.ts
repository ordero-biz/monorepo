import { createSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { submitCreateSupply } from './submitAction';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  createSupply: vi.fn(),
}));

const createSupplyMock = vi.mocked(createSupply);

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

describe('submitCreateSupply', () => {
  beforeEach(() => {
    createSupplyMock.mockReset();
  });

  it('submits prepared create data and returns the saved result', async () => {
    createSupplyMock.mockResolvedValue({ ok: true, data: initialSupply });
    const result = await submitCreateSupply({
      supplierId: 3,
      warehouseId: 4,
      supplyNumber: 'SUP-001',
      supplyEntries: [],
      status: SUPPLY_STATUS.DRAFT,
    });

    expect(createSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplierId: 3,
      warehouseId: 4,
      supplyNumber: 'SUP-001',
      supplyEntries: [],
      status: SUPPLY_STATUS.DRAFT,
    });
    expect(result).toEqual({ ok: true, data: initialSupply });
  });

  it('preserves backend field errors on create failure', async () => {
    const error = {
      status: 422,
      message: 'Supply number is already used.',
      fieldErrors: { supplyNumber: 'Already used' },
    };
    createSupplyMock.mockResolvedValue({ ok: false, error });

    const result = await submitCreateSupply({
      supplierId: 3,
      warehouseId: 4,
      supplyNumber: 'SUP-001',
      status: SUPPLY_STATUS.DRAFT,
    });

    expect(result).toEqual({ ok: false, error });
  });
});
