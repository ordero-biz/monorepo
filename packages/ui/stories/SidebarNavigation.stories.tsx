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
import { Button } from '@/ui/components/Button';
import {
  SidebarNavigation,
  SidebarNavigationContent,
  SidebarNavigationFooter,
  SidebarNavigationHeader,
  SidebarNavigationSections,
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
        <div className="flex items-center gap-[var(--space-1)] px-[var(--space-1-5)]">
          <div className="flex size-[32px] items-center justify-center rounded-[var(--radius-50-token)] bg-primary text-primary-foreground">
            <Package className="size-4" />
          </div>
          <span className="text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] text-[var(--text-primary)]">
            Ordero
          </span>
        </div>
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
  <div className="h-[960px] bg-[var(--background-paper)]">
    <SidebarShell footer={footer} header={header} items={items} />
  </div>
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

export const WithoutHeaderOrFooter: Story = {
  args: {
    footer: false,
    header: false,
  },
};

export const FrameworkAgnosticLinks: Story = {
  render: () => (
    <div className="h-[480px] bg-[var(--background-paper)]">
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
    <div className="h-[560px] bg-[var(--background-paper)]">
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
