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

  it('sanitizes typed content to digits and a single decimal separator', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      label: 'Amount',
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12ab.34.5');

    expect(input).toHaveDisplayValue('12.345');
    expect(onValueChange).toHaveBeenLastCalledWith(12.345, expect.any(Object));
  });

  it('normalizes commas to dots immediately while typing', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      label: 'Amount',
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12,34');

    expect(input).toHaveDisplayValue('12.34');
    expect(onValueChange).toHaveBeenLastCalledWith(12.34, expect.any(Object));
  });

  it('limits the number of digits after the decimal point', async () => {
    const user = userEvent.setup();

    const { label, onValueChange } = setup({
      label: 'Amount',
      maxFractionDigits: 2,
      onValueChange: vi.fn(),
    });

    const input = screen.getByRole('textbox', { name: label });

    await user.type(input, '12.345');

    expect(input).toHaveDisplayValue('12.34');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(onValueChange).toHaveBeenLastCalledWith(12.34, expect.any(Object));
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

    expect(input).toHaveDisplayValue('1234');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(onValueChange).toHaveBeenLastCalledWith(1234, expect.any(Object));
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
    expect(screen.getByRole('button', { name: 'Next focus target' })).toHaveFocus();
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
    expect(onValueChange).toHaveBeenLastCalledWith(undefined, expect.any(Object));
  });
});
