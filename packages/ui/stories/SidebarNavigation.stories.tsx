import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartColumn,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Package,
  RefreshCw,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from 'lucide-react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '@/ui/components/Button';
import {
  SidebarNavigation,
  SidebarNavigationBrand,
  SidebarNavigationContent,
  SidebarNavigationFooter,
  SidebarNavigationHeader,
  SidebarNavigationProvider,
  SidebarNavigationSections,
  SidebarNavigationDrawerTrigger,
  type SidebarNavigationSectionConfig,
} from '@/ui/components/SidebarNavigation';

const sections: SidebarNavigationSectionConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        kind: 'link',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard />,
      },
      {
        id: 'product',
        kind: 'collapse',
        label: 'Product',
        icon: <Package />,
        items: [
          {
            id: 'product-all',
            kind: 'link',
            label: 'Product',
            href: '/products',
            active: true,
          },
          {
            id: 'product-category',
            kind: 'link',
            label: 'Category',
            href: '/products/categories',
          },
          {
            id: 'product-warehouse',
            kind: 'link',
            label: 'Warehouse',
            href: '/products/warehouse',
          },
        ],
      },
      {
        id: 'supplier',
        kind: 'collapse',
        label: 'Supplier',
        icon: <Warehouse />,
        items: [
          {
            id: 'supplier-supply',
            kind: 'link',
            label: 'Supply',
            href: '/suppliers/supply',
          },
          {
            id: 'supplier-warehouse',
            kind: 'link',
            label: 'Warehouse',
            href: '/suppliers/warehouse',
          },
        ],
      },
      {
        id: 'orders',
        kind: 'link',
        label: 'Order',
        href: '/orders',
        icon: <ShoppingCart />,
      },
      {
        id: 'finance',
        kind: 'link',
        label: 'Finance',
        href: '/finance',
        icon: <ChartColumn />,
      },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    collapsible: true,
    items: [
      {
        id: 'management-home',
        kind: 'action',
        label: 'Management',
        icon: <Users />,
        onSelect: () => undefined,
      },
      {
        id: 'customers',
        kind: 'link',
        label: 'Customers',
        href: '/customers',
        icon: <Users />,
      },
      {
        id: 'settings',
        kind: 'link',
        label: 'Settings',
        href: '/settings',
        icon: <Settings />,
      },
      {
        id: 'messages',
        kind: 'link',
        label: 'Messages',
        href: '/messages',
        icon: <MessageSquareText />,
        badge: (
          <span className="inline-flex min-w-[24px] items-center justify-center rounded-[var(--radius-0-75-token)] bg-[var(--color-error-8)] px-[var(--space-0-75)] text-[length:var(--label-size-desktop)] leading-[var(--label-line-height-desktop)] font-[var(--label-weight)] text-[var(--error-darker)]">
            32+
          </span>
        ),
      },
      {
        id: 'reports',
        kind: 'link',
        label: 'Report',
        href: 'https://example.com/reports',
        external: true,
        icon: <FileText />,
      },
    ],
  },
];

const SidebarShell = ({
  footer = true,
  header = true,
  items,
}: {
  footer?: boolean;
  header?: boolean;
  items: SidebarNavigationSectionConfig[];
}) => (
  <SidebarNavigation>
    {header ? (
      <SidebarNavigationHeader>
        <SidebarNavigationBrand logo={<Package />} title="Ordero" />
      </SidebarNavigationHeader>
    ) : null}
    <SidebarNavigationContent>
      <SidebarNavigationSections sections={items} />
    </SidebarNavigationContent>
    {footer ? (
      <SidebarNavigationFooter>
        <div className="flex flex-col items-start gap-[var(--space-2)]">
          <div className="space-y-[var(--space-0-5)]">
            <p className="text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] text-[var(--text-primary)]">
              Mireya Conner
            </p>
            <p className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-[var(--text-secondary)]">
              hudson.alvarez@gmail.com
            </p>
          </div>
          <Button color="inherit" size="m">
            Upgrade to Pro
          </Button>
        </div>
      </SidebarNavigationFooter>
    ) : null}
  </SidebarNavigation>
);

type SidebarNavigationStoryProps = {
  footer?: boolean;
  header?: boolean;
  items: SidebarNavigationSectionConfig[];
};

const SidebarNavigationStory = ({
  footer = true,
  header = true,
  items,
}: SidebarNavigationStoryProps) => (
  <div className="bg-[var(--background-paper)]">
    <SidebarShell footer={footer} header={header} items={items} />
  </div>
);

const CollapsibleSidebarShell = ({
  items = sections,
}: Partial<Pick<SidebarNavigationStoryProps, 'items'>>) => (
  <SidebarNavigationProvider>
    <SidebarNavigation id="collapsible-sidebar">
      <SidebarNavigationHeader>
        <SidebarNavigationBrand logo={<Package />} title="Ordero" />
      </SidebarNavigationHeader>
      <SidebarNavigationContent>
        <SidebarNavigationSections sections={items} />
      </SidebarNavigationContent>
    </SidebarNavigation>
    <main className="flex flex-1 flex-col gap-[var(--space-2)] p-[var(--space-3)]">
      <SidebarNavigationDrawerTrigger />
      Press the edge button to collapse the sidebar. On mobile, open it with
      the menu button.
    </main>
  </SidebarNavigationProvider>
);

const meta = {
  title: 'Components/SidebarNavigation',
  component: SidebarNavigationStory,
  subcomponents: {
    SidebarNavigation,
    SidebarNavigationContent,
    SidebarNavigationFooter,
    SidebarNavigationHeader,
    SidebarNavigationSections,
  },
  tags: ['autodocs'],
  args: {
    footer: true,
    header: true,
    items: sections,
  },
  argTypes: {
    items: {
      control: false,
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SidebarNavigationStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsible: Story = {
  render: () => <CollapsibleSidebarShell />,
};

export const CollapsedItemsWithoutIcons: Story = {
  args: {
    items: [
      {
        id: 'overview',
        items: [
          {
            id: 'dashboard',
            kind: 'link',
            label: 'Dashboard',
            href: '/dashboard',
          },
          {
            id: 'products',
            kind: 'collapse',
            label: 'Products',
            items: [
              {
                id: 'categories',
                kind: 'link',
                label: 'Categories',
                href: '/categories',
              },
            ],
          },
        ],
      },
    ],
  },
  render: ({ items }) => <CollapsibleSidebarShell items={items} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse sidebar' })
    );

    const dashboard = canvas.getByRole('link', { name: 'Dashboard' });
    const products = canvas.getByRole('button', { name: 'Products' });

    await expect(within(dashboard).getByText('D')).toBeVisible();
    await expect(within(products).getByText('P')).toBeVisible();
    await expect(products).toHaveAttribute('title', 'Products');
    await userEvent.tab({ shift: true });
    await expect(products).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(
      await page.findByRole('link', { name: 'Categories' })
    ).toBeVisible();
  },
};

export const CollapsedScrollableSubmenu: Story = {
  args: {
    items: [
      {
        id: 'catalog',
        items: [
          {
            id: 'categories',
            kind: 'collapse',
            label: 'Categories',
            items: Array.from({ length: 30 }, (_, index) => ({
              id: `category-${index + 1}`,
              kind: 'link',
              label: `Category ${index + 1}`,
              href: `/categories/${index + 1}`,
            })),
          },
        ],
      },
    ],
  },
  render: ({ items }) => <CollapsibleSidebarShell items={items} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const document = canvasElement.ownerDocument;

    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse sidebar' })
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Categories' }));

    const submenu = await within(document.body).findByRole('dialog', {
      name: 'Categories submenu',
    });
    const lastLink = within(submenu).getByRole('link', { name: 'Category 30' });

    await waitFor(() => {
      expect(submenu.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        document.documentElement.clientHeight
      );
      expect(submenu.scrollHeight).toBeGreaterThan(submenu.clientHeight);
    });

    lastLink.scrollIntoView({ block: 'nearest' });

    const { left, right, top, bottom } = lastLink.getBoundingClientRect();
    const hitTarget = document.elementFromPoint(
      (left + right) / 2,
      (top + bottom) / 2
    );
    await expect(lastLink.contains(hitTarget)).toBe(true);
  },
};

const mobileGlobals = {
  viewport: { isRotated: false, value: 'mobile1' },
};

export const StandaloneOnMobile: Story = {
  globals: mobileGlobals,
  play: async ({ canvasElement }) => {
    const sidebar = within(canvasElement).getByRole('complementary', {
      name: 'Sidebar navigation',
    });

    await expect(
      within(sidebar).getByRole('link', { name: 'Dashboard' })
    ).toBeVisible();
  },
};

const openMobileDrawer = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const page = within(canvasElement.ownerDocument.body);

  await userEvent.click(
    canvas.getByRole('button', { name: 'Open navigation' })
  );

  return page.findByRole('dialog', { name: 'Sidebar navigation' });
};

export const MobileDrawerOpen: Story = {
  globals: mobileGlobals,
  render: () => <CollapsibleSidebarShell />,
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const transitions = new Set<EventTarget>();
    const recordSlide = (event: TransitionEvent) => {
      if (event.propertyName === 'transform' && event.target) {
        transitions.add(event.target);
      }
    };
    document.addEventListener('transitionrun', recordSlide);

    try {
      const drawer = await openMobileDrawer(canvasElement);
      const closeButton = within(drawer).getByRole('button', {
        name: 'Close navigation',
      });

      await expect(
        within(drawer).getByRole('link', { name: 'Dashboard' })
      ).toBeVisible();
      await expect(closeButton.getBoundingClientRect().right).toBeLessThan(
        drawer.getBoundingClientRect().right
      );
      if (!document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await waitFor(() => expect(transitions.has(drawer)).toBe(true));
      }
    } finally {
      document.removeEventListener('transitionrun', recordSlide);
    }
  },
};

export const MobileDrawerCloseButton: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => <CollapsibleSidebarShell />,
  play: async ({ canvasElement }) => {
    const drawer = await openMobileDrawer(canvasElement);
    const closeButton = within(drawer).getByRole('button', {
      name: 'Close navigation',
    });
    const document = canvasElement.ownerDocument;

    await waitFor(() => {
      const { left, right, top, bottom } = closeButton.getBoundingClientRect();
      const hitTarget = document.elementFromPoint(
        (left + right) / 2,
        (top + bottom) / 2
      );

      expect(left).toBeGreaterThan(drawer.getBoundingClientRect().right);
      expect(right).toBeLessThanOrEqual(document.documentElement.clientWidth);
      expect(closeButton.contains(hitTarget)).toBe(true);
    });

    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      expect(
        within(canvasElement).getByRole('button', { name: 'Open navigation' })
      ).toHaveFocus();
    });
  },
};

export const MobileDrawerDismiss: Story = {
  globals: mobileGlobals,
  render: () => <CollapsibleSidebarShell />,
  play: async ({ canvasElement }) => {
    const documentBody = canvasElement.ownerDocument.body;
    const page = within(documentBody);

    await openMobileDrawer(canvasElement);

    const backdrop = documentBody.querySelector(
      '[data-slot="sidebar-navigation-backdrop"]'
    );

    if (!(backdrop instanceof HTMLElement)) {
      throw new Error('Sidebar navigation backdrop is not rendered');
    }

    await userEvent.click(backdrop);

    await waitFor(() =>
      expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    );
    await expect(
      within(canvasElement).getByRole('button', { name: 'Open navigation' })
    ).toHaveFocus();
  },
};

export const WithoutHeaderOrFooter: Story = {
  args: {
    footer: false,
    header: false,
  },
};

export const DeeplyNestedBranches: Story = {
  args: {
    items: [
      {
        id: 'overview',
        label: 'Overview',
        items: [
          {
            id: 'product',
            kind: 'collapse',
            label: 'Product',
            icon: <Package />,
            defaultExpanded: true,
            items: [
              {
                id: 'product-all',
                kind: 'link',
                label: 'Product',
                href: '/products',
                active: true,
              },
              {
                id: 'product-category',
                kind: 'collapse',
                label: 'Category',
                defaultExpanded: true,
                items: [
                  {
                    id: 'product-category-attributes',
                    kind: 'link',
                    label: 'Attributes',
                    href: '/products/categories/attributes',
                  },
                  {
                    id: 'product-category-history',
                    kind: 'link',
                    label: 'History of movement',
                    href: '/products/categories/history',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const FrameworkAgnosticLinks: Story = {
  render: () => (
    <div className="bg-[var(--background-paper)]">
      <SidebarNavigation>
        <SidebarNavigationContent>
          <SidebarNavigationSections
            sections={[
              {
                id: 'links',
                label: 'Overview',
                items: [
                  {
                    id: 'next-link',
                    kind: 'link',
                    label: 'Next style link',
                    href: '/products',
                    icon: <Package />,
                    renderLink: ({ children, className, href }) => (
                      <a className={className} data-router="next" href={href}>
                        {children}
                      </a>
                    ),
                  },
                  {
                    id: 'react-router-link',
                    kind: 'link',
                    label: 'React Router style link',
                    href: '/orders',
                    icon: <ShoppingCart />,
                    renderLink: ({ children, className, href }) => (
                      <a
                        className={className}
                        data-router="react-router"
                        href={`#${href}`}
                      >
                        {children}
                      </a>
                    ),
                  },
                ],
              },
            ]}
          />
        </SidebarNavigationContent>
      </SidebarNavigation>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <div className="bg-[var(--background-paper)]">
      <SidebarNavigation>
        <SidebarNavigationContent>
          <SidebarNavigationSections
            sections={[
              {
                id: 'overview',
                label: 'Overview',
                items: [
                  {
                    id: 'enabled-dashboard',
                    kind: 'link',
                    label: 'Dashboard',
                    href: '/dashboard',
                    icon: <LayoutDashboard />,
                  },
                  {
                    id: 'disabled-link',
                    kind: 'link',
                    label: 'Reports',
                    href: '/reports',
                    icon: <FileText />,
                    disabled: true,
                  },
                  {
                    id: 'disabled-action',
                    kind: 'action',
                    label: 'Sync',
                    icon: <RefreshCw />,
                    disabled: true,
                    onSelect: () => undefined,
                  },
                  {
                    id: 'disabled-collapse',
                    kind: 'collapse',
                    label: 'Supplier',
                    icon: <Warehouse />,
                    disabled: true,
                    items: [
                      {
                        id: 'disabled-collapse-child',
                        kind: 'link',
                        label: 'Warehouse',
                        href: '/suppliers/warehouse',
                      },
                    ],
                  },
                ],
              },
            ]}
          />
        </SidebarNavigationContent>
      </SidebarNavigation>
    </div>
  ),
};
