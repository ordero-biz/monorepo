import type { SupplyDetails } from '@/lib/domain/supplies/types';
import type { SupplyEntryFormValues, SupplyFormValues } from './types';
import {
  createEmptySupplyEntry,
  getSupplyEntriesPayload,
  getSupplyFormDefaults,
  getSupplyTotal,
} from './utils';

const completeEntry: SupplyEntryFormValues = {
  ...createEmptySupplyEntry('new-1'),
  productVariant: { id: 11, name: 'Jasmine Rice 5kg', sku: 'RICE-5KG' },
  unitOfMeasurement: { id: 2, name: 'Bag', symbol: 'bag', status: 'ACTIVE' },
  quantity: '20',
  unitPrice: '28',
  comment: ' New batch ',
};

const validForm = (): SupplyFormValues => ({
  ...getSupplyFormDefaults(),
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
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
    expect(getSupplyFormDefaults().supplier).toBeNull();
    expect(defaults.supplier).toEqual(initialSupply.supplier);
    expect(defaults.supplier).not.toBe(initialSupply.supplier);
    expect(getSupplyFormDefaults().warehouse).toBeNull();
    expect(defaults.warehouse).toEqual(initialSupply.warehouse);
    expect(defaults.warehouse).not.toBe(initialSupply.warehouse);

    expect(defaults).toMatchObject({
      supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
      warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
      supplyNumber: 'SUP-001',
      supplierInvoiceNumber: 'INV-001',
      comment: 'Delivery',
    });
    expect(defaults.supplyEntries[0]).toMatchObject({
      clientId: 'existing-17',
      productVariant: { id: 11, name: 'Jasmine Rice 5kg', sku: 'RICE-5KG' },
      unitOfMeasurement: {
        id: 2,
        name: 'Bag',
        symbol: 'bag',
        status: 'ACTIVE',
      },
      quantity: '20',
      unitPrice: '28',
    });
    expect(defaults.supplyEntries[0].productVariant).not.toBe(
      initialSupply.supplyEntries[0].productVariant
    );
    expect(defaults.supplyEntries[1].productVariant).toBeNull();
    expect(defaults.supplyEntries[0].unitOfMeasurement).not.toBe(
      initialSupply.supplyEntries[0].unitOfMeasurement
    );
    expect(defaults.supplyEntries[1].unitOfMeasurement).toBeNull();
    expect(defaults.supplyEntries[1]).toEqual(
      createEmptySupplyEntry('initial-placeholder')
    );
    expect(defaults.supplyEntries[0]?.clientId).not.toBe(
      defaults.supplyEntries[1]?.clientId
    );
  });

  it.each([
    null,
    0,
    -1,
    1.5,
    Number.NaN,
  ])('excludes entries with invalid product or unit IDs (%s) from totals', (id) => {
    const value = validForm();
    value.supplyEntries = [
      {
        ...completeEntry,
        productVariant: id === null ? null : { id, name: 'Invalid', sku: '' },
      },
    ];
    expect(getSupplyTotal(value)).toEqual({ count: 0, total: 0 });
    value.supplyEntries = [
      {
        ...completeEntry,
        unitOfMeasurement:
          id === null ? null : { id, name: 'Invalid', status: 'ACTIVE' },
      },
    ];
    expect(getSupplyTotal(value)).toEqual({ count: 0, total: 0 });
  });

  it('omits the blank placeholder from payload and totals complete rows', () => {
    const value = validForm();
    value.supplyEntries.unshift(completeEntry);

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
      {
        ...createEmptySupplyEntry('new-2'),
        productVariant: { id: 12, name: 'Another product', sku: '' },
      },
      createEmptySupplyEntry('initial-placeholder'),
    ];

    expect(getSupplyTotal(value)).toEqual({ count: 1, total: 0 });
  });

  it('explicitly clears an empty entry comment', () => {
    const value = validForm();
    value.supplyEntries.unshift({
      ...completeEntry,
      comment: ' ',
    });

    expect(getSupplyEntriesPayload(value)[0]?.comment).toBeNull();
  });
});
