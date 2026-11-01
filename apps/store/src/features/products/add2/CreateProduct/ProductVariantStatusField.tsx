import { Select } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { memo } from 'react';
import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { validateProductStatus } from '../../add/CreateProduct/utils/validations';
import type { ProductVariantStatusFieldProps } from './types';

const statusOptions = [
  { label: 'Draft', value: PRODUCT_STATUS.DRAFT },
  { label: 'Active', value: PRODUCT_STATUS.ACTIVE },
];
export const ProductVariantStatusField = memo(
  ({ form, variantIndex }: ProductVariantStatusFieldProps) => {
    const submissionAttempts = useStore(
      form.store,
      (state) => state.submissionAttempts
    );
    return (
      <form.Field
        name={`productVariants[${variantIndex}].status`}
        validators={{
          onChange: validateProductStatus,
          onSubmit: validateProductStatus,
        }}
      >
        {(field) => {
          const errorText = getFieldSubmitChangeErrorText(
            field.state.meta,
            submissionAttempts
          );
          return (
            <Select
              aria-label={`Status for variant ${variantIndex + 1}`}
              name={field.name}
              value={field.state.value}
              options={statusOptions}
              onValueChange={(value) => {
                if (
                  value === PRODUCT_STATUS.DRAFT ||
                  value === PRODUCT_STATUS.ACTIVE
                )
                  field.handleChange(value);
              }}
              onBlur={field.handleBlur}
              errorText={errorText}
              invalid={Boolean(errorText)}
              size="s"
              width="full"
            />
          );
        }}
      </form.Field>
    );
  }
);

ProductVariantStatusField.displayName = 'ProductVariantStatusField';
