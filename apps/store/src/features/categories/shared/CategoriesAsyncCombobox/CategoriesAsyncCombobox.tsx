'use client';

import { useCallback, useMemo } from 'react';
import { getCategories } from '@/lib/client/api/categories';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import type { CategoriesAsyncComboboxProps } from './types';

const loadCategoryOptions = async ({
  page,
  pageSize,
}: AsyncComboboxLoadOptionsArgs): Promise<AsyncComboboxLoadOptionsResult> => {
  const result = await getCategories({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage: page < result.data.page.totalPages ? page + 1 : undefined,
    options: result.data.content.map((category) => ({
      label: category.name,
      value: String(category.id),
    })),
  };
};

export const CategoriesAsyncCombobox = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  autoComplete,
  autoFocus,
  defaultInputValue,
  defaultOpen,
  defaultValue,
  disabled,
  disabledCategoryIds,
  endAdornment,
  endIcon,
  errorIcon,
  errorText,
  helperIcon,
  helperText,
  id,
  inputValue,
  invalid,
  label,
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
}: CategoriesAsyncComboboxProps) => {
  const disabledCategoryIdSet = useMemo(
    () => new Set(disabledCategoryIds?.map(String)),
    [disabledCategoryIds]
  );
  const isOptionDisabled = useCallback(
    (option: { value: string }) => disabledCategoryIdSet.has(option.value),
    [disabledCategoryIdSet]
  );

  return (
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
      emptyText="No categories found"
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
      loadErrorText="We couldn't load categories right now."
      loadOptions={loadCategoryOptions}
      loadingText="Loading categories..."
      name={name}
      onBlur={onBlur}
      onFocus={onFocus}
      onInputValueChange={onInputValueChange}
      onKeyDown={onKeyDown}
      onListScroll={onListScroll}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
      open={open}
      pageSize={100}
      placeholder={placeholder}
      queryKey={categoriesQueryKeys.combobox()}
      readOnly={readOnly}
      ref={ref}
      required={required}
      size={size}
      startAdornment={startAdornment}
      startIcon={startIcon}
      staticOptions={staticOptions}
      value={value}
      variant={variant}
    />
  );
};
