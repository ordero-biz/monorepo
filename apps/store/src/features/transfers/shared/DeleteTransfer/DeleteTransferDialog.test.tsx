import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteTransfer } from '@/lib/client/api/transfers';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteTransferDialog } from './DeleteTransferDialog';

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  deleteTransfer: vi.fn(),
}));

const deleteTransferMock = vi.mocked(deleteTransfer);

const { setup } = prepareStoreSetup({
  component: DeleteTransferDialog,
  props: {
    transfer: { id: 5, transferNumber: 'Weekend restock' },
    onDeleted: vi.fn(),
    onOpenChange: vi.fn(),
    open: true,
  },
});

describe('DeleteTransferDialog', () => {
  beforeEach(() => {
    deleteTransferMock.mockReset();
  });

  it('renders a confirmation dialog with the transfer number', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Delete transfer' });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete the "Weekend restock" transfer?'
    );
  });

  it('falls back to a generic message when the transfer has no number', () => {
    setup({ transfer: { id: 5, transferNumber: '' } });

    expect(
      screen.getByRole('dialog', { name: 'Delete transfer' })
    ).toHaveTextContent('Are you sure you want to delete this transfer?');
  });

  it('deletes the transfer, updates queries, and closes the dialog', async () => {
    const user = userEvent.setup();
    deleteTransferMock.mockResolvedValue({ ok: true, data: undefined });
    const { onDeleted, onOpenChange, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteTransferMock).toHaveBeenCalledWith(5);
    await waitFor(() => {
      expect(removeQueriesSpy).toHaveBeenCalledWith({
        queryKey: transfersQueryKeys.detail(5),
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: transfersQueryKeys.list,
      });
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onDeleted).toHaveBeenCalled();
  });

  it('prevents another deletion while the request is in flight', async () => {
    let resolveDelete:
      | ((value: Awaited<ReturnType<typeof deleteTransfer>>) => void)
      | undefined;

    deleteTransferMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeVisible();

    resolveDelete?.({ ok: true, data: undefined });

    await screen.findByRole('button', { name: 'Delete' });
  });

  it('disables deletion when disabled', async () => {
    const user = userEvent.setup();
    setup({ disabled: true });

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    expect(deleteButton).toBeDisabled();
    await user.click(deleteButton);
    expect(deleteTransferMock).not.toHaveBeenCalled();
  });

  it('shows a toast and stays open when deletion fails', async () => {
    const user = userEvent.setup();
    deleteTransferMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        message: 'Transfer delete failed',
      },
    });
    setup();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByRole('dialog', { name: 'Transfer delete failed' })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Delete transfer' })
    ).toBeVisible();
  });
});
