import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkles } from 'lucide-react';
import {
  Chip,
  type ChipColor,
  type ChipSize,
  type ChipVariant,
} from '@/ui/components/Chip';

const variants = ['filled', 'outlined', 'soft'] satisfies readonly ChipVariant[];
const colors = [
  'inherit',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly ChipColor[];
const sizes = ['s', 'm'] satisfies readonly ChipSize[];
const formatVariantTitle = (variant: ChipVariant) =>
  `${variant[0].toUpperCase()}${variant.slice(1)}`;

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: {
    children: 'Default',
    color: 'inherit',
    size: 'm',
    variant: 'filled',
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-col gap-3'>
          <p className='text-sm font-medium text-muted-foreground'>
            {formatVariantTitle(variant)}
          </p>
          <div className='flex flex-wrap gap-3'>
            {colors.map((color) => (
              <Chip key={`${variant}-${color}`} variant={variant} color={color}>
                {color}
              </Chip>
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
      {sizes.map((size) => (
        <Chip key={size} size={size} color='primary'>
          {size === 's' ? 'Small' : 'Medium'}
        </Chip>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Chip
        color='inherit'
        startIcon={<Sparkles aria-hidden='true' />}
      >
        Default
      </Chip>
      <Chip color='primary' size='s' startIcon={<Sparkles aria-hidden='true' />}>
        Small
      </Chip>
    </div>
  ),
};

export const WithCloseButton: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-col gap-3'>
          <p className='text-sm font-medium text-muted-foreground'>
            {formatVariantTitle(variant)}
          </p>
          <div className='flex flex-wrap gap-3'>
            {colors.map((color) => (
              <Chip
                key={`close-${variant}-${color}`}
                variant={variant}
                color={color}
                onDelete={() => undefined}
              >
                {color}
              </Chip>
            ))}
          </div>
        </div>
      ))}
      <div className='flex flex-col gap-3'>
        <p className='text-sm font-medium text-muted-foreground'>small</p>
        {variants.map((variant) => (
          <div key={`small-${variant}`} className='flex flex-col gap-3'>
            <p className='text-sm font-medium text-muted-foreground'>
              {formatVariantTitle(variant)}
            </p>
            <div className='flex flex-wrap gap-3'>
              {colors.map((color) => (
                <Chip
                  key={`close-small-${variant}-${color}`}
                  variant={variant}
                  size='s'
                  color={color}
                  onDelete={() => undefined}
                >
                  {color}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const WithIconAndCloseButton: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={`icon-close-${variant}`} className='flex flex-col gap-3'>
          <p className='text-sm font-medium text-muted-foreground'>
            {formatVariantTitle(variant)}
          </p>
          {sizes.map((size) => (
            <div key={`icon-close-${variant}-${size}`} className='flex flex-col gap-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                {size === 's' ? 'small' : 'medium'}
              </p>
              <div className='flex flex-wrap gap-3'>
                {colors.map((color) => (
                  <Chip
                    key={`icon-close-${variant}-${size}-${color}`}
                    color={color}
                    size={size}
                    variant={variant}
                    startIcon={<Sparkles aria-hidden='true' />}
                    onDelete={() => undefined}
                  >
                    {color}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3'>
        <p className='text-sm font-medium text-muted-foreground'>Medium</p>
        <div className='flex flex-wrap gap-3'>
          <Chip color='primary' variant='filled' disabled onDelete={() => undefined}>
            Filled
          </Chip>
          <Chip
            color='primary'
            variant='outlined'
            disabled
            onDelete={() => undefined}
          >
            Outlined
          </Chip>
          <Chip color='primary' variant='soft' disabled onDelete={() => undefined}>
            Soft
          </Chip>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Chip
            color='primary'
            variant='filled'
            disabled
            startIcon={<Sparkles aria-hidden='true' />}
            onDelete={() => undefined}
          >
            Filled Icon
          </Chip>
          <Chip
            color='primary'
            variant='outlined'
            disabled
            startIcon={<Sparkles aria-hidden='true' />}
            onDelete={() => undefined}
          >
            Outlined Icon
          </Chip>
          <Chip
            color='primary'
            variant='soft'
            disabled
            startIcon={<Sparkles aria-hidden='true' />}
            onDelete={() => undefined}
          >
            Soft Icon
          </Chip>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <p className='text-sm font-medium text-muted-foreground'>Small</p>
        <div className='flex flex-wrap gap-3'>
          <Chip
            color='primary'
            size='s'
            variant='filled'
            disabled
            onDelete={() => undefined}
          >
            Filled
          </Chip>
          <Chip
            color='primary'
            size='s'
            variant='outlined'
            disabled
            onDelete={() => undefined}
          >
            Outlined
          </Chip>
          <Chip
            color='primary'
            size='s'
            variant='soft'
            disabled
            onDelete={() => undefined}
          >
            Soft
          </Chip>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Chip
            color='primary'
            size='s'
            variant='filled'
            disabled
            startIcon={<Sparkles aria-hidden='true' />}
            onDelete={() => undefined}
          >
            Filled Icon
          </Chip>
          <Chip
            color='primary'
            size='s'
            variant='outlined'
            disabled
            startIcon={<Sparkles aria-hidden='true' />}
            onDelete={() => undefined}
          >
            Outlined Icon
          </Chip>
          <Chip
            color='primary'
            size='s'
            variant='soft'
            disabled
            startIcon={<Sparkles aria-hidden='true' />}
            onDelete={() => undefined}
          >
            Soft Icon
          </Chip>
        </div>
      </div>
    </div>
  ),
};
