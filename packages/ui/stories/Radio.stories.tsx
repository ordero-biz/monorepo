import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import {
  Radio,
  type RadioAlignment,
  type RadioColor,
  type RadioSize,
} from '@/ui/components/Radio';
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
const alignments = ['start', 'center', 'end'] satisfies readonly RadioAlignment[];

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

export const LabelAlignments: Story = {
  render: () => (
    <RadioGroup defaultValue="center" label="Label alignment">
      <div className="flex flex-col gap-4">
        {alignments.map((align) => (
          <Radio align={align} key={align} value={align}>
            {`${align[0].toUpperCase()}${align.slice(1)} aligned label that wraps onto a second line.`}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  ),
  decorators: [],
};

export const StartAlignedLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {sizes.map((size) => (
        <RadioGroup key={size} defaultValue="multiple" label={`Size ${size}`}>
          <Radio size={size} value="reference">
            Centered reference
          </Radio>
          <Radio align="start" size={size} value="single">
            <span className="block">Single line</span>
          </Radio>
          <Radio align="start" size={size} value="multiple">
            <span className="block">Multiple lines</span>
            <span className="block">Rice, quantity: 2, unit: bag</span>
            <span className="block">Oats, quantity: 3, unit: bag</span>
          </Radio>
        </RadioGroup>
      ))}
    </div>
  ),
  decorators: [],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const size of sizes) {
      const group = within(
        canvas.getByRole('radiogroup', { name: `Size ${size}` })
      );
      const reference = group.getByRole('radio', { name: 'Centered reference' });
      for (const name of ['Single line', 'Multiple lines']) {
        const radio = group.getByRole('radio', { name: new RegExp(`^${name}`) });
        const firstLine = group.getByText(name, { exact: true });
        await waitFor(async () => {
          const control = radio.getBoundingClientRect();
          const line = firstLine.getBoundingClientRect();
          const centered = reference.getBoundingClientRect();
          await expect(
            Math.abs(
              control.top + control.height / 2 - line.top - line.height / 2
            )
          ).toBeLessThan(1);
          await expect(control.height).toBe(centered.height);
          await expect(control.width).toBe(centered.width);
        });
      }
    }
  },
};
