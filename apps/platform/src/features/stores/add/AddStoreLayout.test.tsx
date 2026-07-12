import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStoreLayout } from './AddStoreLayout';

vi.mock('./AddStoreForm', () => ({
  AddStoreForm: () => <div>Store form</div>,
}));

const { setup } = preparePlatformSetup({
  component: AddStoreLayout,
  props: {
    onCreated: vi.fn(),
  },
});

describe('AddStoreLayout', () => {
  it('renders the create-store heading and form', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Add store' })).toBeVisible();
    expect(
      screen.getByText(
        'Choose the storefront domain and name shown in your workspace.'
      )
    ).toBeVisible();
    expect(screen.getByText('Store form')).toBeVisible();
  });
});
