import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { getCreateTransferData } from './getCreateData';

const warehouse = (id: number) => ({
  id,
  name: `Warehouse ${id}`,
  status: WAREHOUSE_STATUS.ACTIVE,
});

describe('getCreateTransferData', () => {
  it('trims text, drops blank rows and omits empty comments', () => {
    expect(
      getCreateTransferData(
        {
          transferNumber: ' Weekend restock ',
          sourceWarehouse: warehouse(1),
          destinationWarehouse: warehouse(2),
          comment: '  ',
          transferEntries: [
            {
              clientId: 'a',
              stockItem: {
                productVariant: {
                  id: 11,
                  name: 'Rice',
                  sku: 'GR-1',
                  barcode: '',
                },
                unitOfMeasurement: { id: 4, name: 'Bag', symbol: 'bag' },
                available: 10,
              },
              quantity: 3,
              comment: ' ',
            },
            {
              clientId: 'b',
              stockItem: null,
              quantity: undefined,
              comment: '',
            },
          ],
        },
        TRANSFER_STATUS.DRAFT
      )
    ).toEqual({
      sourceWarehouseId: 1,
      destinationWarehouseId: 2,
      transferNumber: 'Weekend restock',
      status: TRANSFER_STATUS.DRAFT,
      transferEntries: [
        { productVariantId: 11, unitOfMeasurementId: 4, quantity: 3 },
      ],
    });
  });
});
