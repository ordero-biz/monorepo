'use client';

import { Dialog } from '@ordero/ui';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { AttributeValuesCombobox } from '@/features/attributes';
import { getAttributeValues } from '@/lib/client/api/attributes';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { attributeValuesQueryOptions } from '@/lib/query/attributes/attributesQueryOptions';
import { ReviewProductAttributeValue } from './ReviewProductAttributeValue';
import type {
  AttributeValueMultipleChangeHandler,
  AttributeValueSingleChangeHandler,
  ProductAttributeValuesComboboxProps,
} from './types';

export const ProductAttributeValuesCombobox = (
  props: ProductAttributeValuesComboboxProps
) => {
  // Observe reviewed values across selectors without requesting data on mount.
  const { data: reviewedValues } = useQuery({
    ...attributeValuesQueryOptions(props.attribute.id, getAttributeValues),
    enabled: false,
  });
  const options = useMemo(() => {
    const reviewedById = new Map(
      reviewedValues?.map((value) => [value.id, value])
    );
    return props.options.map((value) => reviewedById.get(value.id) ?? value);
  }, [props.options, reviewedValues]);

  const [valueToReview, setValueToReview] = useState<AttributeValue | null>(
    null
  );
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [isActivating, setIsActivating] = useState(false);

  const openReview = (value: AttributeValue) => {
    setOpen(false);
    setValueToReview(value);
  };

  const handleSingleChange: AttributeValueSingleChangeHandler = (
    value,
    details
  ) => {
    if (props.multiple) {
      return;
    }
    if (value && value.status !== ATTRIBUTE_VALUE_STATUS.ACTIVE) {
      details.cancel();
      openReview(value);
      return;
    }
    props.onValueChange(value);
  };

  const handleMultipleChange: AttributeValueMultipleChangeHandler = (
    values,
    details
  ) => {
    if (!props.multiple) {
      return;
    }
    const addedDraft = values.find(
      (value) =>
        value.status !== ATTRIBUTE_VALUE_STATUS.ACTIVE &&
        !props.value.some((selected) => selected.id === value.id)
    );
    if (addedDraft) {
      details.cancel();
      openReview(addedDraft);
      return;
    }
    props.onValueChange(values);
  };

  const handleReviewedSelection = (value: AttributeValue) => {
    if (props.multiple) {
      const optionsById = new Map(options.map((option) => [option.id, option]));
      const remaining = props.value
        .filter((selected) => selected.id !== value.id)
        .map((selected) => optionsById.get(selected.id) ?? selected);
      props.onValueChange([...remaining, value]);
    } else {
      props.onValueChange(value);
    }
    setValueToReview(null);
  };

  const handleReviewOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isActivating) {
      setValueToReview(null);
    }
  };

  const handleBlur: ProductAttributeValuesComboboxProps['onBlur'] = (event) => {
    if (!valueToReview) {
      props.onBlur?.(event);
    }
  };

  const commonProps = {
    'aria-describedby': props['aria-describedby'],
    'aria-label': props['aria-label'],
    autoFocus: props.autoFocus,
    options,
    emptyText: props.emptyText,
    endAdornment: props.endAdornment,
    errorText: props.errorText,
    helperText: props.helperText,
    id: props.id,
    invalid: props.invalid,
    label: props.label,
    name: props.name,
    onBlur: handleBlur,
    onOpenChange: setOpen,
    open,
    placeholder: props.placeholder,
    required: props.required,
    size: props.size,
  };

  return (
    <>
      {props.multiple ? (
        <AttributeValuesCombobox
          {...commonProps}
          multiple
          value={props.value}
          onValueChange={handleMultipleChange}
        />
      ) : (
        <AttributeValuesCombobox
          {...commonProps}
          value={props.value}
          onValueChange={handleSingleChange}
        />
      )}
      <Dialog.Root
        open={Boolean(valueToReview)}
        onOpenChange={handleReviewOpenChange}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              {valueToReview ? (
                <ReviewProductAttributeValue
                  key={valueToReview.id}
                  attribute={props.attribute}
                  attributeValue={valueToReview}
                  onBusyChange={setIsActivating}
                  onSelect={handleReviewedSelection}
                />
              ) : null}
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
