import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxChip } from '@/ui/components/CheckboxChip';
import { CheckboxChipGroup } from '@/ui/components/CheckboxChipGroup';

const options = [
  { label: 'Ann Lee', value: 'ann' },
  { label: 'Brook Stone', value: 'brook' },
  { label: 'Drew Hall', value: 'drew' },
] as const;

const meta = {
  id: 'components-checkboxchipgroup',
  title: 'Components/Forms/Selection Controls/CheckboxChipGroup',
  component: CheckboxChipGroup,
  tags: ['autodocs'],
  args: {
    children: options.map((option) => (
      <CheckboxChip key={option.value} value={option.value}>
        {option.label}
      </CheckboxChip>
    )),
    label: 'Team members',
    orientation: 'vertical',
  },
} satisfies Meta<typeof CheckboxChipGroup>;

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
      <CheckboxChipGroup
        allValues={options.map((option) => option.value)}
        helperText="Use the parent chip checkbox to select or clear the whole set."
        label="Table selection"
        onValueChange={setValue}
        value={value}
      >
        <CheckboxChip parent>Select all members</CheckboxChip>
        {options.map((option) => (
          <CheckboxChip key={option.value} value={option.value}>
            {option.label}
          </CheckboxChip>
        ))}
      </CheckboxChipGroup>
    );
  },
};

export const WithMixedParentCheckbox: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([options[0].value]);

    return (
      <CheckboxChipGroup
        allValues={options.map((option) => option.value)}
        helperText="The parent chip shows a minus icon while the set is partially selected."
        label="Table selection"
        onValueChange={setValue}
        value={value}
      >
        <CheckboxChip parent>Select all members</CheckboxChip>
        {options.map((option) => (
          <CheckboxChip key={option.value} value={option.value}>
            {option.label}
          </CheckboxChip>
        ))}
      </CheckboxChipGroup>
    );
  },
};

export const ErrorState: Story = {
  args: {
    errorText: 'Choose at least one assignee.',
    invalid: true,
  },
};
