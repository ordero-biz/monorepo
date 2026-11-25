'use client';

import { Dialog } from '@ordero/ui';
import { useState } from 'react';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { CategorySelection } from '@/lib/domain/categories/types';
import { ReviewProductCategory } from './ReviewProductCategory';
import type { ProductCategoryComboboxProps } from './types';

export const ProductCategoryCombobox = ({
  errorText,
  invalid,
  label,
  name,
  onBlur,
  onValueChange,
  placeholder,
  required,
  size,
  value,
}: ProductCategoryComboboxProps) => {
  const [categoryToReview, setCategoryToReview] =
    useState<CategorySelection | null>(null);
  const [open, setOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const closeReview = () => {
    setCategoryToReview(null);
  };

  return (
    <>
      <CategoriesAsyncCombobox
        errorText={errorText}
        invalid={invalid}
        label={label}
        name={name}
        onBlur={(event) => {
          if (!categoryToReview) onBlur?.(event);
        }}
        onOpenChange={setOpen}
        onValueChange={(category, details) => {
          if (category && category.status !== CATEGORY_STATUS.ACTIVE) {
            details.cancel();
            setOpen(false);
            setCategoryToReview(category);
            return;
          }
          onValueChange(category);
        }}
        open={open}
        placeholder={placeholder}
        required={required}
        size={size}
        value={value}
      />
      <Dialog.Root
        open={Boolean(categoryToReview)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isActivating) closeReview();
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              {categoryToReview ? (
                <ReviewProductCategory
                  key={categoryToReview.id}
                  category={categoryToReview}
                  onBusyChange={setIsActivating}
                  onSelect={(category) => {
                    onValueChange(category);
                    closeReview();
                  }}
                />
              ) : null}
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
