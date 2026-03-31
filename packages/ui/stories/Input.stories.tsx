import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/ui/components/Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type here...',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Error: Story = {
  args: {
    'aria-invalid': true,
    placeholder: 'Invalid value',
  },
};
