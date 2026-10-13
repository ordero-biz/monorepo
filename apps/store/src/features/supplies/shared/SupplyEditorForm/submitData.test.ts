import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { getCreateSupplyData, getUpdateSupplyData } from './submitData';
import { getSupplyFormDefaults } from './utils';

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

describe('supply submit data', () => {
  it('omits blank optional metadata and the empty entry row on create', () => {
    const value = getSupplyFormDefaults();
    value.supplierId = '3';
    value.warehouseId = '4';
    value.supplyNumber = ' SUP-001 ';
    value.supplierInvoiceNumber = '   ';
    value.comment = '   ';

    expect(getCreateSupplyData(value, SUPPLY_STATUS.DRAFT)).toEqual({
      supplierId: 3,
      warehouseId: 4,
      supplyNumber: 'SUP-001',
      status: SUPPLY_STATUS.DRAFT,
      supplyEntries: [],
    });
  });

  it('keeps filled optional metadata and nested entries on create', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplierInvoiceNumber = ' INV-001 ';
    value.comment = ' First delivery ';

    expect(getCreateSupplyData(value, SUPPLY_STATUS.COMPLETED)).toEqual({
      supplierId: 3,
      warehouseId: 4,
      supplyNumber: 'SUP-001',
      supplierInvoiceNumber: 'INV-001',
      comment: 'First delivery',
      status: SUPPLY_STATUS.COMPLETED,
      supplyEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 2,
          quantity: 20,
          unitPrice: 28,
          comment: 'New batch',
        },
      ],
    });
  });

  it('omits a blank nested comment when creating an entry', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyEntries = value.supplyEntries.map((entry, index) =>
      index === 0 ? { ...entry, comment: '   ' } : entry
    );

    expect(
      getCreateSupplyData(value, SUPPLY_STATUS.DRAFT).supplyEntries
    ).toEqual([
      {
        productVariantId: 11,
        unitOfMeasurementId: 2,
        quantity: 20,
        unitPrice: 28,
      },
    ]);
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
      getUpdateSupplyData(value, initialSupply, SUPPLY_STATUS.DRAFT)
    ).toBeNull();
  });

  it('sends only changed metadata and null for cleared optional fields', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.warehouseId = '5';
    value.supplierInvoiceNumber = '';
    value.comment = '   ';

    expect(
      getUpdateSupplyData(value, initialSupply, SUPPLY_STATUS.DRAFT)
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
      getUpdateSupplyData(value, initialSupply, SUPPLY_STATUS.DRAFT)
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
      getUpdateSupplyData(value, initialSupply, SUPPLY_STATUS.DRAFT)
    ).toEqual({
      supplyId: 9,
      expectedVersion: 2,
      supplyEntries: [],
    });
  });

  it('sends only the status and version when finalizing an unchanged draft', () => {
    const value = getSupplyFormDefaults(initialSupply);

    expect(
      getUpdateSupplyData(value, initialSupply, SUPPLY_STATUS.COMPLETED)
    ).toEqual({
      supplyId: 9,
      expectedVersion: 2,
      status: SUPPLY_STATUS.COMPLETED,
    });
  });
});
