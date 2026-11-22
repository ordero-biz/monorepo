import { mapTransferFieldErrors } from './mapTransferFieldErrors';

const row = (clientId: string) => ({
  clientId,
  stockItem: null,
  quantity: undefined,
  comment: '',
});

describe('mapTransferFieldErrors', () => {
  it('maps backend names to form fields and current row positions', () => {
    expect(
      mapTransferFieldErrors({
        fieldErrors: {
          sourceWarehouseId: 'Source is archived',
          transferNumber: 'Name is taken',
          'transferEntries.0.productVariantId': 'Product is archived',
          'transferEntries.1.quantity': 'Not enough stock',
          'transferEntries.2.quantity': 'Removed row',
        },
        submittedEntryIds: ['a', 'b', 'gone'],
        currentEntries: [row('b'), row('a')],
      })
    ).toEqual({
      sourceWarehouse: 'Source is archived',
      transferNumber: 'Name is taken',
      'transferEntries[1].stockItem': 'Product is archived',
      'transferEntries[0].quantity': 'Not enough stock',
    });
  });
});
