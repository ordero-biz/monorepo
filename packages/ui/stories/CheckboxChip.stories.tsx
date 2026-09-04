import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CheckboxChip,
  type CheckboxChipColor,
  type CheckboxChipSize,
} from '@/ui/components/CheckboxChip';

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly CheckboxChipColor[];
const sizes = ['s', 'm'] satisfies readonly CheckboxChipSize[];

const meta = {
  id: 'components-checkboxchip',
  title: 'Components/Forms/Selection Controls/CheckboxChip',
  component: CheckboxChip,
  tags: ['autodocs'],
  args: {
    children: 'Pending',
    color: 'primary',
    size: 'm',
  },
} satisfies Meta<typeof CheckboxChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <CheckboxChip>Unchecked</CheckboxChip>
      <CheckboxChip defaultChecked>Checked</CheckboxChip>
      <CheckboxChip indeterminate>Mixed</CheckboxChip>
      <CheckboxChip disabled>Disabled</CheckboxChip>
      <CheckboxChip indeterminate disabled>
        Disabled mixed
      </CheckboxChip>
      <CheckboxChip defaultChecked disabled>
        Disabled checked
      </CheckboxChip>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <CheckboxChip key={`unchecked-${color}`} color={color}>
            {color}
          </CheckboxChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <CheckboxChip key={`checked-${color}`} color={color} defaultChecked>
            {color}
          </CheckboxChip>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <CheckboxChip key={size} size={size}>
          {size === 's' ? 'Small' : 'Medium'}
        </CheckboxChip>
      ))}
      {sizes.map((size) => (
        <CheckboxChip key={`${size}-checked`} size={size} defaultChecked>
          {size === 's' ? 'Small checked' : 'Medium checked'}
        </CheckboxChip>
      ))}
    </div>
  ),
};
