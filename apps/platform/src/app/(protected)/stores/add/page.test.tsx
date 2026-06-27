import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import AddStoreRoutePage from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const { setup } = preparePlatformSetup({
  component: AddStoreRoutePage,
});

describe('AddStoreRoutePage', () => {
  it('renders the add-store route with the store form', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Add store' })).toBeVisible();
    expect(
      screen.getByText(
        'Choose the storefront domain and name shown in your workspace.'
      )
    ).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Subdomain' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Create store' })).toBeVisible();
  });
});
