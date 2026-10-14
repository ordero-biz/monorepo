'use client';

import { Chip } from '@ordero/ui';
import { getUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import {
  AsyncCombobox2,
  type AsyncCombobox2LoadOptionsArgs,
  type AsyncCombobox2LoadOptionsResult,
} from '@/lib/components/AsyncCombobox2';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import type { SupplyUnitOfMeasurementSelection } from '../types';
import type { UnitsOfMeasurementAsyncComboboxProps } from './types';

const loadUnitOfMeasurementOptions = async ({
  page,
  pageSize,
}: AsyncCombobox2LoadOptionsArgs): Promise<
  AsyncCombobox2LoadOptionsResult<SupplyUnitOfMeasurementSelection>
> => {
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
    options: result.data.content.map(({ id, name, symbol, status }) => ({
      id,
      name,
      symbol,
      status,
    })),
  };
};

const getUnitOfMeasurementValue = (unit: SupplyUnitOfMeasurementSelection) =>
  String(unit.id);
const getUnitOfMeasurementLabel = (unit: SupplyUnitOfMeasurementSelection) =>
  unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name;
const renderUnitOfMeasurementOption = (
  unit: SupplyUnitOfMeasurementSelection
) => (
  <span className="flex min-w-0 items-center gap-[var(--space-1)]">
    <span className="truncate">{getUnitOfMeasurementLabel(unit)}</span>
    {unit.status === UNIT_OF_MEASUREMENT_STATUS.DRAFT ? (
      <Chip size="s" variant="soft">
        Draft
      </Chip>
    ) : null}
  </span>
);

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
  <AsyncCombobox2
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
    queryKey={[...unitsOfMeasurementQueryKeys.options(), 'combobox2']}
    getOptionValue={getUnitOfMeasurementValue}
    getOptionLabel={getUnitOfMeasurementLabel}
    renderOption={renderUnitOfMeasurementOption}
  />
);
