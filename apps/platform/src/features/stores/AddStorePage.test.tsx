import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore } from '@/lib/api/client';
import { storesQueryKeys } from '@/lib/hooks/useStoresQuery';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStorePage } from './AddStorePage';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/api/client', async () => ({
  ...(await vi.importActual<typeof import('@/lib/api/client')>(
    '@/lib/api/client'
  )),
  createStore: vi.fn(),
}));

const createStoreMock = vi.mocked(createStore);

const { setup } = preparePlatformSetup({
  component: AddStorePage,
});

const setupAddStorePage = () => {
  const user = userEvent.setup();
  const result = setup();

  return {
    ...result,
    user,
    subDomainField: screen.getByRole('textbox', { name: 'Subdomain' }),
    nameField: screen.getByRole('textbox', { name: 'Name' }),
    submitButton: screen.getByRole('button', { name: 'Create store' }),
  };
};

describe('AddStorePage', () => {
  beforeEach(() => {
    createStoreMock.mockReset();
    routerPushMock.mockClear();
  });

  it('renders the store domain and name form fields', async () => {
    const { subDomainField, nameField, submitButton, user } =
      setupAddStorePage();

    expect(screen.getByRole('heading', { name: 'Add store' })).toBeVisible();
    expect(subDomainField).toBeVisible();
    expect(screen.getByText('.ordero.biz')).toBeVisible();
    expect(nameField).toBeVisible();
    expect(submitButton).toHaveAttribute('type', 'submit');

    await user.type(subDomainField, 'north-shop');
    await user.type(nameField, 'North Shop');

    expect(subDomainField).toHaveValue('north-shop');
    expect(nameField).toHaveValue('North Shop');
  });

  it('submits the swagger payload, shows a success toast, invalidates stores, and redirects', async () => {
    createStoreMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'North Shop',
        subDomain: 'north-shop',
      },
    });

    const { subDomainField, nameField, queryClient, submitButton, user } =
      setupAddStorePage();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.type(subDomainField, 'north-shop');
    await user.type(nameField, 'North Shop');
    await user.click(submitButton);

    expect(createStoreMock).toHaveBeenCalledWith({
      name: 'North Shop',
      subDomain: 'north-shop',
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: storesQueryKeys.list,
    });
    expect(routerPushMock).toHaveBeenCalledWith('/stores');
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
      setupAddStorePage();

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
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
