import type { Meta, StoryObj } from '@storybook/react-vite';
import { addDays } from 'date-fns';
import { CircleAlert, Info } from 'lucide-react';
import { useState } from 'react';
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRange,
  type DatePickerRangeProps,
  type DatePickerSingleProps,
} from '@/ui/components/DatePicker';

const StatefulSingleDatePicker = (props: DatePickerSingleProps) => {
  const [value, setValue] = useState(props.defaultValue);

  return <DatePicker {...props} value={value} onValueChange={setValue} />;
};

const StatefulRangeDatePicker = (props: DatePickerRangeProps) => {
  const [value, setValue] = useState<DatePickerRange | undefined>(
    props.defaultValue
  );

  return (
    <DatePicker
      {...props}
      mode="range"
      value={value}
      onValueChange={setValue}
    />
  );
};

const getSingleDatePickerArgs = ({
  defaultValue: _defaultValue,
  mode: _mode,
  onValueChange: _onValueChange,
  value: _value,
  ...args
}: DatePickerProps): Omit<
  DatePickerSingleProps,
  'defaultValue' | 'mode' | 'onValueChange' | 'value'
> => args;

const getRangeDatePickerArgs = ({
  defaultValue: _defaultValue,
  mode: _mode,
  onValueChange: _onValueChange,
  value: _value,
  ...args
}: DatePickerProps): Omit<
  DatePickerRangeProps,
  'defaultValue' | 'mode' | 'onValueChange' | 'value'
> => args;

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Date',
    placeholder: 'Pick a date',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const singleArgs = getSingleDatePickerArgs(args);

    return (
      <div className="max-w-[320px]">
        <StatefulSingleDatePicker
          {...singleArgs}
          defaultValue={new Date(2026, 0, 20)}
        />
      </div>
    );
  },
};

export const Range: Story = {
  render: (args) => {
    const rangeArgs = getRangeDatePickerArgs(args);

    return (
      <div className="max-w-[420px]">
        <StatefulRangeDatePicker
          {...rangeArgs}
          defaultValue={{
            from: new Date(2026, 0, 20),
            to: addDays(new Date(2026, 0, 20), 20),
          }}
          label="Date range"
          mode="range"
        />
      </div>
    );
  },
};

export const DateOfBirth: Story = {
  render: (args) => {
    const singleArgs = getSingleDatePickerArgs(args);

    return (
      <div className="max-w-[220px]">
        <StatefulSingleDatePicker
          {...singleArgs}
          captionLayout="dropdown"
          endMonth={new Date(2026, 11)}
          label="Date of birth"
          placeholder="Select date"
          startMonth={new Date(1926, 0)}
        />
      </div>
    );
  },
};

export const NoPastDates: Story = {
  render: (args) => {
    const singleArgs = getSingleDatePickerArgs(args);

    return (
      <div className="max-w-[320px]">
        <StatefulSingleDatePicker
          {...singleArgs}
          defaultMonth={new Date()}
          disablePastDates={true}
          label="Delivery date"
          placeholder="Select date"
        />
      </div>
    );
  },
};

export const Invalid: Story = {
  render: (args) => {
    const singleArgs = getSingleDatePickerArgs(args);

    return (
      <div className="max-w-[320px]">
        <StatefulSingleDatePicker
          {...singleArgs}
          errorIcon={<CircleAlert aria-hidden="true" />}
          errorText="Date is required"
          invalid={true}
        />
      </div>
    );
  },
};

export const DisabledWithHelperText: Story = {
  render: (args) => {
    const singleArgs = getSingleDatePickerArgs(args);

    return (
      <div className="max-w-[320px]">
        <StatefulSingleDatePicker
          {...singleArgs}
          defaultValue={new Date(2026, 0, 20)}
          disabled={true}
          helperIcon={<Info aria-hidden="true" />}
          helperText="Unavailable while order is locked"
          label="Disabled"
        />
      </div>
    );
  },
};

export const SmallSizes: Story = {
  render: (args) => {
    const singleArgs = getSingleDatePickerArgs(args);

    return (
      <div className="max-w-[320px]">
        <StatefulSingleDatePicker
          {...singleArgs}
          defaultValue={new Date(2026, 0, 20)}
          size="s"
        />
      </div>
    );
  },
};
