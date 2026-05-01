import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Checkbox,
  type CheckboxColor,
  type CheckboxSize,
} from '@/ui/components/Checkbox';

const colors = [
  'default',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly CheckboxColor[];
const sizes = ['s', 'm'] satisfies readonly CheckboxSize[];

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    children: 'Accept terms',
    color: 'primary',
    size: 'm',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {colors.map((color) => (
        <Checkbox key={color} color={color} defaultChecked>
          {color}
        </Checkbox>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox indeterminate>Indeterminate</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox indeterminate disabled>
        Disabled indeterminate
      </Checkbox>
      <Checkbox defaultChecked disabled>
        Disabled checked
      </Checkbox>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      {sizes.map((size) => (
        <Checkbox key={size} size={size}>
          {size === 's' ? 'Small' : 'Medium'}
        </Checkbox>
      ))}
      {sizes.map((size) => (
        <Checkbox key={`${size}-checked`} size={size} defaultChecked>
          {size === 's' ? 'Small checked' : 'Medium checked'}
        </Checkbox>
      ))}
    </div>
  ),
};
