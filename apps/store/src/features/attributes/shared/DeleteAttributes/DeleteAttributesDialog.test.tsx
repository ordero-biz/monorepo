import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteAttributes } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteAttributesDialog } from './DeleteAttributesDialog';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  deleteAttributes: vi.fn(),
}));

const deleteAttributesMock = vi.mocked(deleteAttributes);

const singleAttribute = {
  id: 7,
  name: 'Color',
  sortOrder: 10,
  status: 'DRAFT' as const,
  createdAt: '2026-06-24T20:07:32.467Z',
};

const multipleAttributes = [
  singleAttribute,
  {
    id: 8,
    name: 'Size',
    sortOrder: 20,
    status: 'ACTIVE' as const,
    createdAt: '2026-06-25T20:07:32.467Z',
  },
];

const { setup: setupSingle } = prepareStoreSetup({
  component: DeleteAttributesDialog,
  props: {
    attributes: [singleAttribute],
    onDeleted: vi.fn(),
    onOpenChange: vi.fn(),
    open: true,
  },
});

const { setup: setupMultiple } = prepareStoreSetup({
  component: DeleteAttributesDialog,
  props: {
    attributes: multipleAttributes,
    onDeleted: vi.fn(),
    onOpenChange: vi.fn(),
    open: true,
  },
});

describe('DeleteAttributesDialog', () => {
  beforeEach(() => {
    deleteAttributesMock.mockReset();
  });

  it('renders the attribute name for one attribute', () => {
    setupSingle();

    const dialog = screen.getByRole('dialog', { name: 'Delete attribute' });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete the "Color" attribute and all its associated values?'
    );
  });

  it('renders the attribute count for multiple attributes', () => {
    setupMultiple();

    const dialog = screen.getByRole('dialog', { name: 'Delete attributes' });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete 2 attributes and all their associated values?'
    );
  });

  it('deletes attributes, updates affected queries, and closes the dialog', async () => {
    deleteAttributesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();
    const { onDeleted, onOpenChange, queryClient } = setupMultiple();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    multipleAttributes.forEach((attribute) => {
      queryClient.setQueryData(attributesQueryKeys.values(attribute.id), []);
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteAttributesMock).toHaveBeenCalledWith({
      attributeIds: [7, 8],
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.detail(7),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.detail(8),
    });
    multipleAttributes.forEach((attribute) => {
      expect(
        queryClient.getQueryState(attributesQueryKeys.values(attribute.id))
      ).toBeUndefined();
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.list,
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onDeleted).toHaveBeenCalled();
  });

  it('prevents another deletion while the request is in flight', async () => {
    let resolveDelete:
      | ((value: Awaited<ReturnType<typeof deleteAttributes>>) => void)
      | undefined;

    deleteAttributesMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      })
    );
    const user = userEvent.setup();

    setupSingle();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeVisible();

    resolveDelete?.({
      ok: true,
      data: undefined,
    });

    await screen.findByRole('button', { name: 'Delete' });
  });

  it('shows a toast and stays open when deletion fails', async () => {
    deleteAttributesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Attribute delete failed',
      },
    });
    const user = userEvent.setup();

    setupSingle();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByRole('dialog', { name: 'Attribute delete failed' })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Delete attribute' })
    ).toBeVisible();
  });
});
