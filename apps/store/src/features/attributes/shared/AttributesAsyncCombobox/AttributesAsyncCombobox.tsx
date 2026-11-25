'use client';

import { Chip } from '@ordero/ui';
import { useCallback, useMemo } from 'react';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
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

const renderAttributeOption = (attribute: AttributeDropdown) => (
  <span className="flex min-w-0 items-center gap-[var(--space-1)]">
    <span className="truncate">{attribute.name}</span>
    {attribute.status === ATTRIBUTE_STATUS.DRAFT ? (
      <Chip size="s" variant="soft">
        Draft
      </Chip>
    ) : null}
  </span>
);

export const AttributesAsyncCombobox = (
  props: AttributesAsyncComboboxProps
) => {
  const disabledAttributeIds = useMemo(
    () => new Set(props.disabledAttributeIds),
    [props.disabledAttributeIds]
  );
  const isOptionDisabled = useCallback(
    (attribute: AttributeDropdown) => disabledAttributeIds.has(attribute.id),
    [disabledAttributeIds]
  );

  const commonProps = {
    'aria-describedby': props['aria-describedby'],
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
    autoComplete: props.autoComplete,
    autoFocus: props.autoFocus,
    defaultInputValue: props.defaultInputValue,
    defaultOpen: props.defaultOpen,
    disabled: props.disabled,
    endAdornment: props.endAdornment,
    endIcon: props.endIcon,
    errorIcon: props.errorIcon,
    errorText: props.errorText,
    helperIcon: props.helperIcon,
    helperText: props.helperText,
    id: props.id,
    inputValue: props.inputValue,
    invalid: props.invalid,
    label: props.label,
    name: props.name,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    onInputValueChange: props.onInputValueChange,
    onKeyDown: props.onKeyDown,
    onListScroll: props.onListScroll,
    onOpenChange: props.onOpenChange,
    open: props.open,
    placeholder: props.placeholder,
    readOnly: props.readOnly,
    ref: props.ref,
    required: props.required,
    size: props.size,
    startAdornment: props.startAdornment,
    startIcon: props.startIcon,
    variant: props.variant,
    emptyText: 'No attributes found',
    getOptionLabel: getAttributeLabel,
    getOptionValue: getAttributeValue,
    renderOption: renderAttributeOption,
    isOptionDisabled,
    loadErrorText: "We couldn't load attributes right now.",
    loadingText: 'Loading attributes...',
    loadOptions: loadAttributeOptions,
    pageSize: 100,
    queryKey: [...attributesQueryKeys.attributeDropdown(), 'combobox'],
  };

  return props.multiple ? (
    <AsyncCombobox<AttributeDropdown>
      {...commonProps}
      multiple
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
    />
  ) : (
    <AsyncCombobox<AttributeDropdown>
      {...commonProps}
      multiple={false}
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
    />
  );
};
