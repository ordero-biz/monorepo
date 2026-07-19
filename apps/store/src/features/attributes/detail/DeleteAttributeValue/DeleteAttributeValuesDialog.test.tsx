import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteAttributeValues } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteAttributeValuesDialog } from './DeleteAttributeValuesDialog';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  deleteAttributeValues: vi.fn(),
}));

const deleteAttributeValuesMock = vi.mocked(deleteAttributeValues);
const onDeletedMock = vi.fn();
const onOpenChangeMock = vi.fn();

const { setup } = prepareStoreSetup({
  component: DeleteAttributeValuesDialog,
  props: {
    attributeId: 7,
    attributeValues: [
      {
        id: 3,
        name: 'Blue',
        sortOrder: 0,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
      {
        id: 4,
        name: 'Red',
        sortOrder: 1,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    ],
    onDeleted: onDeletedMock,
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('DeleteAttributeValuesDialog', () => {
  beforeEach(() => {
    deleteAttributeValuesMock.mockReset();
    onDeletedMock.mockClear();
    onOpenChangeMock.mockClear();
  });

  it('clears selection before closing while the values query refreshes', async () => {
    deleteAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const lifecycleEvents: string[] = [];
    let resolveInvalidation: (() => void) | undefined;
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveInvalidation = resolve;
          })
      );
    onDeletedMock.mockImplementation(() => {
      lifecycleEvents.push('selection cleared');
    });
    onOpenChangeMock.mockImplementation((open) => {
      if (!open) {
        lifecycleEvents.push('dialog closed');
      }
    });

    expect(
      screen.getByRole('dialog', { name: 'Delete attribute values' })
    ).toHaveTextContent('Are you sure you want to delete 2 attribute values?');

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteAttributeValuesMock).toHaveBeenCalledWith({
      attributeValueIds: [3, 4],
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.values(7),
      })
    );
    expect(lifecycleEvents).toEqual(['selection cleared', 'dialog closed']);

    resolveInvalidation?.();
  });
});
