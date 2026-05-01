import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleAlert,
  Eye,
  Heart,
  Info,
  Search,
  UserRound,
} from 'lucide-react';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import {
  TextField,
  type TextFieldProps,
  type TextFieldSize,
  type TextFieldVariant,
} from '@/ui/components/TextField';

const previewGridClassName = 'grid gap-8 md:grid-cols-2';
const previewColumnClassName = 'min-w-0';

const renderPair = ({
  filled,
  outlined,
}: {
  filled: TextFieldProps;
  outlined: TextFieldProps;
}) => (
  <div className={previewGridClassName}>
    <div className={previewColumnClassName}>
      <TextField {...outlined} />
    </div>
    <div className={previewColumnClassName}>
      <TextField {...filled} />
    </div>
  </div>
);

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Value',
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        variant: 'filled',
      },
      outlined: {
        ...args,
      },
    }),
};

export const WithAdornments: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'Value',
        endAdornment: (
          <IconButton aria-label="Reveal value" color="default" size="m">
            <Eye />
          </IconButton>
        ),
        startIcon: Search,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Value',
        endAdornment: (
          <IconButton aria-label="Reveal value" color="default" size="m">
            <Eye />
          </IconButton>
        ),
        startIcon: Search,
      },
    }),
};

export const Invalid: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'Incorrect',
        errorIcon: <CircleAlert aria-hidden="true" />,
        errorText: 'Caption text, description, notification',
        invalid: true,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Incorrect',
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
        defaultValue: 'Default value',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Default value',
        disabled: true,
        helperIcon: <Info aria-hidden="true" />,
        helperText: 'Helper text',
        label: 'Disabled',
        startIcon: UserRound,
      },
    }),
};

export const WithTextStartAndAction: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: '100',
        endAdornment: (
          <Button color="inherit" size="m" variant="contained">
            Action
          </Button>
        ),
        label: 'With normal TextField',
        startAdornment: 'Kg',
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: '100',
        endAdornment: (
          <Button color="inherit" size="m" variant="contained">
            Action
          </Button>
        ),
        label: 'With normal TextField',
        startAdornment: 'Kg',
      },
    }),
};

export const WithEndText: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        helperText: 'Weight',
        label: 'End adornment',
        endAdornment: 'Kg',
        placeholder: 'End adornment',
        variant: 'filled',
      },
      outlined: {
        ...args,
        helperText: 'Weight',
        label: 'End adornment',
        endAdornment: 'Kg',
        placeholder: 'End adornment',
      },
    }),
};

export const SmallSizes: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        placeholder: 'Small',
        size: 's',
        startIcon: Heart,
        variant: 'filled',
      },
      outlined: {
        ...args,
        placeholder: 'Small',
        size: 's',
        startIcon: Heart,
      },
    }),
};
