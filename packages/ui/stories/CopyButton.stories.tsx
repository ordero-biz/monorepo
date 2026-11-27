import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CopyButton,
  type CopyButtonColor,
  type CopyButtonSize,
  type CopyButtonVariant,
} from '@/ui/components/CopyButton';

const colors = [
  'default',
  'inherit',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly CopyButtonColor[];

const sizes = ['l', 'm', 's', 'xs'] satisfies readonly CopyButtonSize[];
const variants = ['text', 'soft'] satisfies readonly CopyButtonVariant[];

const meta = {
  title: 'Components/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  args: {
    color: 'default',
    copiedLabel: 'Copied',
    copyLabel: 'Copy transfer number',
    size: 'm',
    value: 'TRF-COFFEE-002',
    variant: 'text',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CopiedByDefault: Story = {
  args: {
    defaultCopied: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <CopyButton
          {...args}
          key={size}
          copyLabel={`Copy ${size}`}
          size={size}
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {variants.map((variant) => (
        <CopyButton
          {...args}
          key={variant}
          copyLabel={`Copy ${variant}`}
          variant={variant}
        />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((color) => (
        <CopyButton
          {...args}
          key={color}
          color={color}
          copyLabel={`Copy ${color}`}
        />
      ))}
    </div>
  ),
};
