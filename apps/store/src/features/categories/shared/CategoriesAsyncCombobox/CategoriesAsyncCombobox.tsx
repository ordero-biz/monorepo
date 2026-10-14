'use client';

import { Chip } from '@ordero/ui';
import { useCallback, useMemo } from 'react';
import { getCategories } from '@/lib/client/api/categories';
import {
  AsyncCombobox2,
  type AsyncCombobox2LoadOptionsArgs,
  type AsyncCombobox2LoadOptionsResult,
} from '@/lib/components/AsyncCombobox2';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import type {
  CategoriesAsyncComboboxProps,
  CategoryComboboxOption,
} from './types';

const noParentOption: CategoryComboboxOption = {
  id: null,
  name: 'No parent category',
};
const noParentOptions = [noParentOption];
const getCategoryValue = (category: CategoryComboboxOption) =>
  category.id === null ? '' : String(category.id);
const getCategoryLabel = (category: CategoryComboboxOption) => category.name;
const renderCategoryOption = (category: CategoryComboboxOption) => (
  <span className="flex min-w-0 items-center gap-[var(--space-1)]">
    <span className="truncate">{category.name}</span>
    {category.status === CATEGORY_STATUS.DRAFT ? (
      <Chip size="s" variant="soft">
        Draft
      </Chip>
    ) : null}
  </span>
);

const loadCategoryOptions = async ({
  page,
  pageSize,
}: AsyncCombobox2LoadOptionsArgs): Promise<
  AsyncCombobox2LoadOptionsResult<CategoryComboboxOption>
> => {
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
    options: result.data.content.map(({ id, name, status }) => ({
      id,
      name,
      status,
    })),
  };
};

export const CategoriesAsyncCombobox = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  allowNoParent,
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
  value,
  variant,
}: CategoriesAsyncComboboxProps) => {
  const disabledCategoryIdSet = useMemo(
    () => new Set(disabledCategoryIds?.map(String)),
    [disabledCategoryIds]
  );
  const isOptionDisabled = useCallback(
    (option: CategoryComboboxOption) =>
      option.id !== null && disabledCategoryIdSet.has(String(option.id)),
    [disabledCategoryIdSet]
  );

  return (
    <AsyncCombobox2<CategoryComboboxOption>
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultInputValue={defaultInputValue}
      defaultOpen={defaultOpen}
      defaultValue={
        defaultValue === null && allowNoParent ? noParentOption : defaultValue
      }
      disabled={disabled}
      emptyText="No categories found"
      endAdornment={endAdornment}
      endIcon={endIcon}
      errorIcon={errorIcon}
      errorText={errorText}
      getOptionLabel={getCategoryLabel}
      getOptionValue={getCategoryValue}
      renderOption={renderCategoryOption}
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
      onValueChange={(option, details) =>
        onValueChange?.(option?.id === null ? null : option, details)
      }
      open={open}
      pageSize={100}
      placeholder={placeholder}
      queryKey={[...categoriesQueryKeys.options(), 'combobox2']}
      readOnly={readOnly}
      ref={ref}
      required={required}
      size={size}
      startAdornment={startAdornment}
      startIcon={startIcon}
      staticOptions={allowNoParent ? noParentOptions : undefined}
      value={value === null && allowNoParent ? noParentOption : value}
      variant={variant}
    />
  );
};
