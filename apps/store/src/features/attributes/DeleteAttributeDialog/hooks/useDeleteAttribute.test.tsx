import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteAttributes } from '@/lib/client/api/attributes';
import { clientRoutes } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { useDeleteAttribute } from './useDeleteAttribute';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

const routerPushMock = vi.fn();

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  deleteAttributes: vi.fn(),
}));

const deleteAttributesMock = vi.mocked(deleteAttributes);

type DeleteAttributeHookTestProps = {
  attributeId: number;
  attributeName: string;
  onDeleted: () => Promise<void> | void;
};

const DeleteAttributeHookTest = ({
  attributeId,
  attributeName,
  onDeleted,
}: DeleteAttributeHookTestProps) => {
  const { handleDelete, isDeleting } = useDeleteAttribute({
    attributeId,
    attributeName,
    onDeleted,
  });

  return (
    <button disabled={isDeleting} onClick={handleDelete} type="button">
      Delete
    </button>
  );
};

const { setup } = prepareStoreSetup({
  component: DeleteAttributeHookTest,
  props: {
    attributeId: 7,
    attributeName: 'Color',
    onDeleted: vi.fn(),
  },
});

const setupDeleteAttributeHook = () => {
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

describe('useDeleteAttribute', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteAttributesMock.mockReset();
    routerPushMock.mockClear();
  });

  it('deletes the attribute, runs success cleanup, invalidates the list, and navigates to the list page', async () => {
    deleteAttributesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { deleteButton, onDeleted, queryClient, user } =
      setupDeleteAttributeHook();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    await user.click(deleteButton);

    expect(deleteAttributesMock).toHaveBeenCalledWith({
      attributeIds: [7],
    });
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute Color was deleted.',
      type: 'success',
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.detail(7),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.values(7),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.list,
    });
    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.attributes);
  });

  it('shows a toast and skips success cleanup when delete fails', async () => {
    deleteAttributesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Attribute delete failed.',
      },
    });
    const { deleteButton, onDeleted, user } = setupDeleteAttributeHook();

    await user.click(deleteButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute delete failed.',
        type: 'error',
      })
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
