import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, format, startOfDay } from 'date-fns';
import { Info } from 'lucide-react';
import { DatePicker } from './DatePicker';
import type { DatePickerProps } from './types';

describe('DatePicker', () => {
  const { setup } = prepareSetup<DatePickerProps>({
    component: DatePicker,
    props: {
      'aria-label': 'Date',
      placeholder: 'Pick a date',
    },
  });

  it('renders a selected single date', () => {
    const { 'aria-label': ariaLabel } = setup({
      defaultValue: new Date(2026, 0, 20),
    });

    expect(screen.getByRole('button', { name: ariaLabel })).toHaveTextContent(
      'January 20th, 2026'
    );
  });

  it('opens the calendar and calls onValueChange for a single date', async () => {
    const user = userEvent.setup();

    const { 'aria-label': ariaLabel, onValueChange } = setup({
      defaultMonth: new Date(2026, 0, 1),
      onValueChange: vi.fn(),
    });

    await user.click(screen.getByRole('button', { name: ariaLabel }));
    await user.click(screen.getByRole('button', { name: /January 15th, 2026/i }));

    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 15));
  });

  it('disables dates before today when disablePastDates is enabled', async () => {
    const user = userEvent.setup();
    const today = startOfDay(new Date());
    const yesterday = addDays(today, -1);

    const { 'aria-label': ariaLabel } = setup({
      defaultMonth: today,
      disablePastDates: true,
    });

    await user.click(screen.getByRole('button', { name: ariaLabel }));

    expect(
      screen.getByRole('button', {
        name: new RegExp(format(yesterday, 'MMMM do, yyyy'), 'i'),
      })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', {
        name: new RegExp(format(today, 'MMMM do, yyyy'), 'i'),
      })
    ).toBeEnabled();
  });

  it('supports changing the displayed month from dropdown captions', async () => {
    const user = userEvent.setup();

    const { 'aria-label': ariaLabel } = setup({
      captionLayout: 'dropdown',
      defaultMonth: new Date(2026, 0, 1),
      endMonth: new Date(2026, 11, 1),
      startMonth: new Date(2025, 0, 1),
    });

    await user.click(screen.getByRole('button', { name: ariaLabel }));
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Choose the Month' }),
      '5'
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Choose the Year' }),
      '2025'
    );

    expect(
      screen.getByRole('button', { name: /June 1st, 2025/i })
    ).toBeInTheDocument();
  });

  it('renders a selected date range', () => {
    const { 'aria-label': ariaLabel } = setup({
      defaultValue: {
        from: new Date(2026, 0, 20),
        to: new Date(2026, 1, 9),
      },
      mode: 'range',
    });

    expect(screen.getByRole('button', { name: ariaLabel })).toHaveTextContent(
      'Jan 20, 2026 - Feb 09, 2026'
    );
  });

  it('renders helper and error text', () => {
    const { errorText } = setup({
      errorText: 'Date is required',
      helperIcon: <Info aria-hidden="true" />,
      helperText: 'Choose a delivery date',
      invalid: true,
      label: 'Delivery date',
    });

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });
});
