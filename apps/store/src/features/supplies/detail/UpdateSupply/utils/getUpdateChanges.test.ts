import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { getSupplyFormDefaults } from '../../../shared/SupplyEditorForm';
import { getSupplyUpdateChanges } from './getUpdateChanges';

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

describe('getSupplyUpdateChanges', () => {
  it('ignores product name, SKU, and status changes for an unchanged ID', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyEntries[0].productVariant = {
      id: 11,
      name: 'Renamed rice',
      sku: 'NEW-SKU',
    };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('serializes a replaced product as an ID in the full entry list', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyEntries[0].productVariant = {
      id: 12,
      name: 'Other rice',
      sku: '',
    };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({
      supplyEntries: [
        {
          productVariantId: 12,
          unitOfMeasurementId: 2,
          quantity: 20,
          unitPrice: 28,
          comment: 'New batch',
        },
      ],
    });
  });

  it('ignores unit name, symbol, and status changes for an unchanged ID', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyEntries[0].unitOfMeasurement = {
      id: 2,
      name: 'Renamed unit',
      symbol: 'NEW',
      status: 'DRAFT',
    };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('serializes a replaced unit as an ID in the full entry list', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplyEntries[0].unitOfMeasurement = {
      id: 3,
      name: 'Piece',
      symbol: null,
      status: 'ACTIVE',
    };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({
      supplyEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 3,
          quantity: 20,
          unitPrice: 28,
          comment: 'New batch',
        },
      ],
    });
  });

  it('ignores supplier display changes when the ID is unchanged', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplier = { id: 3, name: 'Renamed supplier', status: 'DRAFT' };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('submits only the supplier ID when the selection changes', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.supplier = { id: 8, name: 'Another supplier', status: 'ACTIVE' };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({ supplierId: 8 });
  });

  it('ignores warehouse display changes when the ID is unchanged', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.warehouse = { id: 4, name: 'Renamed warehouse', status: 'DRAFT' };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('submits only the warehouse ID when the selection changes', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.warehouse = { id: 8, name: 'Another warehouse', status: 'ACTIVE' };
    expect(
      getSupplyUpdateChanges({
        supply: initialSupply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({ warehouseId: 8 });
  });

  it.each([
    SUPPLY_STATUS.DRAFT,
    SUPPLY_STATUS.COMPLETED,
  ])('does not replace unchanged entries for a negative zero price when saving %s', (status) => {
    const supply = {
      ...initialSupply,
      supplyEntries: initialSupply.supplyEntries.map((entry) => ({
        ...entry,
        unitPrice: 0,
      })),
    };
    const value = getSupplyFormDefaults(supply);
    value.supplyEntries[0].unitPrice = '-0';

    expect(
      getSupplyUpdateChanges({ supply, formValue: value, status })
    ).toEqual(status === SUPPLY_STATUS.DRAFT ? undefined : { status });
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
      getSupplyUpdateChanges({
        formValue: value,
        supply: initialSupply,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('sends only changed metadata and null for cleared optional fields', () => {
    const value = getSupplyFormDefaults(initialSupply);
    value.warehouse = { id: 5, name: 'Another warehouse', status: 'ACTIVE' };
    value.supplierInvoiceNumber = '';
    value.comment = '   ';

    expect(
      getSupplyUpdateChanges({
        formValue: value,
        supply: initialSupply,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({
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
      getSupplyUpdateChanges({
        formValue: value,
        supply: initialSupply,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({
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
    value.supplyEntries = getSupplyFormDefaults().supplyEntries;

    expect(
      getSupplyUpdateChanges({
        formValue: value,
        supply: initialSupply,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({
      supplyEntries: [],
    });
  });

  it('returns the full entry list in the new order when products are reordered', () => {
    const supply = {
      ...initialSupply,
      supplyEntries: [
        ...initialSupply.supplyEntries,
        {
          ...initialSupply.supplyEntries[0],
          id: 18,
          productVariant: { id: 12, name: 'Brown rice' },
        },
      ],
    };
    const value = getSupplyFormDefaults(supply);
    value.supplyEntries = [value.supplyEntries[1], value.supplyEntries[0]];

    expect(
      getSupplyUpdateChanges({
        supply,
        formValue: value,
        status: SUPPLY_STATUS.DRAFT,
      })
    ).toEqual({
      supplyEntries: [
        {
          productVariantId: 12,
          unitOfMeasurementId: 2,
          quantity: 20,
          unitPrice: 28,
          comment: 'New batch',
        },
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

  it('returns only the status when finalizing an unchanged draft', () => {
    const value = getSupplyFormDefaults(initialSupply);

    expect(
      getSupplyUpdateChanges({
        formValue: value,
        supply: initialSupply,
        status: SUPPLY_STATUS.COMPLETED,
      })
    ).toEqual({
      status: SUPPLY_STATUS.COMPLETED,
    });
  });
});
