'use client';

import { getAttributesDropdown } from '@/lib/client/api/attributes';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import type { AttributesAsyncComboboxProps } from './types';

const getAttributeValue = (attribute: AttributeDropdown) =>
  String(attribute.id);
const getAttributeLabel = (attribute: AttributeDropdown) => attribute.name;

const loadAttributeOptions = async (): Promise<
  AsyncComboboxLoadOptionsResult<AttributeDropdown>
> => {
  const result = await getAttributesDropdown();

  if (!result.ok) {
    throw result.error;
  }

  return { options: result.data };
};

export const AttributesAsyncCombobox = ({
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
  value,
  variant,
}: AttributesAsyncComboboxProps) => {
  return (
    <AsyncCombobox<AttributeDropdown>
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultInputValue={defaultInputValue}
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      disabled={disabled}
      emptyText="No attributes found"
      endAdornment={endAdornment}
      endIcon={endIcon}
      errorIcon={errorIcon}
      errorText={errorText}
      getOptionLabel={getAttributeLabel}
      getOptionValue={getAttributeValue}
      helperIcon={helperIcon}
      helperText={helperText}
      id={id}
      inputValue={inputValue}
      invalid={invalid}
      label={label}
      loadErrorText="We couldn't load attributes right now."
      loadOptions={loadAttributeOptions}
      loadingText="Loading attributes..."
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
      pageSize={100}
      placeholder={placeholder}
      queryKey={[...attributesQueryKeys.attributeDropdown(), 'combobox']}
      readOnly={readOnly}
      ref={ref}
      required={required}
      size={size}
      startAdornment={startAdornment}
      startIcon={startIcon}
      value={value}
      variant={variant}
    />
  );
};
