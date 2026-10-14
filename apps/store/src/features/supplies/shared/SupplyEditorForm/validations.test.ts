import type { SupplyEntryFormValues, SupplyFormValues } from './types';
import { createEmptySupplyEntry, getSupplyFormDefaults } from './utils';
import {
  validateSupplyEntryField,
  validateSupplyNumber,
  validateSupplySupplier,
  validateSupplyWarehouse,
} from './validations';

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

describe('supply validation', () => {
  it('requires supplier, warehouse and a nonblank supply number', () => {
    expect(validateSupplySupplier({ value: null })).toBe('Select a supplier');
    expect(validateSupplyWarehouse({ value: null })).toBe('Select a warehouse');
    expect(validateSupplyNumber({ value: '  ' })).toBe(
      'Supply number is required'
    );
    expect(validateSupplyNumber({ value: ' SUP-001 ' })).toBeUndefined();
    expect(
      validateSupplySupplier({ value: validForm().supplier })
    ).toBeUndefined();
    expect(
      validateSupplyWarehouse({ value: validForm().warehouse })
    ).toBeUndefined();
  });

  it.each([
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('rejects invalid selection IDs (%s)', (id) => {
    const value = { id, name: 'Invalid', status: 'ACTIVE' as const };
    expect(validateSupplySupplier({ value })).toBe('Select a supplier');
    expect(validateSupplyWarehouse({ value })).toBe('Select a warehouse');
  });

  it.each([
    null,
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('requires a valid product ID in a populated entry (%s)', (id) => {
    expect(
      validateSupplyEntryField({
        value: {
          ...completeEntry,
          productVariant: id === null ? null : { id, name: 'Invalid', sku: '' },
        },
        field: 'productVariant',
      })
    ).toBe('Select a product');
  });

  it.each([
    null,
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('requires a valid unit ID in a populated entry (%s)', (id) => {
    expect(
      validateSupplyEntryField({
        value: {
          ...completeEntry,
          unitOfMeasurement:
            id === null ? null : { id, name: 'Invalid', status: 'ACTIVE' },
        },
        field: 'unitOfMeasurement',
      })
    ).toBe('Select a unit');
  });

  it.each([
    '',
    ' ',
    '0',
    '-1',
    '1.5',
    'Infinity',
    'NaN',
    'abc',
  ])('rejects invalid quantities (%s)', (quantity) => {
    expect(
      validateSupplyEntryField({
        value: { ...completeEntry, quantity },
        field: 'quantity',
      })
    ).toBe(
      quantity.trim()
        ? 'Quantity must be a whole number greater than 0'
        : 'Quantity is required'
    );
  });

  it.each([
    '',
    ' ',
    '-1',
    'Infinity',
    'NaN',
    'abc',
  ])('rejects invalid prices (%s)', (unitPrice) => {
    expect(
      validateSupplyEntryField({
        value: { ...completeEntry, unitPrice },
        field: 'unitPrice',
      })
    ).toBe(
      unitPrice.trim()
        ? 'Unit price must be 0 or greater'
        : 'Unit price is required'
    );
  });

  it.each([
    '0',
    '1.25',
    ' 2 ',
  ])('accepts nonnegative finite prices (%s)', (unitPrice) => {
    expect(
      validateSupplyEntryField({
        value: { ...completeEntry, unitPrice },
        field: 'unitPrice',
      })
    ).toBeUndefined();
  });

  it.each([
    ['productVariant', 'Select a product'],
    ['unitOfMeasurement', 'Select a unit'],
    ['quantity', 'Quantity is required'],
    ['unitPrice', 'Unit price is required'],
  ] as const)('makes %s optional for blank rows and required for populated rows', (field, message) => {
    const blank = {
      ...createEmptySupplyEntry('blank'),
      comment: ' ',
      quantity: ' ',
      unitPrice: ' ',
    };
    expect(validateSupplyEntryField({ value: blank, field })).toBeUndefined();
    expect(
      validateSupplyEntryField({ value: { ...blank, comment: 'Note' }, field })
    ).toBe(message);
    expect(
      validateSupplyEntryField({ value: completeEntry, field })
    ).toBeUndefined();
  });
});
