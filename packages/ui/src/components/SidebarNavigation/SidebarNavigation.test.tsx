import { prepareSetup } from '@ordero/test-config/react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Boxes, LayoutDashboard, Package, Settings } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import {
  SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME,
  SidebarNavigation,
  SidebarNavigationBrand,
  SidebarNavigationContent,
  SidebarNavigationDrawerTrigger,
  SidebarNavigationFooter,
  SidebarNavigationHeader,
  SidebarNavigationProvider,
  SidebarNavigationSections,
} from './index';
import type {
  SidebarNavigationProviderProps,
  SidebarNavigationSectionConfig,
} from './types';

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

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
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

  it('reopens a collapsed branch when the active item changes within it', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <SidebarNavigationFixture
        footer={false}
        header={false}
        sections={[
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
                    id: 'categories',
                    kind: 'link',
                    label: 'Categories',
                    href: '/products/categories',
                    active: true,
                  },
                  {
                    id: 'attributes',
                    kind: 'link',
                    label: 'Attributes',
                    href: '/products/attributes',
                  },
                ],
              },
            ],
          },
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Product' }));

    expect(
      screen.queryByRole('link', { name: 'Categories' })
    ).not.toBeInTheDocument();

    rerender(
      <SidebarNavigationFixture
        footer={false}
        header={false}
        sections={[
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
                    id: 'categories',
                    kind: 'link',
                    label: 'Categories',
                    href: '/products/categories',
                  },
                  {
                    id: 'attributes',
                    kind: 'link',
                    label: 'Attributes',
                    href: '/products/attributes',
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
      screen.getByRole('link', { name: 'Attributes' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Attributes' })).toHaveAttribute(
      'aria-current',
      'page'
    );
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

  describe('collapse', () => {
    const collapseSections: SidebarNavigationSectionConfig[] = [
      {
        id: 'overview',
        label: 'Overview',
        collapsible: true,
        defaultExpanded: true,
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
                id: 'category',
                kind: 'link',
                label: 'Category',
                href: '/category',
              },
            ],
          },
        ],
      },
    ];

    type CollapsibleSidebarFixtureProps = Omit<
      SidebarNavigationProviderProps,
      'children'
    > & {
      headerLink?: boolean;
      sections?: SidebarNavigationSectionConfig[];
    };

    const CollapsibleSidebarFixture = ({
      headerLink = false,
      sections = collapseSections,
      ...props
    }: CollapsibleSidebarFixtureProps) => (
      <SidebarNavigationProvider {...props}>
        <SidebarNavigation id="test-sidebar">
          <SidebarNavigationHeader>
            <SidebarNavigationBrand
              logo={<Package aria-hidden="true" />}
              title="Ordero"
            />
            {headerLink ? (
              <a href="#help" id="sidebar-help-link">
                Help
              </a>
            ) : null}
          </SidebarNavigationHeader>
          <SidebarNavigationContent>
            <SidebarNavigationSections sections={sections} />
          </SidebarNavigationContent>
        </SidebarNavigation>
        <main>
          <SidebarNavigationDrawerTrigger />
          Page content
        </main>
      </SidebarNavigationProvider>
    );

    const { setup: setupCollapsible } =
      prepareSetup<CollapsibleSidebarFixtureProps>({
        component: CollapsibleSidebarFixture,
        props: {
          defaultCollapsed: false,
        },
      });

    it('does not render a toggle without a provider', () => {
      setup();

      expect(
        screen.queryByRole('button', { name: 'Collapse sidebar' })
      ).not.toBeInTheDocument();
    });

    it('collapses and expands with the edge button', async () => {
      const user = userEvent.setup();

      setupCollapsible();

      await user.click(
        screen.getByRole('button', { name: 'Collapse sidebar' })
      );

      expect(
        screen.getByRole('button', { name: 'Expand sidebar' })
      ).toHaveAttribute('aria-expanded', 'false');

      await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

      expect(
        screen.getByRole('button', { name: 'Collapse sidebar' })
      ).toHaveAttribute('aria-expanded', 'true');
    });

    it('reports desktop changes and persists them in the cookie the server reads', async () => {
      const user = userEvent.setup();

      const { onCollapsedChange } = setupCollapsible({
        onCollapsedChange: vi.fn(),
      });

      await user.click(
        screen.getByRole('button', { name: 'Collapse sidebar' })
      );

      expect(onCollapsedChange).toHaveBeenCalledWith(true);
      expect(document.cookie).toContain(
        `${SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME}=true`
      );
    });

    it('keeps links reachable and opens branch children in a popover when collapsed', async () => {
      const user = userEvent.setup();

      setupCollapsible({ defaultCollapsed: true });

      expect(
        screen.getByRole('link', { name: 'Dashboard' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Category' })
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Product' }));

      expect(
        await screen.findByRole('link', { name: 'Category' })
      ).toBeInTheDocument();
    });

    it('keeps a nested branch open when switching between the expanded rail and its popover', async () => {
      const user = userEvent.setup();
      setupCollapsible({
        sections: [
          {
            id: 'catalog',
            items: [
              {
                id: 'products',
                kind: 'collapse',
                label: 'Products',
                items: [
                  {
                    id: 'categories',
                    kind: 'collapse',
                    label: 'Categories',
                    items: [
                      {
                        id: 'clothing',
                        kind: 'link',
                        label: 'Clothing',
                        href: '/clothing',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      await user.click(screen.getByRole('button', { name: 'Products' }));
      await user.click(screen.getByRole('button', { name: 'Categories' }));
      expect(screen.getByRole('link', { name: 'Clothing' })).toBeVisible();

      await user.click(
        screen.getByRole('button', { name: 'Collapse sidebar' })
      );
      await user.click(screen.getByRole('button', { name: 'Products' }));
      const submenu = await screen.findByRole('dialog', {
        name: 'Products submenu',
      });
      expect(
        within(submenu).getByRole('link', { name: 'Clothing' })
      ).toBeVisible();

      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
      expect(screen.getByRole('link', { name: 'Clothing' })).toBeVisible();
    });

    it('closes a collapsed submenu after an action runs and restores focus to its trigger', async () => {
      const user = userEvent.setup();
      const {
        sections: [
          {
            items: [branch],
          },
        ],
      } = setupCollapsible({
        defaultCollapsed: true,
        sections: [
          {
            id: 'catalog',
            items: [
              {
                id: 'products',
                kind: 'collapse',
                label: 'Products',
                items: [
                  {
                    id: 'refresh',
                    kind: 'action',
                    label: 'Refresh catalog',
                    onSelect: vi.fn(),
                  },
                ],
              },
            ],
          },
        ],
      });
      const action = branch?.kind === 'collapse' ? branch.items[0] : undefined;
      if (action?.kind !== 'action') {
        throw new Error('Expected a submenu action');
      }

      const trigger = screen.getByRole('button', { name: 'Products' });
      await user.click(trigger);
      const submenu = await screen.findByRole('dialog', {
        name: 'Products submenu',
      });
      within(submenu).getByRole('button', { name: 'Refresh catalog' }).focus();
      await user.keyboard('{Enter}');

      expect(action.onSelect).toHaveBeenCalledOnce();
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
      });
    });

    it('leaves a controlled state to the consumer and does not persist it', async () => {
      const user = userEvent.setup();
      // biome-ignore lint/suspicious/noDocumentCookie: resets the persisted state for this test
      document.cookie = `${SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME}=false; path=/`;

      const { onCollapsedChange } = setupCollapsible({
        collapsed: false,
        onCollapsedChange: vi.fn(),
      });

      await user.click(
        screen.getByRole('button', { name: 'Collapse sidebar' })
      );

      expect(onCollapsedChange).toHaveBeenCalledWith(true);
      expect(
        screen.getByRole('button', { name: 'Collapse sidebar' })
      ).toHaveAttribute('aria-expanded', 'true');
      expect(document.cookie).toContain(
        `${SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME}=false`
      );
    });

    describe('on mobile', () => {
      let matchingMediaQuery: string;
      let mediaQuery: EventTarget & { matches: boolean };
      const matchMedia = vi.fn((query: string) =>
        Object.assign(mediaQuery, { matches: query === matchingMediaQuery })
      );

      beforeEach(() => {
        matchingMediaQuery = '(width < 900px)';
        document.documentElement.style.setProperty('--breakpoint-md', '900px');
        document.documentElement.style.setProperty('--breakpoint-lg', '1200px');
        mediaQuery = Object.assign(new EventTarget(), { matches: true });
        matchMedia.mockClear();
        vi.stubGlobal('matchMedia', matchMedia);
      });

      afterEach(() => {
        document.documentElement.style.removeProperty('--breakpoint-md');
        document.documentElement.style.removeProperty('--breakpoint-lg');
        vi.unstubAllGlobals();
      });

      const openDrawer = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(
          screen.getByRole('button', { name: 'Open navigation' })
        );

        return screen.findByRole('dialog', { name: 'Sidebar navigation' });
      };

      it.each([
        false,
        true,
      ])('starts closed with desktop collapsed set to %s', (defaultCollapsed) => {
        setupCollapsible({ defaultCollapsed });

        expect(
          screen.getByRole('button', { name: 'Open navigation' })
        ).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      it('hides the desktop rail after hydrating on mobile', () => {
        const fixture = <CollapsibleSidebarFixture />;
        const serverMarkup = new DOMParser().parseFromString(
          renderToString(fixture),
          'text/html'
        );
        const container = document.body.appendChild(
          document.createElement('div')
        );
        container.append(...serverMarkup.body.childNodes);
        const onRecoverableError = vi.fn();

        expect(matchMedia).not.toHaveBeenCalled();
        expect(
          within(container).getByRole('link', { name: 'Dashboard' })
        ).toBeInTheDocument();

        render(fixture, { container, hydrate: true, onRecoverableError });

        expect(onRecoverableError).not.toHaveBeenCalled();
        expect(
          within(container).queryByRole('link', { name: 'Dashboard' })
        ).not.toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Open navigation' })
        ).toBeInTheDocument();
      });

      it('opens the drawer at the breakpoint selected by the app shell', async () => {
        matchingMediaQuery = '(width < 1200px)';
        const user = userEvent.setup();

        setupCollapsible({ breakpoint: 'lg' });

        expect(await openDrawer(user)).toBeVisible();
      });

      it('opens the expanded sidebar in a modal drawer and moves focus into it', async () => {
        const user = userEvent.setup();

        setupCollapsible();

        const drawer = await openDrawer(user);

        expect(
          within(drawer).getByRole('link', { name: 'Dashboard' })
        ).toBeVisible();
        // While the modal drawer is open the page behind it, including the
        // menu button, is hidden from assistive technology.
        expect(
          screen.getByRole('button', { hidden: true, name: 'Open navigation' })
        ).toHaveAttribute('aria-controls', drawer.id);
        await waitFor(() =>
          expect(drawer).toContainElement(document.activeElement as HTMLElement)
        );
      });

      it('closes after a link is selected', async () => {
        const user = userEvent.setup();

        setupCollapsible();

        const drawer = await openDrawer(user);

        await user.click(
          within(drawer).getByRole('link', { name: 'Dashboard' })
        );

        await waitFor(() =>
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );
      });

      it('closes after keyboard activation of a custom-rendered menu link', async () => {
        const user = userEvent.setup();
        setupCollapsible({
          sections: [
            {
              id: 'orders',
              items: [
                {
                  id: 'orders-link',
                  kind: 'link',
                  label: 'Orders',
                  href: '/orders',
                  renderLink: ({ children, href }) => (
                    <a
                      href={`/app${href}`}
                      onClick={(event) => event.preventDefault()}
                    >
                      {children}
                    </a>
                  ),
                },
              ],
            },
          ],
        });

        const drawer = await openDrawer(user);
        within(drawer).getByRole('link', { name: 'Orders' }).focus();
        await user.keyboard('{Enter}');

        await waitFor(() =>
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );
      });

      it('stays open when a link in the custom header is selected', async () => {
        const user = userEvent.setup();
        setupCollapsible({ headerLink: true });

        const drawer = await openDrawer(user);
        await user.click(within(drawer).getByRole('link', { name: 'Help' }));

        expect(
          screen.getByRole('dialog', { name: 'Sidebar navigation' })
        ).toBeInTheDocument();
      });

      it('renders one copy of custom header content when switching between rail and drawer', async () => {
        matchingMediaQuery = '';
        const user = userEvent.setup();
        setupCollapsible({ headerLink: true });

        expect(screen.getByText('Help')).toBeVisible();

        act(() => {
          mediaQuery.matches = true;
          mediaQuery.dispatchEvent(new Event('change'));
        });
        const drawer = await openDrawer(user);

        expect(screen.getByText('Help')).toBe(
          within(drawer).getByRole('link', { name: 'Help' })
        );
        expect(screen.getByText('Help')).toHaveAttribute(
          'id',
          'sidebar-help-link'
        );

        await user.keyboard('{Escape}');
        await waitFor(() =>
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );
        expect(screen.getByText('Help')).not.toBeVisible();

        act(() => {
          mediaQuery.matches = false;
          mediaQuery.dispatchEvent(new Event('change'));
        });
        expect(screen.getByText('Help')).toBeVisible();
      });

      it('runs the selected action and closes the drawer', async () => {
        const user = userEvent.setup();
        const {
          sections: [
            {
              items: [action],
            },
          ],
        } = setupCollapsible({
          sections: [
            {
              id: 'account',
              label: 'Account',
              items: [
                {
                  id: 'settings',
                  kind: 'action',
                  label: 'Settings',
                  onSelect: vi.fn(),
                },
              ],
            },
          ],
        });

        const drawer = await openDrawer(user);
        const settings = within(drawer).getByRole('button', {
          name: action.label,
        });
        settings.focus();
        await user.keyboard('{Enter}');

        expect(action.onSelect).toHaveBeenCalledOnce();
        await waitFor(() =>
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );
      });

      it('stays open when a branch is expanded', async () => {
        const user = userEvent.setup();

        setupCollapsible();

        const drawer = await openDrawer(user);

        await user.click(
          within(drawer).getByRole('button', { name: 'Product' })
        );

        expect(
          within(drawer).getByRole('link', { name: 'Category' })
        ).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      it('keeps branches the user expanded open the next time it opens', async () => {
        const user = userEvent.setup();

        setupCollapsible();

        const drawer = await openDrawer(user);

        await user.click(
          within(drawer).getByRole('button', { name: 'Product' })
        );
        await user.keyboard('{Escape}');
        await waitFor(() =>
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );

        const reopenedDrawer = await openDrawer(user);

        expect(
          within(reopenedDrawer).getByRole('link', { name: 'Category' })
        ).toBeVisible();
      });

      it('closes with the in-drawer button and returns focus to the menu button', async () => {
        const user = userEvent.setup();
        setupCollapsible();

        const drawer = await openDrawer(user);

        await user.click(
          within(drawer).getByRole('button', { name: 'Close navigation' })
        );

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
          expect(
            screen.getByRole('button', { name: 'Open navigation' })
          ).toHaveFocus();
        });
      });

      it('closes on Escape and returns focus to the menu button', async () => {
        const user = userEvent.setup();

        setupCollapsible();

        await openDrawer(user);
        await user.keyboard('{Escape}');

        await waitFor(() =>
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );
        expect(
          screen.getByRole('button', { name: 'Open navigation' })
        ).toHaveFocus();
      });

      it('allows expanding drawer sections and preserves the collapsed desktop rail', async () => {
        const user = userEvent.setup();
        setupCollapsible({ defaultCollapsed: true });

        const drawer = await openDrawer(user);
        const overview = within(drawer).getByRole('button', {
          name: 'Overview',
        });
        await user.click(overview);
        expect(overview).toHaveAttribute('aria-expanded', 'false');
        await user.click(overview);
        expect(
          within(drawer).getByRole('link', { name: 'Dashboard' })
        ).toBeInTheDocument();

        act(() => {
          mediaQuery.matches = false;
          mediaQuery.dispatchEvent(new Event('change'));
        });

        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: 'Expand sidebar' })
          ).toHaveFocus()
        );
      });

      it('preserves expanded desktop branches across the mobile breakpoint', async () => {
        matchingMediaQuery = '';
        const user = userEvent.setup();
        setupCollapsible();

        await user.click(screen.getByRole('button', { name: 'Product' }));
        expect(screen.getByRole('link', { name: 'Category' })).toBeVisible();

        act(() => {
          mediaQuery.matches = true;
          mediaQuery.dispatchEvent(new Event('change'));
        });
        expect(
          screen.queryByRole('link', { name: 'Category' })
        ).not.toBeInTheDocument();

        act(() => {
          mediaQuery.matches = false;
          mediaQuery.dispatchEvent(new Event('change'));
        });
        expect(screen.getByRole('link', { name: 'Category' })).toBeVisible();
      });

      it('dismisses a desktop popover when entering mobile', async () => {
        matchingMediaQuery = '';
        const user = userEvent.setup();
        setupCollapsible({ defaultCollapsed: true });

        await user.click(screen.getByRole('button', { name: 'Product' }));
        expect(
          await screen.findByRole('dialog', { name: 'Product submenu' })
        ).toBeVisible();

        act(() => {
          mediaQuery.matches = true;
          mediaQuery.dispatchEvent(new Event('change'));
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      it('closes on crossing to desktop and returns focus to the rail toggle', async () => {
        const user = userEvent.setup();
        setupCollapsible();

        await openDrawer(user);
        act(() => {
          mediaQuery.matches = false;
          mediaQuery.dispatchEvent(new Event('change'));
        });

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
          expect(
            screen.getByRole('button', { name: 'Collapse sidebar' })
          ).toHaveFocus();
        });
      });
    });
  });
});
