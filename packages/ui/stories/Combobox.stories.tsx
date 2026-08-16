import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, Heart, Info, Search, UserRound } from 'lucide-react';
import {
  Combobox,
  type ComboboxMultipleProps,
  type ComboboxOption,
  type ComboboxProps,
  type ComboboxSingleProps,
} from '@/ui/components/Combobox';

const options = [
  { displayValue: 'JavaScript', label: 'JavaScript', value: 'javascript' },
  { displayValue: 'TypeScript', label: 'TypeScript', value: 'typescript' },
  { displayValue: 'Python', label: 'Python', value: 'python' },
  { displayValue: 'Ruby', label: 'Ruby', value: 'ruby' },
  { displayValue: 'Go', label: 'Go', value: 'go' },
  { displayValue: 'Rust', label: 'Rust', value: 'rust' },
] satisfies readonly ComboboxOption[];

const previewGridClassName = 'grid gap-8 md:grid-cols-2';
const previewColumnClassName = 'min-w-0';

const renderPair = ({
  filled,
  outlined,
}: {
  filled: ComboboxSingleProps;
  outlined: ComboboxSingleProps;
}) => (
  <div className={previewGridClassName}>
    <div className={previewColumnClassName}>
      <Combobox {...outlined} />
    </div>
    <div className={previewColumnClassName}>
      <Combobox {...filled} />
    </div>
  </div>
);

const getSingleComboboxArgs = ({
  defaultValue: _defaultValue,
  multiple: _multiple,
  onValueChange: _onValueChange,
  value: _value,
  ...args
}: ComboboxProps): Omit<
  ComboboxSingleProps,
  'defaultValue' | 'multiple' | 'onValueChange' | 'value'
> => args;

const getMultipleComboboxArgs = ({
  defaultValue: _defaultValue,
  multiple: _multiple,
  onValueChange: _onValueChange,
  value: _value,
  ...args
}: ComboboxProps): Omit<
  ComboboxMultipleProps,
  'defaultValue' | 'multiple' | 'onValueChange' | 'value'
> => args;

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: 'Language',
    options,
    placeholder: 'Search language',
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const singleArgs = getSingleComboboxArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'typescript',
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'typescript',
      },
    });
  },
};

export const Multiple: Story = {
  render: (args) => {
    const multipleArgs = getMultipleComboboxArgs(args);

    return (
      <div className={previewGridClassName}>
        <div className={previewColumnClassName}>
          <Combobox
            {...multipleArgs}
            defaultValue={['javascript', 'typescript']}
            multiple={true}
          />
        </div>
        <div className={previewColumnClassName}>
          <Combobox
            {...multipleArgs}
            defaultValue={['javascript', 'typescript']}
            multiple={true}
            variant="filled"
          />
        </div>
      </div>
    );
  },
};

export const Loading: Story = {
  render: (args) => {
    const singleArgs = getSingleComboboxArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        loading: true,
        loadingText: 'Loading languages',
        options: [],
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        loading: true,
        loadingText: 'Loading languages',
        options: [],
      },
    });
  },
};

export const Empty: Story = {
  render: (args) => {
    const singleArgs = getSingleComboboxArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        emptyText: 'No languages found',
        options: [],
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        emptyText: 'No languages found',
        options: [],
      },
    });
  },
};

export const Invalid: Story = {
  render: (args) => {
    const singleArgs = getSingleComboboxArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        errorIcon: <CircleAlert aria-hidden="true" />,
        errorText: 'Select at least one language',
        invalid: true,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        errorIcon: <CircleAlert aria-hidden="true" />,
        errorText: 'Select at least one language',
        invalid: true,
      },
    });
  },
};

export const DisabledWithStartIconAndHelperText: Story = {
  render: (args) => {
    const singleArgs = getSingleComboboxArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'python',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'python',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
      },
    });
  },
};

export const WithIconAdornment: Story = {
  render: (args) => {
    const singleArgs = getSingleComboboxArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'rust',
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Start typing to filter options',
        startIcon: Search,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'rust',
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Start typing to filter options',
        startIcon: Search,
      },
    });
  },
};

export const SmallSizes: Story = {
  render: (args) => {
    const singleArgs = getSingleComboboxArgs(args);

    return renderPair({
      filled: {
        ...singleArgs,
        defaultValue: 'go',
        size: 's',
        startIcon: Heart,
        variant: 'filled',
      },
      outlined: {
        ...singleArgs,
        defaultValue: 'go',
        size: 's',
        startIcon: Heart,
      },
    });
  },
};
