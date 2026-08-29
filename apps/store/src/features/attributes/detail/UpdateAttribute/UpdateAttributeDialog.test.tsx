import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateAttribute } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateAttributeDialog } from './UpdateAttributeDialog';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttribute: vi.fn(),
}));

const updateAttributeMock = vi.mocked(updateAttribute);
const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

const { setup } = prepareStoreSetup({
  component: UpdateAttributeDialog,
  props: {
    attribute: {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-06-24T20:07:32.467Z',
    },
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
  },
});

describe('UpdateAttributeDialog', () => {
  beforeEach(() => {
    updateAttributeMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('opens with the current attribute name', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });

    expect(
      within(dialog).getByRole('textbox', { name: 'Attribute name' })
    ).toHaveValue('Color');
    expect(within(dialog).getByText('Name')).toBeVisible();
    expect(
      within(dialog).getByRole('textbox', { name: 'Attribute name' })
    ).toBeRequired();
    expect(
      within(dialog).getByRole('textbox', { name: 'Attribute name' })
    ).not.toHaveAttribute('placeholder');
  });

  it('submits the updated name, closes, invalidates the list, and reports success', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        status: 'DRAFT' as const,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, '  Material  ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateAttributeMock).toHaveBeenCalledWith({
      attributeId: 7,
      name: 'Material',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.detail(7),
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
  });

  it('closes without sending a normalized name that matches the attribute', async () => {
    const user = userEvent.setup();
    const { onOpenChange, onUpdated } = setup();
    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, ' Color ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateAttributeMock).not.toHaveBeenCalled();
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(onUpdated).not.toHaveBeenCalled();
    expect(screen.queryByText(/was updated/)).not.toBeInTheDocument();
  });

  it('keeps save available and rejects an empty attribute name', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    expect(saveButton).toBeEnabled();

    await user.clear(nameField);

    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(
      await within(dialog).findByText('Attribute name is required')
    ).toBeVisible();
    expect(updateAttributeMock).not.toHaveBeenCalled();
  });

  it('disables save while the update is in flight', async () => {
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

    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    await user.clear(nameField);
    await user.type(nameField, 'Material');
    await user.click(saveButton);

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();

    resolveUpdate?.({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        status: 'DRAFT' as const,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });

    await screen.findByRole('button', { name: 'Save' });
  });

  it('shows mapped backend errors and keeps the dialog open when submit fails', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.ATTRIBUTE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated } = setup();
    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, 'Material');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Active attributes cannot be edited',
      })
    ).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
