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
import { TextField } from '@/ui/components/TextField';

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

export const Default: Story = {};

export const WithAdornments: Story = {
  args: {
    defaultValue: 'Value',
    endAdornment: (
      <IconButton aria-label="Reveal value" color="default" size="m">
        <Eye />
      </IconButton>
    ),
    startIcon: Search,
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 'Incorrect',
    errorIcon: <CircleAlert aria-hidden="true" />,
    errorText: 'Caption text, description, notification',
    invalid: true,
  },
};

export const DisabledWithStartIconAndHelperText: Story = {
  args: {
    defaultValue: 'Default value',
    disabled: true,
    helperIcon: <Info aria-hidden="true" />,
    helperText: 'Helper text',
    label: 'Disabled',
    startIcon: UserRound,
  },
};

export const WithTextStartAndAction: Story = {
  args: {
    defaultValue: '100',
    endAdornment: (
      <Button color="inherit" size="m" variant="contained">
        Action
      </Button>
    ),
    label: 'With normal TextField',
    startAdornment: 'Kg',
  },
};

export const WithEndText: Story = {
  args: {
    helperText: 'Weight',
    label: 'End adornment',
    endAdornment: 'Kg',
    placeholder: 'End adornment',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small',
    size: 's',
    startIcon: Heart,
  },
};
