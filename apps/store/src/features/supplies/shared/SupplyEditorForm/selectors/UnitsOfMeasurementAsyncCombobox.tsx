'use client';

import { Chip } from '@ordero/ui';
import { getUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import type { UnitsOfMeasurementAsyncComboboxProps } from './types';

const loadUnitOfMeasurementOptions = async ({
  page,
  pageSize,
}: AsyncComboboxLoadOptionsArgs): Promise<AsyncComboboxLoadOptionsResult> => {
  const result = await getUnitsOfMeasurement({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
    options: result.data.content.map((unit) => ({
      data: unit,
      displayValue: unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name,
      label: (
        <span className="flex min-w-0 items-center gap-[var(--space-1)]">
          <span className="truncate">
            {unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name}
          </span>
          {unit.status === UNIT_OF_MEASUREMENT_STATUS.DRAFT ? (
            <Chip size="s" variant="soft">
              Draft
            </Chip>
          ) : null}
        </span>
      ),
      value: String(unit.id),
    })),
  };
};

export const UnitsOfMeasurementAsyncCombobox = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  autoComplete,
  autoFocus,
  defaultInputValue,
  defaultOpen,
  defaultValue,
  disabled,
  endAdornment,
  endIcon,
  errorIcon,
  errorText,
  helperIcon,
  helperText,
  id,
  inputValue,
  invalid,
  isOptionDisabled,
  label,
  multiple,
  name,
  onBlur,
  onFocus,
  onInputValueChange,
  onKeyDown,
  onListScroll,
  onOpenChange,
  onOptionSelect,
  onValueChange,
  open,
  placeholder,
  readOnly,
  ref,
  required,
  size,
  startAdornment,
  startIcon,
  staticOptions,
  value,
  variant,
}: UnitsOfMeasurementAsyncComboboxProps) => (
  <AsyncCombobox
    aria-describedby={ariaDescribedBy}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    autoComplete={autoComplete}
    autoFocus={autoFocus}
    defaultInputValue={defaultInputValue}
    defaultOpen={defaultOpen}
    defaultValue={defaultValue}
    disabled={disabled}
    endAdornment={endAdornment}
    endIcon={endIcon}
    errorIcon={errorIcon}
    errorText={errorText}
    helperIcon={helperIcon}
    helperText={helperText}
    id={id}
    inputValue={inputValue}
    invalid={invalid}
    isOptionDisabled={isOptionDisabled}
    label={label}
    multiple={multiple}
    name={name}
    onBlur={onBlur}
    onFocus={onFocus}
    onInputValueChange={onInputValueChange}
    onKeyDown={onKeyDown}
    onListScroll={onListScroll}
    onOpenChange={onOpenChange}
    onOptionSelect={onOptionSelect}
    onValueChange={onValueChange}
    open={open}
    placeholder={placeholder}
    readOnly={readOnly}
    ref={ref}
    required={required}
    size={size}
    startAdornment={startAdornment}
    startIcon={startIcon}
    staticOptions={staticOptions}
    value={value}
    variant={variant}
    emptyText="No units of measurement found"
    loadErrorText="We couldn't load units of measurement right now."
    loadOptions={loadUnitOfMeasurementOptions}
    loadingText="Loading units of measurement..."
    pageSize={100}
    queryKey={unitsOfMeasurementQueryKeys.options()}
  />
);
