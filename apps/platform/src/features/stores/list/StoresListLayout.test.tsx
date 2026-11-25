import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { StoresListLayout } from './StoresListLayout';

vi.mock('./StoresList', () => ({
  StoresList: () => <div>Store results</div>,
}));

const { setup } = preparePlatformSetup({
  component: StoresListLayout,
});

describe('StoresListLayout', () => {
  it('renders the stores heading and results', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Stores' })).toBeVisible();
    expect(
      screen.getByText('Manage the storefronts connected to your workspace.')
    ).toBeVisible();
    expect(screen.getByText('Store results')).toBeVisible();
  });
});
