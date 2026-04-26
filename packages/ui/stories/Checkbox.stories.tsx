import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/ui/components/Checkbox';

const colors = [
  'default',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const;

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
      <Checkbox size='s'>Small</Checkbox>
      <Checkbox size='m'>Medium</Checkbox>
      <Checkbox size='s' defaultChecked>
        Small checked
      </Checkbox>
      <Checkbox size='m' defaultChecked>
        Medium checked
      </Checkbox>
    </div>
  ),
};
