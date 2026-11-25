import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateAttributeValue } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateAttributeValueDialog } from './UpdateAttributeValueDialog';

const onOpenChangeMock = vi.fn();

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttributeValue: vi.fn(),
}));

const updateAttributeValueMock = vi.mocked(updateAttributeValue);

const { setup } = prepareStoreSetup({
  component: UpdateAttributeValueDialog,
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

describe('UpdateAttributeValueDialog', () => {
  beforeEach(() => {
    onOpenChangeMock.mockClear();
    updateAttributeValueMock.mockReset();
  });

  it('submits the updated value and invalidates the attribute values query', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Navy',
        sortOrder: 0,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const dialog = screen.getByRole('dialog', {
      name: 'Edit Attribute Value',
    });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute value name',
    });

    await user.clear(nameField);
    await user.type(nameField, '  Navy  ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateAttributeValueMock).toHaveBeenCalledWith({
      attributeValueId: 3,
      name: 'Navy',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.values(7),
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.list,
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(
      await screen.findByRole('dialog', {
        name: 'Attribute value Navy was updated',
      })
    ).toBeVisible();
  });

  it('closes without sending normalized values that match the attribute value', async () => {
    const user = userEvent.setup();
    const { onOpenChange } = setup();
    const dialog = screen.getByRole('dialog', {
      name: 'Edit Attribute Value',
    });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute value name',
    });

    await user.clear(nameField);
    await user.type(nameField, ' Blue ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateAttributeValueMock).not.toHaveBeenCalled();
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(screen.queryByText(/was updated/)).not.toBeInTheDocument();
  });

  it('keeps save available and rejects an empty attribute value name', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Edit Attribute Value',
    });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute value name',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    expect(within(dialog).getByText('Name')).toBeVisible();
    expect(nameField).toBeRequired();
    expect(nameField).not.toHaveAttribute('placeholder');
    expect(saveButton).toBeEnabled();

    await user.clear(nameField);

    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(
      await within(dialog).findByText('Attribute value name is required')
    ).toBeVisible();
    expect(updateAttributeValueMock).not.toHaveBeenCalled();
  });

  it('disables save while the update is in flight', async () => {
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

    const dialog = screen.getByRole('dialog', {
      name: 'Edit Attribute Value',
    });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute value name',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    await user.clear(nameField);
    await user.type(nameField, 'Navy');
    await user.click(saveButton);

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();

    resolveUpdate?.({
      ok: true,
      data: {
        id: 3,
        name: 'Navy',
        sortOrder: 0,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });

    await screen.findByRole('button', { name: 'Save' });
  });

  it('shows mapped backend errors and keeps the dialog open when submit fails', async () => {
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

    const dialog = screen.getByRole('dialog', {
      name: 'Edit Attribute Value',
    });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute value name',
    });

    await user.clear(nameField);
    await user.type(nameField, 'Navy');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Active attribute values cannot be edited',
      })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });
});
