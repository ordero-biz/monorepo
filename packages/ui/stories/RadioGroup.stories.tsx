import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '@/ui/components/Radio';
import { RadioGroup } from '@/ui/components/RadioGroup';

const options = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' },
] as const;

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    children: options.map((option) => (
      <Radio key={option.value} value={option.value}>
        {option.label}
      </Radio>
    )),
    label: 'Notification channel',
    orientation: 'vertical',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: 'Choose where order updates should be sent.',
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const ErrorState: Story = {
  args: {
    errorText: 'Choose one notification channel.',
    invalid: true,
  },
};
