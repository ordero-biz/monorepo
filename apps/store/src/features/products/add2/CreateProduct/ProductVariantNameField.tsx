import { TextField } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { memo } from 'react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import type { ProductVariantNameFieldProps } from './types';

export const ProductVariantNameField = memo(
  ({ form, variantIndex }: ProductVariantNameFieldProps) => {
    const submissionAttempts = useStore(
      form.store,
      (state) => state.submissionAttempts
    );
    return (
      <form.Field name={`productVariants[${variantIndex}].name`}>
        {(field) => {
          const errorText = getFieldSubmitChangeErrorText(
            field.state.meta,
            submissionAttempts
          );
          return (
            <TextField
              aria-label={`Variant name for variant ${variantIndex + 1}`}
              name={field.name}
              value={field.state.value}
              onValueChange={field.handleChange}
              onBlur={field.handleBlur}
              errorText={errorText}
              invalid={Boolean(errorText)}
              required
              size="s"
            />
          );
        }}
      </form.Field>
    );
  }
);

ProductVariantNameField.displayName = 'ProductVariantNameField';
