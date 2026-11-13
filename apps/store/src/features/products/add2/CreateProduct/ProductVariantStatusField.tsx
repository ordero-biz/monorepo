import { Select } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { memo, useMemo } from 'react';
import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import type { ProductStatus } from '@/lib/domain/products/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import { validateProductVariantStatus } from '../../add/CreateProduct/utils/validations';
import type { ProductVariantStatusFieldProps } from './types';

export const ProductVariantStatusField = memo(
  ({ form, variantIndex }: ProductVariantStatusFieldProps) => {
    const productStatus = useStore(form.store, (state) => state.values.status);
    const statusOptions = useMemo(
      () => [
        { label: 'Draft', value: PRODUCT_STATUS.DRAFT },
        {
          label: 'Active',
          description:
            productStatus === PRODUCT_STATUS.DRAFT
              ? 'Product is Draft. Change its status in Product details.'
              : undefined,
          value: PRODUCT_STATUS.ACTIVE,
          disabled: productStatus === PRODUCT_STATUS.DRAFT,
        },
      ],
      [productStatus]
    );
    const validateStatus = ({ value }: ValidationArgs<ProductStatus>) =>
      validateProductVariantStatus({
        value,
        productStatus: form.getFieldValue('status'),
      });
    const changeStatus = (value: string | null) => {
      if (value !== PRODUCT_STATUS.DRAFT && value !== PRODUCT_STATUS.ACTIVE) {
        return;
      }
      if (
        value === PRODUCT_STATUS.ACTIVE &&
        form.getFieldValue('status') === PRODUCT_STATUS.DRAFT
      ) {
        return;
      }
      form.setFieldValue(`productVariants[${variantIndex}].status`, value);
    };
    const submissionAttempts = useStore(
      form.store,
      (state) => state.submissionAttempts
    );

    return (
      <form.Field
        name={`productVariants[${variantIndex}].status`}
        validators={{
          onChangeListenTo: ['status'],
          onChange: validateStatus,
          onSubmit: validateStatus,
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
              onValueChange={changeStatus}
              onBlur={field.handleBlur}
              errorText={errorText}
              invalid={Boolean(errorText)}
              required
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
