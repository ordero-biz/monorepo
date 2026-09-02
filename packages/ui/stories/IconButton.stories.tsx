import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, RefreshCw } from 'lucide-react';
import {
  IconButton,
  type IconButtonColor,
  type IconButtonSize,
  type IconButtonVariant,
} from '@/ui/components/IconButton';

const colors = [
  'default',
  'inherit',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly IconButtonColor[];
const softColors = [
  'default',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly IconButtonColor[];

const sizes = ['l', 'm', 's', 'xs'] satisfies readonly IconButtonSize[];
const variants = ['text', 'soft'] satisfies readonly IconButtonVariant[];

const meta = {
  id: 'components-iconbutton',
  title: 'Components/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Refresh',
    color: 'default',
    size: 'm',
    variant: 'text',
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

export const Soft: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {softColors.map((color) => (
        <IconButton
          key={color}
          aria-label={`${color} soft icon button`}
          color={color}
          size='l'
          variant='soft'
        >
          <Bell />
        </IconButton>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      <IconButton
        aria-label='Hover primary soft icon button'
        color='primary'
        title='Hover me'
        variant='soft'
      >
        <RefreshCw />
      </IconButton>
      <IconButton
        aria-label='Disabled primary soft icon button'
        color='primary'
        disabled
        variant='soft'
      >
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

export const Variants: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      {variants.map((variant) => (
        <IconButton
          key={variant}
          aria-label={`${variant} primary icon button`}
          color='primary'
          variant={variant}
        >
          <RefreshCw />
        </IconButton>
      ))}
    </div>
  ),
};
