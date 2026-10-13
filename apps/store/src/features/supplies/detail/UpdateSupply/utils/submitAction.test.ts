import { updateSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { getSupplyFormDefaults } from '../../../shared/SupplyEditorForm';
import { getUpdateSupplyData, submitUpdateSupply } from './submitAction';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  updateSupply: vi.fn(),
}));

const updateSupplyMock = vi.mocked(updateSupply);

const initialSupply: SupplyDetails = {
  id: 9,
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-001',
  supplierInvoiceNumber: 'INV-001',
  comment: 'First delivery',
  totalQuantity: 20,
  totalPrice: 560,
  version: 2,
  supplyEntries: [
    {
      id: 17,
      productVariant: { id: 11, name: 'Jasmine Rice 5kg', sku: 'RICE-5KG' },
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

  it('skips the request when normalized draft values have not changed', async () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyNumber = ' SUP-001 ';

    const result = await submitUpdateSupply({
      value,
      initialSupply,
      status: SUPPLY_STATUS.DRAFT,
    });

    expect(result).toBeNull();
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it('saves pending edits and finalizes in one versioned request', async () => {
    const updatedSupply = {
      ...initialSupply,
      status: SUPPLY_STATUS.COMPLETED,
      comment: null,
      version: 3,
    };
    updateSupplyMock.mockResolvedValue({ ok: true, data: updatedSupply });
    const value = getSupplyFormDefaults(initialSupply);
    value.comment = '   ';

    const result = await submitUpdateSupply({
      value,
      initialSupply,
      status: SUPPLY_STATUS.COMPLETED,
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
      value: getSupplyFormDefaults(initialSupply),
      initialSupply,
      status: SUPPLY_STATUS.COMPLETED,
    });

    expect(result).toEqual({ ok: false, error });
  });

  it('returns no PATCH for unchanged normalized values', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyNumber = ' SUP-001 ';
    value.supplierInvoiceNumber = ' INV-001 ';
    value.comment = ' First delivery ';
    value.supplyEntries = value.supplyEntries.map((entry, index) =>
      index === 0
        ? {
            ...entry,
            quantity: '020',
            unitPrice: '28.00',
            comment: ' New batch ',
          }
        : entry
    );

    expect(
      getUpdateSupplyData({ value, initialSupply, status: SUPPLY_STATUS.DRAFT })
    ).toBeNull();
  });

  it('sends only changed metadata and null for cleared optional fields', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.warehouseId = '5';
    value.supplierInvoiceNumber = '';
    value.comment = '   ';

    expect(
      getUpdateSupplyData({ value, initialSupply, status: SUPPLY_STATUS.DRAFT })
    ).toEqual({
      supplyId: 9,
      expectedVersion: 2,
      warehouseId: 5,
      supplierInvoiceNumber: null,
      comment: null,
    });
  });

  it('replaces entries to clear an entry comment explicitly', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyEntries = value.supplyEntries.map((entry, index) =>
      index === 0 ? { ...entry, comment: '   ' } : entry
    );

    expect(
      getUpdateSupplyData({ value, initialSupply, status: SUPPLY_STATUS.DRAFT })
    ).toEqual({
      supplyId: 9,
      expectedVersion: 2,
      supplyEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 2,
          quantity: 20,
          unitPrice: 28,
          comment: null,
        },
      ],
    });
  });

  it('sends an empty entry list after deleting the final product', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyEntries = value.supplyEntries.slice(-1);

    expect(
      getUpdateSupplyData({ value, initialSupply, status: SUPPLY_STATUS.DRAFT })
    ).toEqual({
      supplyId: 9,
      expectedVersion: 2,
      supplyEntries: [],
    });
  });

  it('sends only the status and version when finalizing an unchanged draft', () => {
    const value = getSupplyFormDefaults(initialSupply);

    expect(
      getUpdateSupplyData({
        value,
        initialSupply,
        status: SUPPLY_STATUS.COMPLETED,
      })
    ).toEqual({
      supplyId: 9,
      expectedVersion: 2,
      status: SUPPLY_STATUS.COMPLETED,
    });
  });
});
