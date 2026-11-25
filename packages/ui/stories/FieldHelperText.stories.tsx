import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';
import { FieldHelperText } from '@/ui/components/FieldHelperText';

const meta = {
  title: 'Components/FieldHelperText',
  component: FieldHelperText,
  tags: ['autodocs'],
  args: {
    children: 'Supporting text for a form control.',
  },
} satisfies Meta<typeof FieldHelperText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: <Info aria-hidden="true" />,
  },
};

export const Error: Story = {
  args: {
    children: 'This field is required.',
    invalid: true,
  },
};
