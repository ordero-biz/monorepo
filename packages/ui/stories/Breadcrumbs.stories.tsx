import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '@/ui/components/Breadcrumbs';

const meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { href: '/dashboard', id: 'dashboard', label: 'Dashboard' },
      { href: '/products', id: 'products', label: 'Products' },
      { id: 'categories', label: 'Categories' },
    ],
  },
};

export const DynamicCurrentItem: Story = {
  args: {
    items: [
      { href: '/dashboard', id: 'dashboard', label: 'Dashboard' },
      { href: '/products', id: 'products', label: 'Products' },
      {
        href: '/products/categories',
        id: 'categories',
        label: 'Categories',
      },
      { id: 'current-category', label: 'Seasonal products' },
    ],
  },
};
