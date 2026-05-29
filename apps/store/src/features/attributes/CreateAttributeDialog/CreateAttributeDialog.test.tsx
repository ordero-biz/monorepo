import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateAttributeDialog } from '@/features/attributes';
import { clientRoutes } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { createAttribute } from './api';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('./api', async () => ({
  ...(await vi.importActual<typeof import('./api')>('./api')),
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

    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    expect(
      screen.getByRole('dialog', { name: 'Create new attribute' })
    ).toBeVisible();
  });

  it('requires a valid attribute name before create is available', async () => {
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    expect(createButton).toBeDisabled();

    await user.type(nameField, 'abc');
    await user.tab();

    expect(
      within(dialog).getByText(
        'Attribute name must contain at least 4 characters.'
      )
    ).toBeVisible();
    expect(createButton).toBeDisabled();

    await user.clear(nameField);
    await user.type(nameField, 'Material');

    expect(createButton).toBeEnabled();
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

    setup();
    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    await user.type(nameField, 'Material');

    await user.click(createButton);

    expect(createAttributeMock).toHaveBeenCalledWith({
      name: 'Material',
      sortOrder: 0,
    });
    expect(routerPushMock).toHaveBeenCalledWith(
      clientRoutes.attributeDetail(1)
    );
    expect(
      screen.queryByRole('dialog', { name: 'Create new attribute' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const reopenedDialog = screen.getByRole('dialog', {
      name: 'Create new attribute',
    });

    expect(
      within(reopenedDialog).getByRole('textbox', { name: 'Attribute name' })
    ).toHaveValue('');
  });

  it('shows the backend field error and keeps the dialog open when submit fails', async () => {
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
    await user.click(screen.getByRole('button', { name: 'Create Attribute' }));

    const dialog = screen.getByRole('dialog', { name: 'Create new attribute' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.type(nameField, 'Material');
    await user.click(within(dialog).getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Attribute name already exists.')).toBeVisible();
    expect(nameField).toHaveAccessibleDescription(
      'Attribute name already exists.'
    );
    expect(
      screen.getByRole('dialog', { name: 'Create new attribute' })
    ).toBeVisible();
    expect(
      await screen.findByRole('dialog', { name: 'Attribute creation failed.' })
    ).toBeVisible();
  });
});
