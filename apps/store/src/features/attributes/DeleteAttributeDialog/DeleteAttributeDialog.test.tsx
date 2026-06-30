import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteAttributes } from '@/lib/client/api/attributes';
import { clientRoutes } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteAttributeDialog } from './DeleteAttributeDialog';

const routerPushMock = vi.fn();

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

const { setup } = prepareStoreSetup({
  component: DeleteAttributeDialog,
  props: {
    attribute: {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      createdAt: '2026-06-24T20:07:32.467Z',
    },
  },
});

describe('DeleteAttributeDialog', () => {
  beforeEach(() => {
    deleteAttributesMock.mockReset();
    routerPushMock.mockClear();
  });

  it('opens a confirmation dialog with the attribute name', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Delete Color' }));

    expect(
      screen.getByRole('dialog', { name: 'Delete attribute' })
    ).toBeVisible();
    expect(
      screen.getByText('Are you sure you want to delete', { exact: false })
    ).toBeVisible();
    expect(screen.getByText('Color')).toBeVisible();
  });

  it('deletes the attribute, invalidates the list, and navigates to the list page', async () => {
    const user = userEvent.setup();
    deleteAttributesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    await user.click(screen.getByRole('button', { name: 'Delete Color' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteAttributesMock).toHaveBeenCalledWith({
      attributeIds: [7],
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.detail(7),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.values(7),
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.list,
      })
    );
    expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.attributes);
  });

  it('shows a toast and stays on the page when delete fails', async () => {
    const user = userEvent.setup();
    deleteAttributesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Attribute delete failed.',
      },
    });

    setup();

    await user.click(screen.getByRole('button', { name: 'Delete Color' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByRole('dialog', { name: 'Attribute delete failed.' })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Delete attribute' })
    ).toBeVisible();
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
