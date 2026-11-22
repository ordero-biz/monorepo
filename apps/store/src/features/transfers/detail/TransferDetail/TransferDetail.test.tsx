import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTransfer, updateTransfer } from '@/lib/client/api/transfers';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { TransferDetail } from './TransferDetail';

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  getTransfer: vi.fn(),
  updateTransfer: vi.fn(),
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouses: vi.fn(),
}));

const getTransferMock = vi.mocked(getTransfer);
const getWarehousesMock = vi.mocked(getWarehouses);
const updateTransferMock = vi.mocked(updateTransfer);

const { setup } = prepareStoreSetup({
  component: TransferDetail,
  props: {
    transferId: '5',
  },
});

const transfer = {
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
      comment: 'Keep dry',
    },
  ],
  version: 1,
} as TransferDetails;

describe('TransferDetail', () => {
  beforeEach(() => {
    getTransferMock.mockReset();
    updateTransferMock.mockReset();
  });

  it('opens a draft transfer in the editor', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });

    setup();

    expect(await screen.findByRole('textbox', { name: 'Name' })).toHaveValue(
      'Weekend restock'
    );
    expect(getTransferMock).toHaveBeenCalledWith('5');
    expect(screen.getByText('Draft')).toBeVisible();
    expect(
      screen.getByRole('combobox', { name: /From warehouse/ })
    ).toHaveValue('Main Warehouse');
    expect(
      screen.getByRole('textbox', { name: 'Quantity for row 1' })
    ).toHaveValue('5');
    expect(
      screen.getByRole('textbox', { name: 'Comment for row 1' })
    ).toHaveValue('Keep dry');
  });

  it('saves only the changed fields against the loaded version', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: { ...transfer, transferNumber: 'Monday restock', version: 2 },
    });
    const user = userEvent.setup();
    setup();

    const nameInput = await screen.findByRole('textbox', { name: 'Name' });
    await user.clear(nameInput);
    await user.type(nameInput, ' Monday restock ');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith({
        transferId: 5,
        expectedVersion: 1,
        transferNumber: 'Monday restock',
      })
    );
    expect(await screen.findByText('Transfer draft saved.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('No changes to save.')).toBeVisible();
    expect(updateTransferMock).toHaveBeenCalledTimes(1);
  });

  it('confirms a source change and saves it with the emptied product list', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          { ...transfer.sourceWarehouse, address: null },
          { ...transfer.destinationWarehouse, address: null },
          {
            id: 3,
            name: 'North Hub',
            status: WAREHOUSE_STATUS.ACTIVE,
            address: null,
          },
        ],
        page: { size: 20, number: 0, totalElements: 3, totalPages: 1 },
      },
    } as Awaited<ReturnType<typeof getWarehouses>>);
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: {
        ...transfer,
        sourceWarehouse: {
          id: 3,
          name: 'North Hub',
          status: WAREHOUSE_STATUS.ACTIVE,
        },
        transferEntries: [],
        version: 2,
      },
    });
    const user = userEvent.setup();
    setup();

    const source = await screen.findByRole('combobox', {
      name: /From warehouse/,
    });
    await user.click(source);
    await user.click(await screen.findByRole('option', { name: /North Hub/ }));
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Change source warehouse?' })
      ).getByRole('button', { name: 'Change and remove products' })
    );
    expect(source).toHaveValue('North Hub');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith({
        transferId: 5,
        expectedVersion: 1,
        sourceWarehouseId: 3,
        transferEntries: [],
      })
    );
  });

  it('keeps edits after a failed save so the user can retry', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    updateTransferMock.mockResolvedValue({
      ok: false,
      error: { status: 409, message: 'This transfer was changed.' },
    });
    const user = userEvent.setup();
    setup();

    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Fragile'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(await screen.findByText('This transfer was changed.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Fragile'
    );
  });

  it('starts the transfer after confirmation', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: { ...transfer, status: TRANSFER_STATUS.IN_TRANSIT, version: 2 },
    });
    const user = userEvent.setup();
    setup();

    await user.click(await screen.findByRole('button', { name: 'Transfer' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Start transfer' })).getByRole(
        'button',
        { name: 'Start transfer' }
      )
    );

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith({
        transferId: 5,
        expectedVersion: 1,
        status: TRANSFER_STATUS.IN_TRANSIT,
      })
    );
    expect(await screen.findByText('In transit')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Save draft' })
    ).not.toBeInTheDocument();
  });

  it('retries when the transfer cannot be loaded', async () => {
    getTransferMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load transfer.' },
      })
      .mockResolvedValueOnce({ ok: true, data: transfer });
    const user = userEvent.setup();
    setup();

    expect(
      await screen.findByText("We couldn't load this transfer right now.")
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('textbox', { name: 'Name' })).toHaveValue(
      'Weekend restock'
    );
  });
});
