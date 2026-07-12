import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore } from '@/lib/client/api/stores';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStoreForm } from './AddStoreForm';

vi.mock('@/lib/client/api/stores', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/stores')>(
    '@/lib/client/api/stores'
  )),
  createStore: vi.fn(),
}));

const createStoreMock = vi.mocked(createStore);

const { setup } = preparePlatformSetup({
  component: AddStoreForm,
  props: {
    onCreated: vi.fn(),
  },
});

const setupAddStoreForm = () => {
  const user = userEvent.setup();
  const onCreated = vi.fn();
  const result = setup({
    onCreated,
  });

  return {
    ...result,
    onCreated,
    user,
    subDomainField: screen.getByRole('textbox', { name: 'Subdomain' }),
    nameField: screen.getByRole('textbox', { name: 'Name' }),
    submitButton: screen.getByRole('button', { name: 'Create store' }),
  };
};

describe('AddStoreForm', () => {
  beforeEach(() => {
    createStoreMock.mockReset();
  });

  it('renders the store domain and name form fields', async () => {
    const { subDomainField, nameField, submitButton, user } =
      setupAddStoreForm();

    expect(subDomainField).toBeVisible();
    expect(screen.getByText('.ordero.biz')).toBeVisible();
    expect(nameField).toBeVisible();
    expect(submitButton).toHaveAttribute('type', 'submit');

    await user.type(subDomainField, 'north-shop');
    await user.type(nameField, 'North Shop');

    expect(subDomainField).toHaveValue('north-shop');
    expect(nameField).toHaveValue('North Shop');
  });

  it('shows submit validation when the user submits the untouched form', async () => {
    const { subDomainField, nameField, submitButton, user } =
      setupAddStoreForm();

    await user.click(submitButton);

    expect(screen.getAllByText('This field is required.')).toHaveLength(2);
    expect(subDomainField).toHaveAccessibleDescription(
      'This field is required.'
    );
    expect(nameField).toHaveAccessibleDescription('This field is required.');
    expect(createStoreMock).not.toHaveBeenCalled();
  });

  it('does not show client validation on the first keystroke', async () => {
    const { subDomainField, user } = setupAddStoreForm();

    await user.type(subDomainField, ' ');

    expect(
      screen.queryByText('This field is required.')
    ).not.toBeInTheDocument();
  });

  it('shows client validation after a field is blurred once', async () => {
    const { subDomainField, nameField, user } = setupAddStoreForm();

    await user.type(subDomainField, ' ');
    await user.click(nameField);

    expect(screen.getByText('This field is required.')).toBeVisible();
  });

  it('updates client validation live after an invalid field has been revealed', async () => {
    const { subDomainField, nameField, user } = setupAddStoreForm();

    await user.type(subDomainField, ' ');
    await user.click(nameField);

    expect(screen.getByText('This field is required.')).toBeVisible();

    await user.clear(subDomainField);
    await user.type(subDomainField, 'north-shop');

    expect(
      screen.queryByText('This field is required.')
    ).not.toBeInTheDocument();
  });

  it('submits the store payload, shows a success toast, and runs the created callback', async () => {
    createStoreMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'North Shop',
        subDomain: 'north-shop',
      },
    });

    const { nameField, onCreated, subDomainField, submitButton, user } =
      setupAddStoreForm();

    await user.type(subDomainField, ' north-shop ');
    await user.type(nameField, ' North Shop ');
    await user.click(submitButton);

    expect(createStoreMock).toHaveBeenCalledWith({
      name: 'North Shop',
      subDomain: 'north-shop',
    });
    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByRole('dialog', { name: 'Store created.' })
    ).toBeVisible();
  });

  it('shows the backend subDomain field error on submit', async () => {
    createStoreMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Validation failed.',
        fieldErrors: {
          subDomain: 'Subdomain is already taken.',
        },
      },
    });

    const { subDomainField, nameField, submitButton, user } =
      setupAddStoreForm();

    await user.type(subDomainField, 'north-shop');
    await user.type(nameField, 'North Shop');
    await user.click(submitButton);

    expect(screen.getByText('Subdomain is already taken.')).toBeVisible();
    expect(subDomainField).toHaveAccessibleDescription(
      'Subdomain is already taken.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Validation failed.' })
    ).toBeVisible();
  });
});
