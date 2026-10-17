import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info, Search, UserRound } from 'lucide-react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Combobox } from '@/ui/components/Combobox';

type Supplier = { id: number; name: string; status: 'ACTIVE' | 'DRAFT' };
const options: Supplier[] = [
  { id: 1, name: 'Coffee Import UA', status: 'ACTIVE' },
  { id: 2, name: 'New supplier', status: 'DRAFT' },
];
const meta = {
  title: 'Components/Combobox',
  component: Combobox<Supplier>,
  tags: ['autodocs'],
  args: {
    label: 'Supplier',
    options,
    getOptionValue: (supplier: Supplier) => String(supplier.id),
    getOptionLabel: (supplier: Supplier) => supplier.name,
    placeholder: 'Select supplier',
  },
} satisfies Meta<typeof Combobox<Supplier>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Supplier' });
    await userEvent.click(input);
    await within(document.body).findByRole('option', { name: 'Coffee Import UA' });
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Coffee Import UA');
  },
};

export const BeforeOptionsLoad: Story = {
  args: { options: [], defaultValue: options[0], helperText: 'The selected record is independent of the loaded list.' },
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: [options[0]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Supplier' }));
    await userEvent.click(await within(document.body).findByRole('option', { name: 'New supplier' }));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('button', { name: 'Remove Coffee Import UA' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Remove New supplier' })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { defaultValue: options[0], disabled: true },
};

export const DisabledWithStartIconAndHelperText: Story = {
  args: {
    defaultValue: options[0],
    disabled: true,
    helperIcon: <Info aria-hidden="true" />,
    helperText: 'Supplier cannot be changed',
    startIcon: UserRound,
  },
};

export const WithIconAdornment: Story = {
  args: {
    helperIcon: <Info aria-hidden="true" />,
    helperText: 'Start typing to filter suppliers',
    startIcon: Search,
  },
};

export const SmallOutlined: Story = {
  args: { size: 's', defaultValue: options[0], startIcon: Search },
};

export const ReadOnly: Story = {
  args: { multiple: true, defaultValue: options, readOnly: true },
};

export const Invalid: Story = {
  args: { invalid: true, required: true, errorText: 'Select an active supplier' },
};

export const Filled: Story = {
  args: { variant: 'filled', size: 's', defaultValue: options[0] },
};

export const RichOptions: Story = {
  args: {
    defaultOpen: true,
    renderOption: (supplier: Supplier) => (
      <span>{supplier.name}{supplier.status === 'DRAFT' ? ' (Draft)' : ''}</span>
    ),
  },
};

export const RichChips: Story = {
  args: {
    multiple: true,
    defaultValue: options,
    renderOption: (supplier: Supplier) => (
      <span>{supplier.name}{supplier.status === 'DRAFT' ? ' (Draft)' : ''}</span>
    ),
  },
};

export const ReadOnlyRichChips: Story = {
  args: { ...RichChips.args, readOnly: true },
};

export const Loading: Story = {
  args: { options: [], loading: true, loadingText: 'Loading suppliers', defaultOpen: true },
  play: async () => {
    await expect(await within(document.body).findByText('Loading suppliers')).toBeVisible();
  },
};

export const Empty: Story = {
  args: { options: [], emptyText: 'No suppliers found', defaultOpen: true },
  play: async () => {
    await expect(await within(document.body).findByText('No suppliers found')).toBeVisible();
  },
};

export const SearchWithHelperText: Story = {
  args: { helperText: 'Search suppliers by name', required: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', {name: 'Supplier'});
    await expect(input).toBeRequired();
    await expect(input).toHaveAccessibleDescription('Search suppliers by name');
    await userEvent.type(input, 'New');
    await expect(await within(document.body).findByRole('option', {name: 'New supplier'})).toBeVisible();
    await expect(within(document.body).queryByRole('option', {name: 'Coffee Import UA'})).not.toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('New supplier');
  },
};

export const RefreshedSelection: Story = {
  render: (args) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <Combobox<Supplier>
        label={args.label}
        getOptionValue={args.getOptionValue}
        getOptionLabel={args.getOptionLabel}
        defaultValue={options[0]}
        options={loaded ? [{...options[0], name: 'Renamed supplier'}, options[1]] : []}
        onOpenChange={(open) => { if (open) setLoaded(true); }}
      />
    );
  },
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox', {name: 'Supplier'});
    await userEvent.click(input);
    await expect(await within(document.body).findByRole('option', {name: 'Renamed supplier'})).toBeVisible();
    await expect(await within(document.body).findByRole('option', {name: 'New supplier'})).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, 'New');
    await expect(within(document.body).queryByRole('option', {name: 'Renamed supplier'})).not.toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('New supplier');
  },
};
