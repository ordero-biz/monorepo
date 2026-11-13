import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, Info } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';
import {
  NumericField,
  type NumericFieldProps,
} from '@/ui/components/NumericField';
import type { TextFieldVariant } from '@/ui/components/TextField';

const previewGridClassName = 'grid gap-8 md:grid-cols-2';
const previewColumnClassName = 'min-w-0';
const previewVariants = ['outlined', 'filled'] satisfies readonly TextFieldVariant[];

const renderVariantPair = (
  args: NumericFieldProps,
  getProps: (variant: TextFieldVariant) => NumericFieldProps
) => (
  <div className={previewGridClassName}>
    {previewVariants.map((variant) => (
      <div className={previewColumnClassName} key={variant}>
        <NumericField {...args} {...getProps(variant)} variant={variant} />
      </div>
    ))}
  </div>
);

const meta = {
  title: 'Components/NumericField',
  component: NumericField,
  tags: ['autodocs'],
  args: {
    label: 'Amount',
    placeholder: '0.00',
  },
} satisfies Meta<typeof NumericField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => renderVariantPair(args, () => ({})),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox', {
      name: 'Amount',
    });

    for (const input of inputs) {
      await userEvent.click(input);
      await userEvent.paste('1\u202f234,56');
      await userEvent.tab();
      await expect(input).toHaveDisplayValue('1,234.56');
      await userEvent.click(input);
      await userEvent.paste('12 USD');
      await expect(input).toHaveAccessibleDescription(
        'The pasted text uses an unsupported number format. Enter a number like 1,234.56.'
      );
      await userEvent.clear(input);
      await expect(input).toHaveAccessibleDescription('');
      await userEvent.tab();
    }
  },
};

const foreignPasteExample = '1.234,56';
const invalidPasteExample = '12 USD';
const englishAmount = '1,234.56';

export const PasteFormats: Story = {
  args: {
    label: 'Amount (en-US)',
    locale: 'en-US',
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <p>Copy an example and paste it into the English number field.</p>
      <ul className="list-disc space-y-2 ps-5">
        <li>
          Paste <code>{foreignPasteExample}</code> and press Tab. The German
          number displays as <code>{englishAmount}</code>.
        </li>
        <li>
          Then paste <code>{invalidPasteExample}</code>. The field keeps its
          previous value and shows a message with the expected format.
        </li>
      </ul>
      <NumericField {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox');

    await userEvent.click(input);
    await userEvent.paste(foreignPasteExample);
    await userEvent.tab();
    await expect(input).toHaveDisplayValue(englishAmount);

    await userEvent.click(input);
    await userEvent.paste(invalidPasteExample);
    await expect(input).toHaveDisplayValue(englishAmount);
    await expect(input).toHaveAccessibleDescription(
      `The pasted text uses an unsupported number format. Enter a number like ${englishAmount}.`
    );

    await userEvent.clear(input);
    await userEvent.tab();
  },
};

export const Currency: Story = {
  render: (args) =>
    renderVariantPair(args, () => ({
      defaultValue: 100.23,
      helperText: 'Amounts are rounded to two decimal places.',
      maxFractionDigits: 2,
      startAdornment: '$',
    })),
};

export const Localized: Story = {
  render: (args) => (
    <div className={previewGridClassName}>
      <NumericField {...args} defaultValue={1234.56} label="German amount" locale="de-DE" />
      <NumericField {...args} defaultValue={1234.56} label="Arabic amount" locale="ar-EG" />
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) =>
    renderVariantPair(args, () => ({
      defaultValue: 100.23,
      errorIcon: <CircleAlert aria-hidden="true" />,
      errorText: 'Amount exceeds the available balance.',
      invalid: true,
      maxFractionDigits: 2,
      startAdornment: '$',
    })),
};

export const Disabled: Story = {
  render: (args) =>
    renderVariantPair(args, () => ({
      defaultValue: 2500,
      disabled: true,
      helperIcon: <Info aria-hidden="true" />,
      helperText: 'Editing is unavailable in this state.',
      maxFractionDigits: 0,
      startAdornment: '$',
    })),
};
