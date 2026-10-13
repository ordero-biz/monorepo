import type { SupplyDetails } from '@/lib/domain/supplies/types';
import type { SupplyEntryFormValues, SupplyFormValues } from './types';
import {
  createEmptySupplyEntry,
  getSupplyEntriesPayload,
  getSupplyFormDefaults,
  getSupplyTotal,
  validateSupplyForm,
} from './utils';

const completeEntry: SupplyEntryFormValues = {
  ...createEmptySupplyEntry('new-1'),
  productVariantId: '11',
  productVariantName: 'Jasmine Rice 5kg',
  productVariantSku: 'RICE-5KG',
  unitOfMeasurementId: '2',
  unitOfMeasurementName: 'Bag (bag)',
  quantity: '20',
  unitPrice: '28',
  comment: ' New batch ',
};

const validForm = (): SupplyFormValues => ({
  ...getSupplyFormDefaults(),
  supplierId: '3',
  warehouseId: '4',
  supplyNumber: 'SUP-001',
});

describe('supply form utilities', () => {
  it('starts with a single blank entry and maps existing entries to editable values', () => {
    expect(getSupplyFormDefaults().supplyEntries).toEqual([
      createEmptySupplyEntry('initial-placeholder'),
    ]);

    const initialSupply: SupplyDetails = {
      id: 8,
      supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
      warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
      status: 'DRAFT',
      supplyNumber: 'SUP-001',
      supplierInvoiceNumber: 'INV-001',
      comment: 'Delivery',
      totalQuantity: 20,
      totalPrice: 560,
      version: 1,
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

    const defaults = getSupplyFormDefaults(initialSupply);

    expect(defaults).toMatchObject({
      supplierId: '3',
      supplierName: 'Global Foods',
      warehouseId: '4',
      warehouseName: 'Main Warehouse',
      supplyNumber: 'SUP-001',
      supplierInvoiceNumber: 'INV-001',
      comment: 'Delivery',
    });
    expect(defaults.supplyEntries[0]).toMatchObject({
      clientId: 'existing-17',
      productVariantId: '11',
      unitOfMeasurementId: '2',
      quantity: '20',
      unitPrice: '28',
    });
    expect(defaults.supplyEntries[1]).toEqual(
      createEmptySupplyEntry('initial-placeholder')
    );
    expect(defaults.supplyEntries[0]?.clientId).not.toBe(
      defaults.supplyEntries[1]?.clientId
    );
  });

  it('requires metadata but allows no products in a draft', () => {
    expect(validateSupplyForm(getSupplyFormDefaults(), false)).toEqual({
      fields: {
        supplierId: 'Select a supplier',
        warehouseId: 'Select a warehouse',
        supplyNumber: 'Supply number is required',
      },
    });
    expect(validateSupplyForm(validForm(), false)).toBeUndefined();
    expect(validateSupplyForm(validForm(), true)).toEqual({
      fields: { supplyEntries: 'Add at least one product' },
    });
  });

  it('validates every partially filled row using TanStack bracket paths', () => {
    const value = validForm();
    value.supplyEntries[0] = {
      ...createEmptySupplyEntry('new-1'),
      comment: 'Only a note',
      quantity: '0',
      unitPrice: '-2',
    };

    expect(validateSupplyForm(value, false)).toEqual({
      fields: {
        'supplyEntries[0].productVariantId': 'Select a product',
        'supplyEntries[0].unitOfMeasurementId': 'Select a unit',
        'supplyEntries[0].quantity':
          'Quantity must be a whole number greater than 0',
        'supplyEntries[0].unitPrice': 'Unit price must be 0 or greater',
      },
    });
  });

  it('omits the blank placeholder from payload and totals complete rows', () => {
    const value = validForm();
    value.supplyEntries.unshift(completeEntry);

    expect(validateSupplyForm(value, true)).toBeUndefined();
    expect(getSupplyEntriesPayload(value)).toEqual([
      {
        productVariantId: 11,
        unitOfMeasurementId: 2,
        quantity: 20,
        unitPrice: 28,
        comment: 'New batch',
      },
    ]);
    expect(getSupplyTotal(value)).toEqual({ count: 1, total: 560 });
  });

  it('accepts a zero unit price and does not count an incomplete row', () => {
    const value = validForm();
    value.supplyEntries = [
      { ...completeEntry, unitPrice: '0' },
      { ...createEmptySupplyEntry('new-2'), productVariantId: '12' },
      createEmptySupplyEntry('initial-placeholder'),
    ];

    expect(getSupplyTotal(value)).toEqual({ count: 1, total: 0 });
    expect(validateSupplyForm(value, true)?.fields).toMatchObject({
      'supplyEntries[1].unitOfMeasurementId': 'Select a unit',
      'supplyEntries[1].quantity': 'Quantity is required',
      'supplyEntries[1].unitPrice': 'Unit price is required',
    });
  });

  it('requires a whole quantity and explicitly clears an empty entry comment', () => {
    const value = validForm();
    value.supplyEntries.unshift({
      ...completeEntry,
      quantity: '1.5',
      comment: ' ',
    });

    expect(validateSupplyForm(value, true)?.fields).toMatchObject({
      'supplyEntries[0].quantity':
        'Quantity must be a whole number greater than 0',
    });
    expect(getSupplyEntriesPayload(value)[0]?.comment).toBeNull();
  });
});
