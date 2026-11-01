import { prepareSetup } from '@ordero/test-config/react';
import { screen, within } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbsProps } from './types';

describe('Breadcrumbs', () => {
  const { setup } = prepareSetup<BreadcrumbsProps>({
    component: Breadcrumbs,
    props: {
      items: [
        { href: '/dashboard', id: 'dashboard', label: 'Dashboard' },
        { href: '/products', id: 'products', label: 'Products' },
        { id: 'categories', label: 'Categories' },
      ],
    },
  });

  it('renders linked ancestors and exposes the current page', () => {
    setup();

    const navigation = screen.getByRole('navigation', {
      name: 'Breadcrumb',
    });

    expect(
      within(navigation).getByRole('link', { name: 'Dashboard' })
    ).toHaveAttribute('href', '/dashboard');
    expect(
      within(navigation).getByRole('link', { name: 'Products' })
    ).toHaveAttribute('href', '/products');
    expect(within(navigation).getByText('Categories')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('supports framework-specific link rendering', () => {
    setup({
      renderLink: ({ children, className, href }) => (
        <a className={className} href={`/store${href}`}>
          {children}
        </a>
      ),
    });

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/store/dashboard'
    );
  });
});
