import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { getTransferFormDefaults } from '../../../shared/TransferEditorForm';
import { getTransferUpdateChanges } from './getUpdateChanges';

const initialTransfer: TransferDetails = {
  id: 5,
  sourceWarehouse: {
    id: 1,
    name: 'Main Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  destinationWarehouse: {
    id: 2,
    name: 'East Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  transferNumber: 'Weekend restock',
  status: TRANSFER_STATUS.DRAFT,
  comment: 'Fragile',
  dispatchedAt: null,
  dispatchedBy: null,
  completedAt: null,
  completedBy: null,
  createdAt: '2026-11-17T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-11-17T10:00:00Z',
  updatedBy: 'owner@example.test',
  transferEntries: [
    {
      id: 17,
      productVariant: {
        barcode: '',
        id: 11,
        name: 'Jasmine Rice 5kg',
        sku: 'RICE-5KG',
      },
      unitOfMeasurement: {
        id: 4,
        name: 'Bag',
        status: 'ACTIVE',
        symbol: 'bag',
        comment: null,
      },
      quantity: 20,
      comment: 'Keep dry',
    },
  ],
  version: 2,
};

describe('getTransferUpdateChanges', () => {
  it('returns no PATCH for unchanged normalized values', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.transferNumber = ' Weekend restock ';
    value.comment = ' Fragile ';
    value.transferEntries[0].comment = ' Keep dry ';

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('ignores warehouse display changes when the ID is unchanged', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.destinationWarehouse = {
      id: 2,
      name: 'Renamed warehouse',
      status: WAREHOUSE_STATUS.DRAFT,
    };

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('submits only the warehouse IDs when the selections change', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.sourceWarehouse = {
      id: 3,
      name: 'North Hub',
      status: WAREHOUSE_STATUS.ACTIVE,
    };
    value.destinationWarehouse = {
      id: 4,
      name: 'Returns Center',
      status: WAREHOUSE_STATUS.ACTIVE,
    };

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({ sourceWarehouseId: 3, destinationWarehouseId: 4 });
  });

  it('sends null for a cleared comment', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.comment = '   ';

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({ comment: null });
  });

  it('ignores product display changes for an unchanged stock line', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.transferEntries[0].stockItem = {
      productVariant: {
        id: 11,
        name: 'Renamed rice',
        sku: 'NEW-SKU',
        barcode: '9999999999999',
      },
      unitOfMeasurement: { id: 4, name: 'Sack', symbol: 'sk' },
      available: 50,
    };

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toBeUndefined();
  });

  it('replaces the full entry list when a quantity changes', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.transferEntries[0].quantity = 15;

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({
      transferEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 4,
          quantity: 15,
          comment: 'Keep dry',
        },
      ],
    });
  });

  it('replaces entries without the comment to clear an entry comment', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.transferEntries[0].comment = '   ';

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({
      transferEntries: [
        { productVariantId: 11, unitOfMeasurementId: 4, quantity: 20 },
      ],
    });
  });

  it('sends an empty entry list after deleting the final product', () => {
    const value = getTransferFormDefaults(initialTransfer);
    value.transferEntries = getTransferFormDefaults().transferEntries;

    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: value,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({ transferEntries: [] });
  });

  it('returns only the status when starting an unchanged draft', () => {
    expect(
      getTransferUpdateChanges({
        transfer: initialTransfer,
        formValue: getTransferFormDefaults(initialTransfer),
        status: TRANSFER_STATUS.IN_TRANSIT,
      })
    ).toEqual({ status: TRANSFER_STATUS.IN_TRANSIT });
  });
});
