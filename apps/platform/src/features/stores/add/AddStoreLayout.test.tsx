import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStoreLayout } from './AddStoreLayout';

vi.mock('@/lib/client/api/stores', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/stores')>(
    '@/lib/client/api/stores'
  )),
  createStore: vi.fn(),
}));

const { setup } = preparePlatformSetup({
  component: AddStoreLayout,
  props: {
    onCreated: vi.fn(),
  },
});

describe('AddStoreLayout', () => {
  it('renders the add-store layout copy and form', () => {
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
