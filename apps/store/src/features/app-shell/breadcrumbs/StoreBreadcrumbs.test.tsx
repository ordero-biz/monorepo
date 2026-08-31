import { screen, within } from '@testing-library/react';
import { clientRoutes } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { StoreBreadcrumbs } from './StoreBreadcrumbs';

const { setup } = prepareStoreSetup({
  component: StoreBreadcrumbs,
  props: {
    items: [
      {
        href: clientRoutes.attributes,
        id: 'attributes',
        label: 'Attributes',
      },
      { id: 'current-attribute', label: 'Color' },
    ],
  },
});

describe('Store breadcrumbs', () => {
  it('starts at the owning root menu item', () => {
    setup();

    const breadcrumbs = screen.getByRole('navigation', {
      name: 'Breadcrumb',
    });

    expect(
      within(breadcrumbs).queryByRole('link', { name: 'Dashboard' })
    ).not.toBeInTheDocument();
    expect(
      within(breadcrumbs).queryByRole('link', { name: 'Product' })
    ).not.toBeInTheDocument();
    expect(
      within(breadcrumbs).getByRole('link', { name: 'Attributes' })
    ).toHaveAttribute('href', clientRoutes.attributes);
    expect(within(breadcrumbs).getByText('Color')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
