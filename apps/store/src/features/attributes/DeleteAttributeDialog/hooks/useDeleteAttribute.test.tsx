import { act, renderHook, waitFor } from '@testing-library/react';
import { deleteAttributes } from '@/lib/client/api/attributes';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useDeleteAttribute } from './useDeleteAttribute';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  deleteAttributes: vi.fn(),
}));

const deleteAttributesMock = vi.mocked(deleteAttributes);

const setupDeleteAttributeHook = () => {
  const onDeleted = vi.fn();
  const TestQueryProvider = createTestQueryProvider(createTestQueryClient());
  const { result } = renderHook(
    () =>
      useDeleteAttribute({
        attributeId: 7,
        attributeName: 'Color',
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

describe('useDeleteAttribute', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteAttributesMock.mockReset();
  });

  it('deletes the attribute and runs success cleanup', async () => {
    deleteAttributesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onDeleted, result } = setupDeleteAttributeHook();

    expect(result.current.isDeleting).toBe(false);

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(deleteAttributesMock).toHaveBeenCalledWith({
        attributeIds: [7],
      })
    );
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute Color was deleted.',
      type: 'success',
    });
    expect(result.current.isDeleting).toBe(false);
  });

  it('shows a toast and skips success cleanup when delete fails', async () => {
    deleteAttributesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Attribute delete failed.',
      },
    });
    const { onDeleted, result } = setupDeleteAttributeHook();

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute delete failed.',
        type: 'error',
      })
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });
});
