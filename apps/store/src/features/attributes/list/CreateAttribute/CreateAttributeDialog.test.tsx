import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAttribute } from '@/lib/client/api/attributes';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateAttributeDialog } from './CreateAttributeDialog';

const routerPushMock = vi.fn();
const onOpenChangeMock = vi.fn();

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
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
  props: {
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('CreateAttributeDialog', () => {
  beforeEach(() => {
    createAttributeMock.mockReset();
    onOpenChangeMock.mockClear();
    routerPushMock.mockClear();
  });

  it('requires an attribute name before create is available', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Add' });

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

  it('adds, focuses, and removes attribute value fields dynamically', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new attribute' });
    const addAnotherValueButton = within(dialog).getByRole('button', {
      name: '+ Add another value',
    });
    const firstValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    expect(within(dialog).getByText('Attribute values')).toBeVisible();
    expect(
      within(dialog).queryByRole('textbox', { name: 'Attribute value 2' })
    ).not.toBeInTheDocument();
    expect(addAnotherValueButton).toBeDisabled();

    await user.type(firstValueField, 'Green');

    expect(addAnotherValueButton).toBeEnabled();

    await user.click(addAnotherValueButton);

    const secondValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 2',
    });
    const nextAddAnotherValueButton = within(dialog).getByRole('button', {
      name: '+ Add another value',
    });

    expect(secondValueField).toHaveValue('');
    await waitFor(() => expect(secondValueField).toHaveFocus());
    expect(nextAddAnotherValueButton).toBeDisabled();
    expect(within(dialog).getByText('Attribute values')).toBeVisible();
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

  it('creates the attribute, invalidates the list, and navigates to its detail page', async () => {
    createAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', { name: 'Add new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const firstValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });
    const addAnotherValueButton = within(dialog).getByRole('button', {
      name: '+ Add another value',
    });

    await user.type(nameField, 'Material');
    await user.type(firstValueField, 'Green');
    await user.click(addAnotherValueButton);
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Attribute value 2' }),
      'Blue'
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createAttributeMock).toHaveBeenCalledWith({
      name: 'Material',
      sortOrder: 0,
      attributeValues: [
        {
          name: 'Green',
          sortOrder: 0,
        },
        {
          name: 'Blue',
          sortOrder: 0,
        },
      ],
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.list,
      })
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(routerPushMock).toHaveBeenCalledWith(getAttributeDetailRoute(1));
  });

  it('ignores an empty added value when creating an attribute', async () => {
    createAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new attribute' });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Material'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Attribute value 1' }),
      'Green'
    );
    await user.click(
      within(dialog).getByRole('button', { name: '+ Add another value' })
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createAttributeMock).toHaveBeenCalledWith({
      name: 'Material',
      sortOrder: 0,
      attributeValues: [
        {
          name: 'Green',
          sortOrder: 0,
        },
      ],
    });
  });

  it('prevents another creation while the request is in flight', async () => {
    let resolveCreate:
      | ((value: Awaited<ReturnType<typeof createAttribute>>) => void)
      | undefined;

    createAttributeMock.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const attributeValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });
    const addAnotherValueButton = within(dialog).getByRole('button', {
      name: '+ Add another value',
    });

    await user.type(nameField, 'Material');

    const createButton = within(dialog).getByRole('button', { name: 'Add' });

    await user.click(createButton);

    expect(createButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeVisible();
    expect(attributeValueField).toBeDisabled();
    expect(addAnotherValueButton).toBeDisabled();
    expect(
      within(dialog).getByRole('button', { name: 'Close' })
    ).toBeDisabled();

    resolveCreate?.({
      ok: true,
      data: {
        id: 1,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });

    await screen.findByRole('button', { name: 'Add' });
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
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
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });

    await user.type(nameField, 'Material');
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

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
      await screen.findByRole('dialog', {
        name: 'Attribute creation failed.',
      })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
    expect(nameField).toHaveValue('Material');
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
