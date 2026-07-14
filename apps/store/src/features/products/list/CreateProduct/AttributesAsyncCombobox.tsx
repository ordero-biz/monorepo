'use client';

import { useCallback, useMemo, useState } from 'react';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import type { AttributesAsyncComboboxProps } from './types';

const mergeAttributesById = (
  attributes: AttributeDropdown[]
): Record<string, AttributeDropdown> =>
  Object.fromEntries(
    attributes.map((attribute) => [String(attribute.id), attribute])
  );

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
  onSelectedAttributesChange,
  onValueChange,
  open,
  placeholder,
  readOnly,
  ref,
  required,
  selectedAttributes = [],
  size,
  startAdornment,
  startIcon,
  value,
  variant,
}: AttributesAsyncComboboxProps) => {
  const [loadedAttributesById, setLoadedAttributesById] = useState<
    Record<string, AttributeDropdown>
  >({});
  const selectedAttributesById = useMemo(
    () => mergeAttributesById(selectedAttributes),
    [selectedAttributes]
  );
  const attributesById = useMemo(
    () => ({
      ...selectedAttributesById,
      ...loadedAttributesById,
    }),
    [loadedAttributesById, selectedAttributesById]
  );
  const loadAttributeOptions =
    useCallback(async (): Promise<AsyncComboboxLoadOptionsResult> => {
      const result = await getAttributesDropdown();

      if (!result.ok) {
        throw result.error;
      }

      setLoadedAttributesById((currentAttributesById) => ({
        ...currentAttributesById,
        ...mergeAttributesById(result.data),
      }));

      return {
        options: result.data.map((attribute) => ({
          label: attribute.name,
          value: String(attribute.id),
        })),
      };
    }, []);

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
      emptyText="No attributes found"
      endAdornment={endAdornment}
      endIcon={endIcon}
      errorIcon={errorIcon}
      errorText={errorText}
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
      onValueChange={(nextValue, details) => {
        onSelectedAttributesChange?.(
          nextValue
            .map((attributeId) => attributesById[attributeId])
            .filter((attribute): attribute is AttributeDropdown =>
              Boolean(attribute)
            )
        );
        onValueChange?.(nextValue, details);
      }}
      open={open}
      pageSize={100}
      placeholder={placeholder}
      queryKey={attributesQueryKeys.dropdown()}
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
