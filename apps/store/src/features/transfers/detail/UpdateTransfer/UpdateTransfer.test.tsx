import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateTransfer } from '@/lib/client/api/transfers';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateTransfer } from './UpdateTransfer';

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  updateTransfer: vi.fn(),
}));

const updateTransferMock = vi.mocked(updateTransfer);

const transfer: TransferDetails = {
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
  comment: null,
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
      productVariant: { id: 11, name: 'Rice', sku: 'GR-1', barcode: '' },
      unitOfMeasurement: {
        id: 4,
        name: 'Bag',
        symbol: 'bag',
        status: 'ACTIVE',
        comment: null,
      },
      quantity: 5,
      comment: null,
    },
  ],
  version: 1,
};

const { setup } = prepareStoreSetup({
  component: UpdateTransfer,
  props: { transfer },
});

describe('UpdateTransfer', () => {
  beforeEach(() => {
    updateTransferMock.mockReset();
  });

  it('shows the draft note and editor', () => {
    setup();

    expect(screen.getByRole('note')).toHaveTextContent(
      'Nothing has left the warehouse yet.'
    );
    expect(screen.getByRole('form', { name: 'Transfer' })).toBeVisible();
  });

  it('shows a placeholder instead of the editor for other statuses', () => {
    setup({
      transfer: { ...transfer, status: TRANSFER_STATUS.IN_TRANSIT },
    });

    expect(
      screen.getByText(
        'Details for this transfer status are not available yet.'
      )
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Transfer' })
    ).not.toBeInTheDocument();
  });

  it('caches the saved draft, refreshes the list and saves against the new version', async () => {
    const savedTransfer = {
      ...transfer,
      transferNumber: 'Monday restock',
      version: 2,
    };
    updateTransferMock
      .mockResolvedValueOnce({ ok: true, data: savedTransfer })
      .mockResolvedValueOnce({
        ok: true,
        data: { ...savedTransfer, comment: 'Fragile', version: 3 },
      });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    await user.clear(nameInput);
    await user.type(nameInput, 'Monday restock');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    // The button label returns once the save, cache update and reset finish.
    await screen.findByRole('button', { name: 'Save draft' });
    expect(queryClient.getQueryData(transfersQueryKeys.detail(5))).toEqual(
      savedTransfer
    );
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: transfersQueryKeys.list,
    });
    expect(invalidateQueries).not.toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.stock(1),
    });

    await user.type(
      screen.getByRole('textbox', { name: 'Comment' }),
      'Fragile'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenLastCalledWith({
        transferId: 5,
        expectedVersion: 2,
        comment: 'Fragile',
      })
    );
  });

  it('refreshes both warehouses after starting the transfer', async () => {
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: { ...transfer, status: TRANSFER_STATUS.IN_TRANSIT, version: 2 },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Transfer' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Start transfer' })).getByRole(
        'button',
        { name: 'Start transfer' }
      )
    );

    expect(
      await screen.findByText(
        'Details for this transfer status are not available yet.'
      )
    ).toBeVisible();
    for (const warehouseId of [1, 2]) {
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: warehousesQueryKeys.stock(warehouseId),
      });
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: warehousesQueryKeys.detail(warehouseId),
      });
    }
  });
});
