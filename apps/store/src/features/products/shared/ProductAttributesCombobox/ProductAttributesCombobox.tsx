'use client';

import { Dialog } from '@ordero/ui';
import { useState } from 'react';
import { AttributesAsyncCombobox } from '@/features/attributes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { ReviewProductAttribute } from './ReviewProductAttribute';
import type {
  AttributeMultipleChangeHandler,
  AttributeSingleChangeHandler,
  ProductAttributesComboboxProps,
} from './types';

export const ProductAttributesCombobox = (
  props: ProductAttributesComboboxProps
) => {
  const [attributeToReview, setAttributeToReview] =
    useState<AttributeDropdown | null>(null);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [isActivating, setIsActivating] = useState(false);

  const openReview = (attribute: AttributeDropdown) => {
    setOpen(false);
    setAttributeToReview(attribute);
  };

  const handleSingleChange: AttributeSingleChangeHandler = (
    attribute,
    details
  ) => {
    if (props.multiple) {
      return;
    }
    if (attribute && attribute.status !== ATTRIBUTE_STATUS.ACTIVE) {
      details.cancel();
      openReview(attribute);
      return;
    }
    props.onValueChange(attribute);
  };

  const handleMultipleChange: AttributeMultipleChangeHandler = (
    attributes,
    details
  ) => {
    if (!props.multiple) {
      return;
    }
    const addedDraft = attributes.find(
      (attribute) =>
        attribute.status !== ATTRIBUTE_STATUS.ACTIVE &&
        !props.value.some((selected) => selected.id === attribute.id)
    );
    if (addedDraft) {
      details.cancel();
      openReview(addedDraft);
      return;
    }
    props.onValueChange(attributes);
  };

  const handleReviewedSelection = (attribute: AttributeDropdown) => {
    if (props.multiple) {
      const remaining = props.value.filter(
        (selected) => selected.id !== attribute.id
      );
      props.onValueChange([...remaining, attribute]);
    } else {
      props.onValueChange(attribute);
    }
    setAttributeToReview(null);
  };

  const handleReviewOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isActivating) {
      setAttributeToReview(null);
    }
  };

  const handleBlur: ProductAttributesComboboxProps['onBlur'] = (event) => {
    if (!attributeToReview) {
      props.onBlur?.(event);
    }
  };

  const commonProps = {
    'aria-describedby': props['aria-describedby'],
    'aria-label': props['aria-label'],
    autoFocus: props.autoFocus,
    disabledAttributeIds: props.disabledAttributeIds,
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
        <AttributesAsyncCombobox
          {...commonProps}
          multiple
          value={props.value}
          onValueChange={handleMultipleChange}
        />
      ) : (
        <AttributesAsyncCombobox
          {...commonProps}
          value={props.value}
          onValueChange={handleSingleChange}
        />
      )}
      <Dialog.Root
        open={Boolean(attributeToReview)}
        onOpenChange={handleReviewOpenChange}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              {attributeToReview ? (
                <ReviewProductAttribute
                  key={attributeToReview.id}
                  attribute={attributeToReview}
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
