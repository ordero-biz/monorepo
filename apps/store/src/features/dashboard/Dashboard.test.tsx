import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { Dashboard } from './Dashboard';

const { setup } = prepareStoreSetup({
  component: Dashboard,
});

describe('Dashboard', () => {
  it('renders the dashboard placeholder', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    expect(screen.getByText('Coming soon')).toBeVisible();
    expect(
      screen.getByText('Your dashboard overview is being prepared.')
    ).toBeVisible();
  });
});
