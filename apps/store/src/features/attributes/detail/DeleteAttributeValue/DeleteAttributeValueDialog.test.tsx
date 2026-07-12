import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteAttributeValues } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteAttributeValueDialog } from './DeleteAttributeValueDialog';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  deleteAttributeValues: vi.fn(),
}));

const deleteAttributeValuesMock = vi.mocked(deleteAttributeValues);
const onOpenChangeMock = vi.fn();

const { setup } = prepareStoreSetup({
  component: DeleteAttributeValueDialog,
  props: {
    attributeId: 7,
    attributeValue: {
      id: 3,
      name: 'Blue',
      sortOrder: 0,
      createdAt: '2026-06-24T20:07:32.467Z',
    },
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('DeleteAttributeValueDialog', () => {
  beforeEach(() => {
    deleteAttributeValuesMock.mockReset();
    onOpenChangeMock.mockClear();
  });

  it('renders a confirmation dialog with the attribute value name', () => {
    setup();

    expect(
      screen.getByRole('dialog', { name: 'Delete attribute value' })
    ).toBeVisible();
    expect(
      screen.getByText('Are you sure you want delete', { exact: false })
    ).toBeVisible();
    expect(screen.getByText('Blue')).toBeVisible();
  });

  it('deletes the attribute value, invalidates the values list, and closes the dialog', async () => {
    deleteAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteAttributeValuesMock).toHaveBeenCalledWith({
      attributeValueIds: [3],
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.values(7),
      })
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it('shows a toast and keeps the dialog open when delete fails', async () => {
    deleteAttributeValuesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Attribute value delete failed.',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Attribute value delete failed.',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Delete attribute value' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });
});
