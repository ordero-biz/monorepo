import { FieldLabel, Textarea } from '@ordero/ui';
import { memo } from 'react';
import { ProductImageDropzone } from '../../add/CreateProduct';
import { ProductVariantAttributes } from './ProductVariantAttributes';
import type { ProductVariantDetailsProps } from './types';

export const ProductVariantDetails = memo(
  (props: ProductVariantDetailsProps) => {
    const { productVariantsCreationForm: form, variantIndex } = props;

    return (
      <div className="grid items-start gap-[var(--space-3)] md:grid-cols-[minmax(0,1fr)_var(--space-20)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
          <ProductVariantAttributes {...props} />
          <form.Field name={`productVariants[${variantIndex}].description`}>
            {(field) => (
              <Textarea
                label="Description"
                name={field.name}
                value={field.state.value}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
                rows={3}
                resize="none"
              />
            )}
          </form.Field>
        </div>
        <div className="flex w-[var(--space-20)] flex-col gap-[var(--space-0-5)]">
          <FieldLabel as="span">Variant image</FieldLabel>
          <ProductImageDropzone
            titleId={`product-variant-${variantIndex}-add-image-title`}
          />
        </div>
      </div>
    );
  }
);

ProductVariantDetails.displayName = 'ProductVariantDetails';
