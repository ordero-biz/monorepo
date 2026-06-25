import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteAttributeValues } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';
import { prepareStoreSetup } from '@/test/prepareSetup';
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

type DeleteAttributeValueHookTestProps = {
  attributeId: number;
  attributeValueId: number;
  attributeValueName: string;
  onDeleted: () => Promise<void> | void;
};

const DeleteAttributeValueHookTest = ({
  attributeId,
  attributeValueId,
  attributeValueName,
  onDeleted,
}: DeleteAttributeValueHookTestProps) => {
  const { handleDelete, isDeleting } = useDeleteAttributeValue({
    attributeId,
    attributeValueId,
    attributeValueName,
    onDeleted,
  });

  return (
    <button disabled={isDeleting} onClick={handleDelete} type="button">
      Delete
    </button>
  );
};

const { setup } = prepareStoreSetup({
  component: DeleteAttributeValueHookTest,
  props: {
    attributeId: 7,
    attributeValueId: 3,
    attributeValueName: 'Blue',
    onDeleted: vi.fn(),
  },
});

const setupDeleteAttributeValueHook = () => {
  const user = userEvent.setup();
  const onDeleted = vi.fn();
  const result = setup({
    onDeleted,
  });

  return {
    ...result,
    deleteButton: screen.getByRole('button', { name: 'Delete' }),
    onDeleted,
    user,
  };
};

describe('useDeleteAttributeValue', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteAttributeValuesMock.mockReset();
  });

  it('deletes the attribute value, runs success cleanup, and invalidates the values list', async () => {
    deleteAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { deleteButton, onDeleted, queryClient, user } =
      setupDeleteAttributeValueHook();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(deleteButton);

    expect(deleteAttributeValuesMock).toHaveBeenCalledWith({
      attributeValueIds: [3],
    });
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute value Blue was deleted.',
      type: 'success',
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.values(7),
    });
  });

  it('shows a toast and skips success cleanup when delete fails', async () => {
    deleteAttributeValuesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Attribute value delete failed.',
      },
    });
    const { deleteButton, onDeleted, user } = setupDeleteAttributeValueHook();

    await user.click(deleteButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute value delete failed.',
        type: 'error',
      })
    );
    expect(onDeleted).not.toHaveBeenCalled();
  });
});
