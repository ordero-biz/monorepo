import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, Heart, Info, UserRound } from 'lucide-react';
import {
  Select,
  type SelectMultipleProps,
  type SelectOption,
  type SelectProps,
  type SelectSize,
  type SelectSingleProps,
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
  filled: SelectSingleProps;
  outlined: SelectSingleProps;
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

const getSingleSelectArgs = ({
  defaultValue: _defaultValue,
  multiple: _multiple,
  onValueChange: _onValueChange,
  value: _value,
  ...args
}: SelectProps): Omit<
  SelectSingleProps,
  'defaultValue' | 'multiple' | 'onValueChange' | 'value'
> => args;

const getMultipleSelectArgs = ({
  defaultValue: _defaultValue,
  multiple: _multiple,
  onValueChange: _onValueChange,
  value: _value,
  ...args
}: SelectProps): Omit<
  SelectMultipleProps,
  'defaultValue' | 'multiple' | 'onValueChange' | 'value'
> => args;

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
  render: (args) => {
    const singleArgs = getSingleSelectArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'list',
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'list',
      },
    });
  },
};

export const Invalid: Story = {
  render: (args) => {
    const singleArgs = getSingleSelectArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'create',
        errorIcon: <CircleAlert aria-hidden="true" />,
        errorText: 'Caption text, description, notification',
        invalid: true,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'create',
        errorIcon: <CircleAlert aria-hidden="true" />,
        errorText: 'Caption text, description, notification',
        invalid: true,
      },
    });
  },
};

export const DisabledWithStartIconAndHelperText: Story = {
  render: (args) => {
    const singleArgs = getSingleSelectArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'details',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'details',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
      },
    });
  },
};

export const WithTextStart: Story = {
  render: (args) => {
    const singleArgs = getSingleSelectArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'details',
        label: 'Currency',
        startAdornment: '$',
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'details',
        label: 'Currency',
        startAdornment: '$',
      },
    });
  },
};

export const WithIconAdornment: Story = {
  render: (args) => {
    const singleArgs = getSingleSelectArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'edit',
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Caption text, description, notification',
        startIcon: Heart,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'edit',
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Caption text, description, notification',
        startIcon: Heart,
      },
    });
  },
};

export const Multiple: Story = {
  render: (args) => {
    const multipleArgs = getMultipleSelectArgs(args);

    return (
      <div className={previewGridClassName}>
        <div className={previewColumnClassName}>
          <Select
            {...multipleArgs}
            defaultValue={['list', 'details']}
            multiple={true}
          />
        </div>
        <div className={previewColumnClassName}>
          <Select
            {...multipleArgs}
            defaultValue={['list', 'details']}
            multiple={true}
            variant="filled"
          />
        </div>
      </div>
    );
  },
};

export const SmallSizes: Story = {
  render: (args) => {
    const singleArgs = getSingleSelectArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'edit',
        size: 's',
        startIcon: Heart,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'edit',
        size: 's',
        startIcon: Heart,
      },
    });
  },
};

export const ContentWidth: Story = {
  render: (args) => {
    const singleArgs = getSingleSelectArgs(args);

    return (
      <Select
        {...singleArgs}
        aria-label="View mode"
        defaultValue="details"
        label={undefined}
        width="content"
      />
    );
  },
};
