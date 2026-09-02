import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldLabel } from '@/ui/components/FieldLabel';

const meta = {
  id: 'components-fieldlabel',
  title: 'Components/Forms/Field Helpers/FieldLabel',
  component: FieldLabel,
  tags: ['autodocs'],
  args: {
    as: 'label',
    children: 'Field label',
    htmlFor: 'field-label-story-input',
  },
  render: (args) => (
    <div>
      <FieldLabel {...args} />
      <input
        className="sr-only"
        id="field-label-story-input"
        type="text"
      />
    </div>
  ),
} satisfies Meta<typeof FieldLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};
