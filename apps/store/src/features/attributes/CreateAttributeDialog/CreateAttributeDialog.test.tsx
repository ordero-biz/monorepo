import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAttribute } from '@/lib/client/api/attributes';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateAttributeDialog } from './CreateAttributeDialog';

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
  createAttribute: vi.fn(),
}));

const createAttributeMock = vi.mocked(createAttribute);

const { setup } = prepareStoreSetup({
  component: CreateAttributeDialog,
});

describe('CreateAttributeDialog', () => {
  beforeEach(() => {
    createAttributeMock.mockReset();
    routerPushMock.mockClear();
  });

  it('opens the dialog from the create attribute trigger', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Create attribute' }));

    expect(
      screen.getByRole('dialog', { name: 'Create new attribute' })
    ).toBeVisible();
  });

  it('requires an attribute name before create is available', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: 'Create attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    expect(createButton).toBeDisabled();

    await user.type(nameField, '   ');
    await user.tab();

    expect(
      within(dialog).getByText('Attribute name is required')
    ).toBeVisible();
    expect(createButton).toBeDisabled();

    await user.clear(nameField);
    await user.type(nameField, 'Material');

    expect(createButton).toBeEnabled();
  });

  it('adds and removes attribute value fields dynamically', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: 'Create attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const addButton = within(dialog).getByRole('button', {
      name: 'Add attribute value',
    });
    const firstValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    expect(
      within(dialog).queryByRole('textbox', { name: 'Attribute value 2' })
    ).not.toBeInTheDocument();

    await user.type(firstValueField, 'Green');
    await user.click(addButton);

    const secondValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 2',
    });

    expect(secondValueField).toHaveValue('');
    expect(
      within(dialog).getByRole('button', { name: 'Remove attribute value 1' })
    ).toBeVisible();

    await user.click(
      within(dialog).getByRole('button', { name: 'Remove attribute value 1' })
    );

    expect(
      within(dialog).queryByRole('textbox', { name: 'Attribute value 2' })
    ).not.toBeInTheDocument();
    expect(
      within(dialog).getByRole('textbox', { name: 'Attribute value 1' })
    ).toHaveValue('');
  });

  it('closes on submit and resets the form', async () => {
    const user = userEvent.setup();
    createAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });

    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Create attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const firstValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Create' });
    const addValueButton = within(dialog).getByRole('button', {
      name: 'Add attribute value',
    });

    await user.type(nameField, 'Material');
    await user.type(firstValueField, 'Green');
    await user.click(addValueButton);
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Attribute value 2' }),
      'Blue'
    );

    await user.click(createButton);

    expect(createAttributeMock).toHaveBeenCalledWith({
      name: 'Material',
      sortOrder: 0,
      attributeValues: ['Green', 'Blue'],
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.list,
      })
    );
    expect(routerPushMock).toHaveBeenCalledWith(getAttributeDetailRoute(1));
    expect(
      screen.queryByRole('dialog', { name: 'Create new attribute' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create attribute' }));

    const reopenedDialog = screen.getByRole('dialog', {
      name: 'Create new attribute',
    });

    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Attribute name' })
    ).toHaveValue('');
    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Attribute value 1' })
    ).toHaveValue('');
    expect(
      within(reopenedDialog).queryByRole('textbox', {
        name: 'Attribute value 2',
      })
    ).not.toBeInTheDocument();
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
    const user = userEvent.setup();
    createAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute creation failed.',
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
      },
    });

    setup();

    await user.click(screen.getByRole('button', { name: 'Create attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.type(nameField, 'Material');
    await user.click(within(dialog).getByRole('button', { name: 'Create' }));

    expect(createAttributeMock).toHaveBeenCalledWith({
      name: 'Material',
      sortOrder: 0,
      attributeValues: [],
    });
    expect(
      await within(dialog).findByText('Attribute name already exists.')
    ).toBeVisible();
    expect(nameField).toHaveAccessibleDescription(
      'Attribute name already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Attribute creation failed.' })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Create new attribute' })
    ).toBeVisible();
    expect(nameField).toHaveValue('Material');
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
