import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, Info } from 'lucide-react';
import {
  NumericField,
  type NumericFieldProps,
} from '@/ui/components/NumericField';
import type { TextFieldVariant } from '@/ui/components/TextField';

const previewGridClassName = 'grid gap-8 md:grid-cols-2';
const previewColumnClassName = 'min-w-0';
const previewVariants = ['outlined', 'filled'] satisfies readonly TextFieldVariant[];

const renderVariantPair = (
  args: NumericFieldProps,
  getProps: (variant: TextFieldVariant) => NumericFieldProps
) => (
  <div className={previewGridClassName}>
    {previewVariants.map((variant) => (
      <div className={previewColumnClassName} key={variant}>
        <NumericField {...args} {...getProps(variant)} variant={variant} />
      </div>
    ))}
  </div>
);

const meta = {
  title: 'Components/NumericField',
  component: NumericField,
  tags: ['autodocs'],
  args: {
    label: 'Amount',
    placeholder: '0.00',
  },
} satisfies Meta<typeof NumericField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => renderVariantPair(args, () => ({})),
};

export const Currency: Story = {
  render: (args) =>
    renderVariantPair(args, () => ({
      defaultValue: 100.23,
      helperText: 'Two fractional digits are allowed.',
      maxFractionDigits: 2,
      startAdornment: '$',
    })),
};

export const Invalid: Story = {
  render: (args) =>
    renderVariantPair(args, () => ({
      defaultValue: 100.239,
      errorIcon: <CircleAlert aria-hidden="true" />,
      errorText: 'Use at most two digits after the decimal point.',
      invalid: true,
      maxFractionDigits: 2,
      startAdornment: '$',
    })),
};

export const Disabled: Story = {
  render: (args) =>
    renderVariantPair(args, () => ({
      defaultValue: 2500,
      disabled: true,
      helperIcon: <Info aria-hidden="true" />,
      helperText: 'Editing is unavailable in this state.',
      maxFractionDigits: 0,
      startAdornment: '$',
    })),
};
