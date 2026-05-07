import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Boxes, LayoutDashboard, Package, Settings } from 'lucide-react';
import {
  SidebarNavigation,
  SidebarNavigationContent,
  SidebarNavigationFooter,
  SidebarNavigationHeader,
  SidebarNavigationSections,
} from './index';
import type { SidebarNavigationSectionConfig } from './types';

type SidebarNavigationFixtureProps = {
  footer?: boolean;
  header?: boolean;
  sections: SidebarNavigationSectionConfig[];
};

const SidebarNavigationFixture = ({
  footer = true,
  header = true,
  sections,
}: SidebarNavigationFixtureProps) => (
  <SidebarNavigation>
    {header ? (
      <SidebarNavigationHeader>
        <div>Ordero</div>
      </SidebarNavigationHeader>
    ) : null}
    <SidebarNavigationContent>
      <SidebarNavigationSections sections={sections} />
    </SidebarNavigationContent>
    {footer ? (
      <SidebarNavigationFooter>
        <div>Footer profile</div>
      </SidebarNavigationFooter>
    ) : null}
  </SidebarNavigation>
);

describe('SidebarNavigation', () => {
  const onSettingsSelect = vi.fn();

  const { setup } = prepareSetup<SidebarNavigationFixtureProps>({
    component: SidebarNavigationFixture,
    props: {
      sections: [
        {
          id: 'overview',
          label: 'Overview',
          items: [
            {
              id: 'dashboard',
              kind: 'link',
              label: 'Dashboard',
              href: '/dashboard',
              icon: <LayoutDashboard aria-hidden="true" />,
            },
            {
              id: 'product',
              kind: 'collapse',
              label: 'Product',
              icon: <Package aria-hidden="true" />,
              items: [
                {
                  id: 'all-products',
                  kind: 'link',
                  label: 'Product',
                  href: '/products',
                  active: true,
                },
                {
                  id: 'hidden-product-child',
                  kind: 'link',
                  label: 'Hidden child',
                  href: '/hidden',
                  hidden: true,
                },
              ],
            },
          ],
        },
        {
          id: 'management',
          label: 'Management',
          collapsible: true,
          defaultExpanded: false,
          items: [
            {
              id: 'warehouse',
              kind: 'link',
              label: 'Warehouse',
              href: '/warehouse',
              icon: <Boxes aria-hidden="true" />,
            },
            {
              id: 'settings-action',
              kind: 'action',
              label: 'Settings',
              icon: <Settings aria-hidden="true" />,
              onSelect: onSettingsSelect,
            },
          ],
        },
      ],
    },
  });

  beforeEach(() => {
    onSettingsSelect.mockReset();
  });

  it('renders optional header and footer slots', () => {
    setup();

    expect(screen.getByText('Ordero')).toBeInTheDocument();
    expect(screen.getByText('Footer profile')).toBeInTheDocument();
  });

  it('hides hidden items and auto-expands branches with an active child', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Hidden child' })
    ).not.toBeInTheDocument();
  });

  it('toggles collapsible menu items when the whole row is clicked', async () => {
    const user = userEvent.setup();

    setup({
      sections: [
        {
          id: 'overview',
          label: 'Overview',
          items: [
            {
              id: 'product',
              kind: 'collapse',
              label: 'Product',
              items: [
                {
                  id: 'category',
                  kind: 'link',
                  label: 'Category',
                  href: '/category',
                },
              ],
            },
          ],
        },
      ],
    });

    expect(
      screen.queryByRole('link', { name: 'Category' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Product' }));

    expect(screen.getByRole('link', { name: 'Category' })).toBeInTheDocument();
  });

  it('supports nested collapsible branches through multiple levels', async () => {
    const user = userEvent.setup();

    setup({
      sections: [
        {
          id: 'overview',
          label: 'Overview',
          items: [
            {
              id: 'product',
              kind: 'collapse',
              label: 'Product',
              items: [
                {
                  id: 'category',
                  kind: 'collapse',
                  label: 'Category',
                  items: [
                    {
                      id: 'attributes',
                      kind: 'link',
                      label: 'Attributes',
                      href: '/attributes',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(
      screen.queryByRole('button', { name: 'Category' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Attributes' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Product' }));

    expect(
      screen.getByRole('button', { name: 'Category' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Attributes' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Category' }));

    expect(
      screen.getByRole('link', { name: 'Attributes' })
    ).toBeInTheDocument();
  });

  it('toggles collapsible sections', async () => {
    const user = userEvent.setup();

    setup();

    expect(
      screen.queryByRole('link', { name: 'Warehouse' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Management' }));

    expect(screen.getByRole('link', { name: 'Warehouse' })).toBeInTheDocument();
  });

  it('re-expands the active section and branch after route changes', () => {
    const { rerender } = render(
      <SidebarNavigationFixture
        footer={false}
        header={false}
        sections={[
          {
            id: 'overview',
            label: 'Overview',
            collapsible: true,
            items: [
              {
                id: 'dashboard',
                kind: 'link',
                label: 'Dashboard',
                href: '/dashboard',
                active: true,
              },
            ],
          },
          {
            id: 'management',
            label: 'Management',
            collapsible: true,
            defaultExpanded: false,
            items: [
              {
                id: 'catalog',
                kind: 'collapse',
                label: 'Catalog',
                items: [
                  {
                    id: 'catalog-products',
                    kind: 'link',
                    label: 'Catalog products',
                    href: '/products',
                  },
                ],
              },
            ],
          },
        ]}
      />
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Catalog products' })
    ).not.toBeInTheDocument();

    rerender(
      <SidebarNavigationFixture
        footer={false}
        header={false}
        sections={[
          {
            id: 'overview',
            label: 'Overview',
            collapsible: true,
            items: [
              {
                id: 'dashboard',
                kind: 'link',
                label: 'Dashboard',
                href: '/dashboard',
              },
            ],
          },
          {
            id: 'management',
            label: 'Management',
            collapsible: true,
            defaultExpanded: false,
            items: [
              {
                id: 'catalog',
                kind: 'collapse',
                label: 'Catalog',
                items: [
                  {
                    id: 'catalog-products',
                    kind: 'link',
                    label: 'Catalog products',
                    href: '/products',
                    active: true,
                  },
                ],
              },
            ],
          },
        ]}
      />
    );

    expect(
      screen.queryByRole('link', { name: 'Dashboard' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Catalog products' })
    ).toBeInTheDocument();
  });

  it('calls on click actions when enabled', async () => {
    const user = userEvent.setup();

    setup({
      sections: [
        {
          id: 'actions',
          items: [
            {
              id: 'settings-action',
              kind: 'action',
              label: 'Settings',
              onSelect: onSettingsSelect,
            },
          ],
        },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Settings' }));

    expect(onSettingsSelect).toHaveBeenCalledTimes(1);
  });

  it('does not call disabled actions', async () => {
    const user = userEvent.setup();

    setup({
      sections: [
        {
          id: 'actions',
          items: [
            {
              id: 'settings-action',
              kind: 'action',
              label: 'Settings',
              disabled: true,
              onSelect: onSettingsSelect,
            },
          ],
        },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Settings' }));

    expect(screen.getByRole('button', { name: 'Settings' })).toBeDisabled();
    expect(onSettingsSelect).not.toHaveBeenCalled();
  });

  it('supports per-item custom link renderers for framework-specific navigation', () => {
    setup({
      sections: [
        {
          id: 'links',
          items: [
            {
              id: 'custom-link',
              kind: 'link',
              label: 'Custom link',
              href: '/orders',
              renderLink: ({ children, className, href }) => (
                <a
                  className={className}
                  data-testid="custom-router-link"
                  href={`/app${href}`}
                >
                  {children}
                </a>
              ),
            },
          ],
        },
      ],
    });

    expect(screen.getByTestId('custom-router-link')).toHaveAttribute(
      'href',
      '/app/orders'
    );
  });
});
