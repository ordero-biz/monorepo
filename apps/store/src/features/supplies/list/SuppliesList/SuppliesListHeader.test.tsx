import { screen, within } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliesListHeader } from './SuppliesListHeader';

const { setup } = prepareStoreSetup({
  component: SuppliesListHeader,
});

describe('SuppliesListHeader', () => {
  it('renders the supplies title and breadcrumb', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Supplies list' })
    ).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByText(
        'Supplies'
      )
    ).toHaveAttribute('aria-current', 'page');
  });
});
