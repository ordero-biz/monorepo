import { useState } from 'react';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import { GeneratedProductVariantCard } from './GeneratedProductVariantCard';
import type { GeneratedProductVariantsProps } from './types';

export const GeneratedProductVariants = ({
  availableAttributes,
  form,
}: GeneratedProductVariantsProps) => {
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null
  );

  const handleAttributesDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingVariantIndex(null);
    }
  };

  return (
    <form.Subscribe
      selector={(state) =>
        [state.values.attributes, state.values.productVariants] as const
      }
    >
      {([attributes, productVariants]) => {
        const variantAttributes =
          availableAttributes.length > 0 ? availableAttributes : attributes;
        const editingProductVariant =
          editingVariantIndex === null
            ? undefined
            : productVariants[editingVariantIndex];

        return productVariants.length > 0 ? (
          <>
            <div className="mt-3 mb-2 flex flex-col gap-[var(--space-1)]">
              {productVariants.map((productVariant, variantIndex) => (
                <GeneratedProductVariantCard
                  attributes={variantAttributes}
                  form={form}
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={variantIndex}
                  onEditAttributes={() => setEditingVariantIndex(variantIndex)}
                  productVariant={productVariant}
                  variantIndex={variantIndex}
                />
              ))}
            </div>

            {editingVariantIndex !== null && editingProductVariant ? (
              <form.Field
                name={
                  `productVariants[${editingVariantIndex}].attributeValueIds` as const
                }
              >
                {(field) => (
                  <EditProductVariantAttributesDialog
                    attributes={variantAttributes}
                    attributeValueIds={field.state.value}
                    onOpenChange={handleAttributesDialogOpenChange}
                    onUpdate={field.handleChange}
                    open
                    productVariantName={editingProductVariant.name}
                  />
                )}
              </form.Field>
            ) : null}
          </>
        ) : null;
      }}
    </form.Subscribe>
  );
};
