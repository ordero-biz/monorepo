import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { NumericField } from './NumericField';
import type { NumericFieldProps } from './types';

describe('NumericField', () => {
  const { setup } = prepareSetup<NumericFieldProps>({
    component: NumericField,
    props: {
      label: 'Amount',
      onValueChange: vi.fn(),
      placeholder: '0.00',
    },
  });

  it('renders an accessible text input with a numeric default value', () => {
    const { label } = setup({
      defaultValue: 100.23,
      label: 'Price',
      startAdornment: '$',
    });

    const input = screen.getByRole('textbox', { name: label });

    expect(input).toHaveDisplayValue('100.23');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it.each([
    { defaultValue: 1e-7, displayValue: '0.0000001' },
    { defaultValue: 1e21, displayValue: '1,000,000,000,000,000,000,000' },
    { defaultValue: -12, displayValue: '' },
    { defaultValue: Infinity, displayValue: '' },
  ])('displays a numeric default value of $defaultValue as $displayValue', ({
    defaultValue,
    displayValue,
  }) => {
    const { label } = setup({
      defaultValue,
      label: 'Amount',
    });

    expect(screen.getByRole('textbox', { name: label })).toHaveDisplayValue(
      displayValue
    );
  });

  it('honors an explicit keyboard hint', () => {
    const { inputMode, label } = setup({ inputMode: 'text', label: 'Amount' });

    expect(screen.getByRole('textbox', { name: label })).toHaveAttribute(
      'inputmode',
      inputMode
    );
  });

  it('ignores letters typed into the number field', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      label: 'Amount',
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12x');

    expect(input).toHaveDisplayValue('12');
    expect(input).toBeValid();
    expect(onValueChange).toHaveBeenLastCalledWith(12, expect.any(Object));

    await user.type(input, '.5');

    expect(input).toBeValid();
    expect(onValueChange).toHaveBeenLastCalledWith(12.5, expect.any(Object));
  });

  it('keeps the decimal comma while editing in German', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      label: 'Amount',
      locale: 'de-DE',
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12,34');

    expect(input).toHaveDisplayValue('12,34');
    expect(onValueChange).toHaveBeenLastCalledWith(12.34, expect.any(Object));
  });

  it('marks excess fractional digits invalid until corrected', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      label: 'Amount',
      maxFractionDigits: 2,
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12.345');

    expect(input).toHaveDisplayValue('12.345');
    expect(input).toBeInvalid();
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(onValueChange).toHaveBeenLastCalledWith(12.34, expect.any(Object));

    await user.keyboard('{Backspace}');

    expect(input).toBeValid();
    expect(input).toHaveDisplayValue('12.34');
  });

  it('uses integer-only input mode when fraction digits are disabled', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      label: 'Quantity',
      maxFractionDigits: 0,
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12.34');

    expect(input).toHaveDisplayValue('12.34');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toBeInvalid();
    expect(onValueChange).toHaveBeenLastCalledWith(12, expect.any(Object));

    await user.keyboard('{Backspace}{Backspace}');
    await user.tab();

    expect(input).toHaveDisplayValue('12');
  });

  it.each([
    { locale: 'en-US', pastedValue: '12.34' },
    { locale: 'de-DE', pastedValue: '12,34' },
  ])('rejects decimal paste in integer mode for $locale', async ({
    locale,
    pastedValue,
  }) => {
    const user = userEvent.setup();
    const { label, onValueChange } = setup({
      label: 'Quantity',
      locale,
      maxFractionDigits: 0,
      onValueChange: vi.fn(),
    });
    const input = screen.getByRole('textbox', { name: label });

    await user.click(input);
    await user.paste(pastedValue);
    await user.tab();

    expect(input).toHaveDisplayValue('');
    expect(input).toBeInvalid();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.type(input, '12');

    expect(input).toBeValid();
    expect(onValueChange).toHaveBeenLastCalledWith(12, expect.any(Object));
  });

  it('blocks Enter submission until a required draft contains a number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onValueChange = vi.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget).get('amount'));
        }}
      >
        <NumericField
          label="Amount"
          name="amount"
          onValueChange={onValueChange}
          required
        />
        <button type="submit">Save</button>
      </form>
    );

    const input = screen.getByRole('textbox', { name: 'Amount' });
    await user.type(input, '.{Enter}');

    expect(input).toHaveDisplayValue('.');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(input, '5{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith(0.5, expect.any(Object));
    expect(onSubmit).toHaveBeenCalledWith('0.5');
  });

  it.each([
    { locale: 'en-US', formatted: '1,234.56' },
    { locale: 'de-DE', formatted: '1.234,56' },
    { locale: 'fr-FR', formatted: '1\u202f234,56' },
    { locale: 'ar-EG', formatted: '١٬٢٣٤٫٥٦' },
    { locale: 'en-IN', formatted: '1,23,456.78' },
  ])('round-trips grouped input in $locale', async ({ locale, formatted }) => {
    const user = userEvent.setup();
    const { label, onValueChange } = setup({
      label: 'Amount',
      locale,
      onValueChange: vi.fn(),
    });
    const input = screen.getByRole('textbox', { name: label });

    await user.click(input);
    await user.paste(formatted);
    await user.tab();

    expect(input).toHaveDisplayValue(formatted);
    expect(onValueChange).toHaveBeenLastCalledWith(
      locale === 'en-IN' ? 123456.78 : 1234.56,
      expect.any(Object)
    );
  });

  it('uses the surrounding language and submits a canonical decimal', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <form
        lang="de-DE"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget).getAll('amount'));
        }}
      >
        <NumericField defaultValue={1234.56} label="Amount" name="amount" />
        <button type="submit">Save</button>
      </form>
    );
    const input = screen.getByRole('textbox', { name: 'Amount' });
    expect(input).toHaveDisplayValue('1.234,56');

    await user.clear(input);
    await user.paste('1,234.56');
    expect(input).toBeInvalid();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();

    await user.clear(input);
    await user.paste('1.234,56');
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith(['1234.56']);
  });

  it('keeps an out-of-precision controlled value visible and blocks submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const Form = ({ maxFractionDigits }: { maxFractionDigits: number }) => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget).get('amount'));
        }}
      >
        <NumericField
          label="Amount"
          maxFractionDigits={maxFractionDigits}
          name="amount"
          value={12.34}
        />
        <button type="submit">Save</button>
      </form>
    );
    const { rerender } = render(<Form maxFractionDigits={0} />);

    const input = screen.getByRole('textbox', { name: 'Amount' });
    const save = screen.getByRole('button', { name: 'Save' });

    expect(input).toHaveDisplayValue('12.34');
    expect(input).toHaveAccessibleDescription(
      'Enter a number with fewer decimal places.'
    );
    await user.click(save);
    expect(onSubmit).not.toHaveBeenCalled();

    rerender(<Form maxFractionDigits={2} />);

    expect(input).toBeValid();
    await user.click(save);
    expect(onSubmit).toHaveBeenCalledWith('12.34');
  });

  it('supports negative values when enabled', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      allowNegative: true,
      label: 'Adjustment',
      maxFractionDigits: 2,
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '-12.3');

    expect(input).toHaveDisplayValue('-12.3');
    expect(onValueChange).toHaveBeenLastCalledWith(-12.3, expect.any(Object));
  });

  it('normalizes trailing decimal separators on blur', async () => {
    const user = userEvent.setup();
    const label = 'Amount';

    render(
      <>
        <NumericField label={label} placeholder="0.00" />
        <button type="button">Next focus target</button>
      </>
    );

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12.');
    await user.tab();

    expect(input).toHaveDisplayValue('12');
    expect(
      screen.getByRole('button', { name: 'Next focus target' })
    ).toHaveFocus();
  });

  it('keeps intermediate decimal input visible in controlled usage', async () => {
    const user = userEvent.setup();

    const ControlledNumericField = () => {
      const [value, setValue] = useState<number | undefined>(1);

      return (
        <NumericField
          label="Amount"
          maxFractionDigits={2}
          onValueChange={setValue}
          value={value}
        />
      );
    };

    render(<ControlledNumericField />);

    const input = screen.getByRole('textbox', { name: 'Amount' });

    await user.type(input, '2.');

    expect(input).toHaveDisplayValue('12.');

    await user.clear(input);
    await user.type(input, '.5');

    expect(input).toHaveDisplayValue('.5');

    await user.tab();

    expect(input).toHaveDisplayValue('0.5');
  });

  it('blocks a controlled draft that the parent declines', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <NumericField
          label="Amount"
          name="amount"
          onValueChange={onValueChange}
          value={12}
        />
        <button type="submit">Save</button>
      </form>
    );
    const input = screen.getByRole('textbox', { name: 'Amount' });

    await user.type(input, '3');

    expect(onValueChange).toHaveBeenLastCalledWith(123, expect.any(Object));
    expect(input).toHaveDisplayValue('123');
    expect(input).toBeInvalid();

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('emits undefined when the field is cleared', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      defaultValue: 100.23,
      label: 'Amount',
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.clear(input);

    expect(input).toHaveDisplayValue('');
    expect(onValueChange).toHaveBeenLastCalledWith(
      undefined,
      expect.any(Object)
    );
  });
});
