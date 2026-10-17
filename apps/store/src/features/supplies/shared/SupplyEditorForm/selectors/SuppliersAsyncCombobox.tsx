'use client';

import { Chip } from '@ordero/ui';
import { getSuppliers } from '@/lib/client/api/suppliers';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import type { SupplySupplierSelection } from '../types';
import type { SuppliersAsyncComboboxProps } from './types';

const loadSupplierOptions = async ({
  page,
  pageSize,
}: AsyncComboboxLoadOptionsArgs): Promise<
  AsyncComboboxLoadOptionsResult<SupplySupplierSelection>
> => {
  const result = await getSuppliers({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
    options: result.data.content.map(({ id, name, status }) => ({
      id,
      name,
      status,
    })),
  };
};

const getSupplierValue = (supplier: SupplySupplierSelection) =>
  String(supplier.id);
const getSupplierLabel = (supplier: SupplySupplierSelection) => supplier.name;
const renderSupplierOption = (supplier: SupplySupplierSelection) => (
  <span className="flex min-w-0 items-center gap-[var(--space-1)]">
    <span className="truncate">{supplier.name}</span>
    {supplier.status === SUPPLIER_STATUS.DRAFT ? (
      <Chip size="s" variant="soft">
        Draft
      </Chip>
    ) : null}
  </span>
);

export const SuppliersAsyncCombobox = ({
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
}: SuppliersAsyncComboboxProps) => (
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
    emptyText="No suppliers found"
    loadErrorText="We couldn't load suppliers right now."
    loadOptions={loadSupplierOptions}
    loadingText="Loading suppliers..."
    pageSize={100}
    queryKey={[...suppliersQueryKeys.options(), 'combobox']}
    getOptionValue={getSupplierValue}
    getOptionLabel={getSupplierLabel}
    renderOption={renderSupplierOption}
  />
);
