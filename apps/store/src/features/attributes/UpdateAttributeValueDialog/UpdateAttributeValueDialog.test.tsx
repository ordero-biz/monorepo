import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateAttributeValue } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';
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
    const { queryClient } = setup();
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
      sortOrder: 0,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.values(7),
      })
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute value update failed.',
        fieldErrors: {
          name: 'Attribute value name already exists.',
        },
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
      await within(dialog).findByText('Attribute value name already exists.')
    ).toBeVisible();
    expect(nameField).toHaveAccessibleDescription(
      'Attribute value name already exists.'
    );
    expect(
      await screen.findByRole('dialog', {
        name: 'Attribute value update failed.',
      })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });
});
