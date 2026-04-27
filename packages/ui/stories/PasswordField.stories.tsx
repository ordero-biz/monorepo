import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordField } from '@/ui/components/PasswordField';

const meta = {
  title: 'Components/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  args: {
    label: 'Password',
    placeholder: '6+ characters',
  },
} satisfies Meta<typeof PasswordField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    errorText: 'Password must contain at least 6 characters.',
    invalid: true,
  },
};

export const VisibleByDefault: Story = {
  args: {
    defaultVisible: true,
    value: 'correct horse battery staple',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Use at least 12 characters for a stronger password.',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'correct horse battery staple',
    disabled: true,
    helperText: 'Password editing is unavailable in this state.',
  },
};
