import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, type RadioColor, type RadioSize } from '@/ui/components/Radio';
import { RadioGroup } from '@/ui/components/RadioGroup';

const colors = [
  'default',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly RadioColor[];
const sizes = ['s', 'm'] satisfies readonly RadioSize[];

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {
    children: 'Email',
    color: 'primary',
    size: 'm',
    value: 'email',
  },
  decorators: [
    (Story) => (
      <RadioGroup defaultValue="email" label="Notification channel">
        <Story />
      </RadioGroup>
    ),
  ],
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <RadioGroup defaultValue="primary" label="Color">
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <Radio key={color} color={color} value={color}>
            {color}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  ),
  decorators: [],
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <RadioGroup defaultValue="checked" label="Enabled">
        <div className="flex flex-wrap gap-4">
          <Radio value="unchecked">Unchecked</Radio>
          <Radio value="checked">Checked</Radio>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="disabled-checked" label="Disabled">
        <div className="flex flex-wrap gap-4">
          <Radio disabled value="disabled">
            Disabled
          </Radio>
          <Radio disabled value="disabled-checked">
            Disabled checked
          </Radio>
        </div>
      </RadioGroup>
    </div>
  ),
  decorators: [],
};

export const Sizes: Story = {
  render: () => (
    <RadioGroup defaultValue="medium" label="Size">
      <div className="flex flex-wrap items-center gap-4">
        {sizes.map((size) => (
          <Radio
            key={size}
            size={size}
            value={size === 's' ? 'small' : 'medium'}
          >
            {size === 's' ? 'Small' : 'Medium'}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  ),
  decorators: [],
};
