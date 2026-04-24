import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/ui/components/Button';

const variants = ['contained', 'outlined', 'text', 'soft'] as const;
const colors = [
  'inherit',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    color: 'inherit',
    size: 'm',
    variant: 'contained',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-col gap-3'>
          <p className='text-sm font-medium capitalize text-muted-foreground'>
            {variant}
          </p>
          <div className='flex flex-wrap gap-3'>
            {colors.map((color) => (
              <Button key={`${variant}-${color}`} variant={variant} color={color}>
                {color}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      <Button size='s'>Small</Button>
      <Button size='m'>Medium</Button>
      <Button size='l'>Large</Button>
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-col gap-3'>
          <p className='text-sm font-medium capitalize text-muted-foreground'>
            {variant}
          </p>
          <div className='flex flex-wrap gap-3'>
            <Button variant={variant} color='primary'>
              Enabled
            </Button>
            <Button variant={variant} color='primary' disabled>
              Disabled
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-col gap-3'>
          <p className='text-sm font-medium capitalize text-muted-foreground'>
            {variant}
          </p>
          <div className='flex flex-wrap gap-3'>
            <Button
              variant={variant}
              color='primary'
              size='l'
              startIcon={<Sparkles />}
            >
              Start Icon
            </Button>
            <Button
              variant={variant}
              color='primary'
              size='l'
              endIcon={<ChevronRight />}
            >
              End Icon
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};
