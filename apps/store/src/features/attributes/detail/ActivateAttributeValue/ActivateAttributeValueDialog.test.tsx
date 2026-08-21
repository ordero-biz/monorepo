import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateAttributeValue } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateAttributeValueDialog } from './ActivateAttributeValueDialog';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttributeValue: vi.fn(),
}));

const updateAttributeValueMock = vi.mocked(updateAttributeValue);
const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

const attributeValue: AttributeValue = {
  id: 3,
  name: 'Blue',
  sortOrder: 0,
  status: ATTRIBUTE_VALUE_STATUS.DRAFT,
  createdAt: '2026-06-24T20:07:32.467Z',
};

const { setup } = prepareStoreSetup({
  component: ActivateAttributeValueDialog,
  props: {
    attributeId: 7,
    attributeValue,
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
  },
});

describe('ActivateAttributeValueDialog', () => {
  beforeEach(() => {
    updateAttributeValueMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('renders confirmation content and a cancel button', () => {
    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Publish attribute value',
    });

    expect(dialog).toBeVisible();
    expect(
      screen.getByText(
        'Are you sure you want to publish this attribute value? Once active, it will be fully functional and available for products.'
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        'This action cannot be undone, and the attribute value will no longer be editable.'
      )
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeVisible();
  });

  it('publishes the attribute value, refreshes the collection, and closes the dialog', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: true,
      data: {
        ...attributeValue,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(updateAttributeValueMock).toHaveBeenCalledWith({
      attributeValueId: 3,
      status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.values(7),
      })
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onUpdatedMock).toHaveBeenCalled();
  });

  it('prevents another publish while the request is in flight', async () => {
    let resolveUpdate:
      | ((value: Awaited<ReturnType<typeof updateAttributeValue>>) => void)
      | undefined;

    updateAttributeValueMock.mockReturnValue(
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
        ...attributeValue,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
      },
    });

    await screen.findByRole('button', { name: 'Publish' });
  });

  it('shows an error toast and keeps the dialog open when publishing fails', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.ATTRIBUTE_VALUE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Active attribute values cannot be edited',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Publish attribute value' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
    expect(onUpdatedMock).not.toHaveBeenCalled();
  });
});
