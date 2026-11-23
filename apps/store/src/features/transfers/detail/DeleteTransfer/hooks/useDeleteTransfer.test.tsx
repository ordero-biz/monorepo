import { act, renderHook, waitFor } from '@testing-library/react';
import { deleteTransfer } from '@/lib/client/api/transfers';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useDeleteTransfer } from './useDeleteTransfer';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  deleteTransfer: vi.fn(),
}));

const deleteTransferMock = vi.mocked(deleteTransfer);

const setupDeleteTransferHook = () => {
  const onDeleted = vi.fn();
  const TestQueryProvider = createTestQueryProvider(createTestQueryClient());
  const { result } = renderHook(
    () =>
      useDeleteTransfer({
        transferId: 5,
        onDeleted,
      }),
    {
      wrapper: TestQueryProvider,
    }
  );

  return {
    result,
    onDeleted,
  };
};

describe('useDeleteTransfer', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteTransferMock.mockReset();
  });

  it('deletes the transfer and runs success cleanup', async () => {
    deleteTransferMock.mockResolvedValue({ ok: true, data: undefined });
    const { onDeleted, result } = setupDeleteTransferHook();

    expect(result.current.isDeleting).toBe(false);

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() => expect(deleteTransferMock).toHaveBeenCalledWith(5));
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Transfer was deleted.',
      type: 'success',
    });
    expect(result.current.isDeleting).toBe(false);
  });

  it('shows a toast and skips success cleanup when delete fails', async () => {
    deleteTransferMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        message: 'Transfer delete failed',
      },
    });
    const { onDeleted, result } = setupDeleteTransferHook();

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Transfer delete failed',
        type: 'error',
      })
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });
});
