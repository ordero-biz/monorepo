'use client';

import { Chip } from '@ordero/ui';
import { getProductVariants } from '@/lib/client/api/products';
import {
  AsyncCombobox2,
  type AsyncCombobox2LoadOptionsArgs,
  type AsyncCombobox2LoadOptionsResult,
} from '@/lib/components/AsyncCombobox2';
import { productVariantsQueryKeys } from '@/lib/query/products/productsQueryKeys';
import type { SupplyProductVariantSelection } from '../types';
import type { ProductVariantsAsyncComboboxProps } from './types';

const loadProductVariantOptions = async ({
  page,
  pageSize,
}: AsyncCombobox2LoadOptionsArgs): Promise<
  AsyncCombobox2LoadOptionsResult<SupplyProductVariantSelection>
> => {
  const result = await getProductVariants({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
    options: result.data.content.map(({ id, name, sku, status }) => ({
      id,
      name,
      sku,
      status,
    })),
  };
};

const getProductVariantValue = (variant: SupplyProductVariantSelection) =>
  String(variant.id);
const getProductVariantLabel = (variant: SupplyProductVariantSelection) =>
  variant.sku ? `${variant.name} · ${variant.sku}` : variant.name;
const renderProductVariantOption = (variant: SupplyProductVariantSelection) => (
  <span className="flex min-w-0 items-center gap-[var(--space-1)]">
    <span className="truncate">{getProductVariantLabel(variant)}</span>
    {variant.status === 'DRAFT' ? (
      <Chip size="s" variant="soft">
        Draft
      </Chip>
    ) : null}
  </span>
);

export const ProductVariantsAsyncCombobox = ({
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
}: ProductVariantsAsyncComboboxProps) => (
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
    emptyText="No products found"
    loadErrorText="We couldn't load products right now."
    loadOptions={loadProductVariantOptions}
    loadingText="Loading products..."
    pageSize={100}
    queryKey={[...productVariantsQueryKeys.options(), 'combobox2']}
    getOptionValue={getProductVariantValue}
    getOptionLabel={getProductVariantLabel}
    renderOption={renderProductVariantOption}
  />
);
