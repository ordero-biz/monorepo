import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, Heart, Info, UserRound } from 'lucide-react';
import {
  Select,
  type SelectOption,
  type SelectProps,
  type SelectSize,
  type SelectVariant,
} from '@/ui/components/Select';

const options = [
  { label: 'List', value: 'list' },
  { label: 'Details', value: 'details' },
  { label: 'Create', value: 'create' },
  { label: 'Edit', value: 'edit' },
] satisfies readonly SelectOption[];

const previewGridClassName = 'grid gap-8 md:grid-cols-2';
const previewColumnClassName = 'min-w-0';

const renderPair = ({
  filled,
  outlined,
}: {
  filled: SelectProps;
  outlined: SelectProps;
}) => (
  <div className={previewGridClassName}>
    <div className={previewColumnClassName}>
      <Select {...outlined} />
    </div>
    <div className={previewColumnClassName}>
      <Select {...filled} />
    </div>
  </div>
);

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    options,
    placeholder: 'Label',
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'list',
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'list',
      },
    }),
};

export const Invalid: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'create',
        errorIcon: <CircleAlert aria-hidden="true" />,
        errorText: 'Caption text, description, notification',
        invalid: true,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'create',
        errorIcon: <CircleAlert aria-hidden="true" />,
        errorText: 'Caption text, description, notification',
        invalid: true,
      },
    }),
};

export const DisabledWithStartIconAndHelperText: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'details',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'details',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
      },
    }),
};

export const WithTextStart: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'details',
        label: 'Currency',
        startAdornment: '$',
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'details',
        label: 'Currency',
        startAdornment: '$',
      },
    }),
};

export const WithIconAdornment: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'edit',
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Caption text, description, notification',
        startIcon: Heart,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'edit',
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Caption text, description, notification',
        startIcon: Heart,
      },
    }),
};

export const SmallSizes: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'edit',
        size: 's',
        startIcon: Heart,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'edit',
        size: 's',
        startIcon: Heart,
      },
    }),
};
