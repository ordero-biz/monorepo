import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateAttribute } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { Attribute } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateAttributeDialog } from './ActivateAttributeDialog';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttribute: vi.fn(),
}));

const updateAttributeMock = vi.mocked(updateAttribute);
const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

const attribute: Attribute = {
  id: 7,
  name: 'Color',
  sortOrder: 10,
  status: ATTRIBUTE_STATUS.DRAFT,
  createdAt: '2026-06-24T20:07:32.467Z',
};

const { setup } = prepareStoreSetup({
  component: ActivateAttributeDialog,
  props: {
    attribute,
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
  },
});

describe('ActivateAttributeDialog', () => {
  beforeEach(() => {
    updateAttributeMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('renders confirmation content and a cancel button', () => {
    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Publish attribute',
    });

    expect(dialog).toBeVisible();
    expect(
      screen.getByText(
        'Are you sure you want to publish this attribute? Once active, it will be fully functional, available for products, and tracked in analytics.'
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        'This action cannot be undone. Once active, the attribute name cannot be edited, but you can still add and manage values.'
      )
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeVisible();
  });

  it('publishes the attribute, invalidates queries, and closes the dialog', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        ...attribute,
        status: ATTRIBUTE_STATUS.ACTIVE,
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(updateAttributeMock).toHaveBeenCalledWith({
      attributeId: 7,
      status: ATTRIBUTE_STATUS.ACTIVE,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.detail(7),
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onUpdatedMock).toHaveBeenCalled();
  });

  it('prevents another publish while the request is in flight', async () => {
    let resolveUpdate:
      | ((value: Awaited<ReturnType<typeof updateAttribute>>) => void)
      | undefined;

    updateAttributeMock.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const publishButton = screen.getByRole('button', { name: 'Publish' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(publishButton);

    expect(publishButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publishing...' })).toBeVisible();

    resolveUpdate?.({
      ok: true,
      data: {
        ...attribute,
        status: ATTRIBUTE_STATUS.ACTIVE,
      },
    });

    await screen.findByRole('button', { name: 'Publish' });
  });

  it('shows an error toast and keeps the dialog open when publishing fails', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.ATTRIBUTE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Active attributes cannot be edited',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Publish attribute' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
    expect(onUpdatedMock).not.toHaveBeenCalled();
  });
});
