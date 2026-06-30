import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateAttribute } from '@/lib/client/api/attributes';
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

const { setup } = prepareStoreSetup({
  component: UpdateAttributeDialog,
  props: {
    attribute: {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      createdAt: '2026-06-24T20:07:32.467Z',
    },
    onUpdated: vi.fn(),
  },
});

const setupUpdateAttributeDialog = () => {
  const user = userEvent.setup();
  const onUpdated = vi.fn();
  const result = setup({
    onUpdated,
  });

  return {
    ...result,
    onUpdated,
    user,
  };
};

describe('UpdateAttributeDialog', () => {
  beforeEach(() => {
    updateAttributeMock.mockReset();
  });

  it('opens with the current attribute name', async () => {
    const { user } = setupUpdateAttributeDialog();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });

    expect(
      within(dialog).getByRole('textbox', { name: 'Attribute name' })
    ).toHaveValue('Color');
  });

  it('submits the updated name, closes, invalidates the list, and reports success', async () => {
    const { onUpdated, queryClient, user } = setupUpdateAttributeDialog();
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

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
    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
    expect(
      screen.queryByRole('dialog', { name: 'Edit Attribute' })
    ).not.toBeInTheDocument();
  });

  it('requires an attribute name before save is available', async () => {
    const { user } = setupUpdateAttributeDialog();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    expect(saveButton).toBeEnabled();

    await user.clear(nameField);

    expect(saveButton).toBeDisabled();

    await user.type(nameField, 'Material');

    expect(saveButton).toBeEnabled();
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    const { onUpdated, user } = setupUpdateAttributeDialog();
    updateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute update failed.',
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
      },
    });

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit Attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, 'Material');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await within(dialog).findByText('Attribute name already exists.')
    ).toBeVisible();
    expect(nameField).toHaveAccessibleDescription(
      'Attribute name already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Attribute update failed.' })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Edit Attribute' })
    ).toBeVisible();
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
