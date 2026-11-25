import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  deleteTransfer,
  getTransfer,
  updateTransfer,
} from '@/lib/client/api/transfers';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { clientRoutes } from '@/lib/client/routes';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { TransferDetail } from './TransferDetail';

const routerPushMock = vi.fn();

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  deleteTransfer: vi.fn(),
  getTransfer: vi.fn(),
  updateTransfer: vi.fn(),
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouses: vi.fn(),
}));

const deleteTransferMock = vi.mocked(deleteTransfer);
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
    deleteTransferMock.mockReset();
    getTransferMock.mockReset();
    routerPushMock.mockReset();
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
      screen.getByRole('heading', { name: 'Products to transfer' })
    ).toBeVisible();
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

  it('deletes the draft and navigates to the transfer list', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    deleteTransferMock.mockResolvedValue({ ok: true, data: undefined });
    const user = userEvent.setup();
    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Weekend restock' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Delete transfer' })
    );
    await user.click(
      within(screen.getByRole('dialog', { name: 'Delete transfer' })).getByRole(
        'button',
        { name: 'Delete' }
      )
    );

    expect(deleteTransferMock).toHaveBeenCalledWith(5);
    await waitFor(() =>
      expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.transfers)
    );
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

  it('refreshes an untouched editor and saves against the refreshed version', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await screen.findByRole('textbox', { name: 'Name' });
    const refreshedTransfer = {
      ...transfer,
      transferNumber: 'Tuesday restock',
      version: 2,
    };
    getTransferMock.mockResolvedValue({ ok: true, data: refreshedTransfer });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
        'Tuesday restock'
      )
    );
    expect(
      screen.getByRole('heading', { name: 'Tuesday restock' })
    ).toBeVisible();
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: { ...refreshedTransfer, comment: 'Fragile', version: 3 },
    });
    await user.type(
      screen.getByRole('textbox', { name: 'Comment' }),
      'Fragile'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith({
        transferId: 5,
        expectedVersion: 2,
        comment: 'Fragile',
      })
    );
  });

  it('preserves unsaved edits and the original version when a newer draft arrives', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Fragile'
    );
    getTransferMock.mockResolvedValue({
      ok: true,
      data: {
        ...transfer,
        transferNumber: 'Tuesday restock',
        version: 2,
      },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );

    const notice = await screen.findByRole('dialog', {
      name: 'Transfer changed',
    });
    expect(
      within(notice).getByText(/Your unsaved edits are preserved/)
    ).toBeVisible();
    await user.click(
      within(notice).getByRole('button', { name: 'Keep editing' })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Weekend restock' })
    ).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Fragile'
    );
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Weekend restock'
    );
    updateTransferMock.mockResolvedValue({
      ok: false,
      error: { status: 409, message: 'This transfer was changed.' },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith({
        transferId: 5,
        expectedVersion: 1,
        comment: 'Fragile',
      })
    );
  });

  it('applies non-conflicting updates and saves against the accepted version', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Fragile'
    );
    const refreshedTransfer = {
      ...transfer,
      transferNumber: 'Tuesday restock',
      version: 2,
    };
    getTransferMock.mockResolvedValue({ ok: true, data: refreshedTransfer });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );

    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Transfer changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Tuesday restock' })
    ).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Tuesday restock'
    );
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Fragile'
    );
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: { ...refreshedTransfer, comment: 'Fragile', version: 3 },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith({
        transferId: 5,
        expectedVersion: 2,
        comment: 'Fragile',
      })
    );
  });

  it('keeps edits available after dismissing the transfer started notice and blocks saving', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Unsaved comment'
    );
    getTransferMock.mockResolvedValue({
      ok: true,
      data: {
        ...transfer,
        status: TRANSFER_STATUS.IN_TRANSIT,
        version: 2,
      },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );

    const dialog = await screen.findByRole('dialog', {
      name: 'Transfer started',
    });
    expect(dialog).toHaveAccessibleDescription(
      'This transfer was started elsewhere. Your unsaved edits remain on this page, but can no longer be saved.'
    );
    expect(within(dialog).getAllByRole('button')).toHaveLength(1);
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('In transit')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Unsaved comment'
    );
    expect(
      screen.getByRole('button', { name: 'Actions for Weekend restock' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Transfer' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    fireEvent.submit(screen.getByRole('form', { name: 'Transfer' }));
    expect(updateTransferMock).not.toHaveBeenCalled();
  });

  it('blocks an already open delete confirmation when the transfer becomes read-only', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Unsaved comment'
    );
    await user.click(
      screen.getByRole('button', { name: 'Actions for Weekend restock' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Delete transfer' })
    );
    getTransferMock.mockResolvedValue({
      ok: true,
      data: { ...transfer, status: TRANSFER_STATUS.IN_TRANSIT, version: 2 },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Transfer started' })
      ).getByRole('button', { name: 'Close' })
    );

    const confirmation = screen.getByRole('dialog', {
      name: 'Delete transfer',
    });
    const deleteButton = within(confirmation).getByRole('button', {
      name: 'Delete',
    });
    expect(deleteButton).toBeDisabled();
    await user.click(deleteButton);
    expect(deleteTransferMock).not.toHaveBeenCalled();
  });

  it('blocks an already open start transfer confirmation when the transfer becomes read-only', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Unsaved comment'
    );
    await user.click(screen.getByRole('button', { name: 'Transfer' }));
    getTransferMock.mockResolvedValue({
      ok: true,
      data: { ...transfer, status: TRANSFER_STATUS.IN_TRANSIT, version: 2 },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Transfer started' })
      ).getByRole('button', { name: 'Close' })
    );

    const confirmation = screen.getByRole('dialog', {
      name: 'Start transfer',
    });
    const startTransfer = within(confirmation).getByRole('button', {
      name: 'Start transfer',
    });
    expect(startTransfer).toBeDisabled();
    await user.click(startTransfer);
    expect(updateTransferMock).not.toHaveBeenCalled();
  });

  it('hides the draft editor when a transfer is started elsewhere without local edits', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const { queryClient } = setup();
    await screen.findByRole('textbox', { name: 'Name' });
    getTransferMock.mockResolvedValue({
      ok: true,
      data: {
        ...transfer,
        status: TRANSFER_STATUS.IN_TRANSIT,
        version: 2,
      },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );

    expect(await screen.findByText('In transit')).toBeVisible();
    expect(
      screen.getByText(
        'Details for this transfer status are not available yet.'
      )
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Transfer' })
    ).not.toBeInTheDocument();
  });

  it.each([
    'local',
    'server',
  ] as const)('resolves source warehouse and product conflicts as one coupled %s choice', async (choice) => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Fragile'
    );
    const quantityInput = screen.getByRole('textbox', {
      name: 'Quantity for row 1',
    });
    await user.clear(quantityInput);
    await user.type(quantityInput, '8');

    const latest = {
      ...transfer,
      sourceWarehouse: {
        id: 3,
        name: 'North Hub',
        status: WAREHOUSE_STATUS.ACTIVE,
      },
      transferEntries: [],
      version: 2,
    };
    getTransferMock.mockResolvedValue({ ok: true, data: latest });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );

    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Transfer changed' })
      ).getByRole('button', { name: 'Keep editing' })
    );
    const actions = within(
      screen.getByRole('complementary', { name: 'Transfer creation actions' })
    );
    await user.click(actions.getByRole('button', { name: 'Review updates' }));

    const dialog = screen.getByRole('dialog', { name: 'Review updates' });
    expect(
      within(dialog).queryByRole('radiogroup', { name: 'From warehouse' })
    ).not.toBeInTheDocument();
    const productsGroup = within(dialog).getByRole('radiogroup', {
      name: 'Products to transfer',
    });
    expect(productsGroup).toHaveAccessibleDescription(
      'Products belong to the source warehouse. Choose one source warehouse and its complete product list.'
    );

    await user.click(
      within(productsGroup).getByRole('radio', {
        name:
          choice === 'local'
            ? 'Your product list (1 row)'
            : 'Saved product list (0 rows)',
      })
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Apply changes' })
    );

    expect(
      screen.getByRole('combobox', { name: /From warehouse/ })
    ).toHaveValue(choice === 'local' ? 'Main Warehouse' : 'North Hub');
    expect(
      screen.getByRole('textbox', { name: 'Quantity for row 1' })
    ).toHaveValue(choice === 'local' ? '8' : '');
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Fragile'
    );
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: {
        ...(choice === 'local' ? transfer : latest),
        comment: 'Fragile',
        version: 3,
      },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenCalledExactlyOnceWith(
        choice === 'local'
          ? {
              transferId: 5,
              expectedVersion: 2,
              sourceWarehouseId: 1,
              comment: 'Fragile',
              transferEntries: [
                {
                  productVariantId: 11,
                  unitOfMeasurementId: 4,
                  quantity: 8,
                  comment: 'Keep dry',
                },
              ],
            }
          : {
              transferId: 5,
              expectedVersion: 2,
              comment: 'Fragile',
            }
      )
    );
  });

  it('keeps a newer server version when an earlier save response arrives afterwards', async () => {
    getTransferMock.mockResolvedValue({ ok: true, data: transfer });
    const response =
      Promise.withResolvers<Awaited<ReturnType<typeof updateTransfer>>>();
    updateTransferMock.mockReturnValue(response.promise);
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Fragile'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() => expect(updateTransferMock).toHaveBeenCalled());

    const savedTransfer = {
      ...transfer,
      comment: 'Fragile',
      version: 2,
    };
    const latestTransfer = {
      ...savedTransfer,
      transferNumber: 'Latest restock',
      version: 3,
    };
    getTransferMock.mockResolvedValue({ ok: true, data: latestTransfer });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: transfersQueryKeys.detail(5) })
    );

    await act(() => response.resolve({ ok: true, data: savedTransfer }));

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
        'Latest restock'
      )
    );
    expect(
      screen.getByRole('heading', { name: 'Latest restock' })
    ).toBeVisible();
    updateTransferMock.mockResolvedValue({
      ok: true,
      data: { ...latestTransfer, comment: 'Updated note', version: 4 },
    });
    const commentInput = screen.getByRole('textbox', { name: 'Comment' });
    await user.clear(commentInput);
    await user.type(commentInput, 'Updated note');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateTransferMock).toHaveBeenLastCalledWith({
        transferId: 5,
        expectedVersion: 3,
        comment: 'Updated note',
      })
    );
  });
});
