import { act, renderHook, waitFor } from '@testing-library/react';
import { deleteAttributeValues } from '@/lib/client/api/attributes';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useDeleteAttributeValue } from './useDeleteAttributeValue';

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
  deleteAttributeValues: vi.fn(),
}));

const deleteAttributeValuesMock = vi.mocked(deleteAttributeValues);

const setupDeleteAttributeValueHook = () => {
  const onDeleted = vi.fn();
  const TestQueryProvider = createTestQueryProvider(createTestQueryClient());
  const { result } = renderHook(
    () =>
      useDeleteAttributeValue({
        attributeValueId: 3,
        attributeValueName: 'Blue',
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

describe('useDeleteAttributeValue', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteAttributeValuesMock.mockReset();
  });

  it('deletes the attribute value and runs success cleanup', async () => {
    deleteAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onDeleted, result } = setupDeleteAttributeValueHook();

    expect(result.current.isDeleting).toBe(false);

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(deleteAttributeValuesMock).toHaveBeenCalledWith({
        attributeValueIds: [3],
      })
    );
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute value Blue was deleted.',
      type: 'success',
    });
    expect(result.current.isDeleting).toBe(false);
  });

  it('shows a toast and skips success cleanup when delete fails', async () => {
    deleteAttributeValuesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Attribute value delete failed.',
      },
    });
    const { onDeleted, result } = setupDeleteAttributeValueHook();

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute value delete failed.',
        type: 'error',
      })
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });
});
