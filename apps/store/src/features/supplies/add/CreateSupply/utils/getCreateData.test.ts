import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { getSupplyFormDefaults } from '../../../shared/SupplyEditorForm';
import { getCreateSupplyData } from './getCreateData';

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

describe('getCreateSupplyData', () => {
  it('omits blank optional metadata and the empty entry row on create', () => {
    const value = getSupplyFormDefaults();
    value.supplier = { id: 3, name: 'Global Foods', status: 'ACTIVE' };
    value.warehouse = { id: 4, name: 'Main Warehouse', status: 'ACTIVE' };
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
});
