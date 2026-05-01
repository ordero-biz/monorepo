import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, RefreshCw } from 'lucide-react';
import {
  IconButton,
  type IconButtonColor,
  type IconButtonSize,
} from '@/ui/components/IconButton';

const colors = [
  'default',
  'inherit',
  'primary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly IconButtonColor[];

const sizes = ['l', 'm', 's', 'xs'] satisfies readonly IconButtonSize[];

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Refresh',
    color: 'default',
    size: 'm',
    children: <RefreshCw />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {colors.map((color) => (
        <IconButton
          key={color}
          aria-label={`${color} icon button`}
          color={color}
        >
          <RefreshCw />
        </IconButton>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      <IconButton aria-label='Hover primary icon button' color='primary' title='Hover me'>
        <RefreshCw />
      </IconButton>
      <IconButton aria-label='Disabled primary icon button' color='primary' disabled>
        <RefreshCw />
      </IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      {sizes.map((size) => (
        <IconButton
          key={size}
          aria-label={`${size} icon button`}
          size={size}
        >
          <Bell />
        </IconButton>
      ))}
    </div>
  ),
};
