import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from '@/ui/components/Checkbox';
import { CheckboxGroup } from '@/ui/components/CheckboxGroup';

const options = [
  { label: 'Ann Lee', value: 'ann' },
  { label: 'Brook Stone', value: 'brook' },
  { label: 'Drew Hall', value: 'drew' },
] as const;

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  args: {
    children: options.map((option) => (
      <Checkbox key={option.value} value={option.value}>
        {option.label}
      </Checkbox>
    )),
    label: 'Team members',
    orientation: 'vertical',
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: 'Pick every person who should receive list notifications.',
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const WithParentCheckbox: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <CheckboxGroup
        allValues={options.map((option) => option.value)}
        helperText='Use the parent checkbox to select or clear the whole set.'
        label='Table selection'
        onValueChange={setValue}
        value={value}
      >
        <Checkbox parent>Select all members</Checkbox>
        {options.map((option) => (
          <Checkbox key={option.value} value={option.value}>
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    );
  },
};

export const ErrorState: Story = {
  args: {
    errorText: 'Choose at least one assignee.',
    invalid: true,
  },
};
