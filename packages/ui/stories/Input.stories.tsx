import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eye, Search } from 'lucide-react';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import { Input } from '@/ui/components/Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Input',
    placeholder: 'Value',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OutlinedDefault: Story = {};

export const FilledDefault: Story = {
  args: {
    variant: 'filled',
  },
};

export const OutlinedWithIconAdornments: Story = {
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

export const FilledWithIconAdornments: Story = {
  args: {
    defaultValue: 'Value',
    endAdornment: (
      <IconButton aria-label="Reveal value" color="default" size="m">
        <Eye />
      </IconButton>
    ),
    startIcon: Search,
    variant: 'filled',
  },
};

export const OutlinedWithTextAndAction: Story = {
  args: {
    defaultValue: '100',
    endAdornment: (
      <Button color="inherit" size="m" variant="contained">
        Action
      </Button>
    ),
    startAdornment: 'Kg',
  },
};

export const FilledWithTextAndAction: Story = {
  args: {
    defaultValue: '100',
    endAdornment: (
      <Button color="inherit" size="m" variant="contained">
        Action
      </Button>
    ),
    startAdornment: 'Kg',
    variant: 'filled',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    defaultValue: 'Disabled',
    disabled: true,
    startAdornment: 'Kg',
  },
};

export const FilledDisabled: Story = {
  args: {
    defaultValue: 'Disabled',
    disabled: true,
    variant: 'filled',
  },
};
