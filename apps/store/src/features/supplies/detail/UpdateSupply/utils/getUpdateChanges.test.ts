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
    value.warehouseId = '5';
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
    value.supplyEntries = value.supplyEntries.slice(-1);

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
    value.supplyEntries = [
      value.supplyEntries[1],
      value.supplyEntries[0],
      value.supplyEntries[2],
    ];

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
