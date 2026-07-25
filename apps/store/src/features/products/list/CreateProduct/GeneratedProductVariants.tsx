import { Typography } from '@ordero/ui';
import { useState } from 'react';
import { PRODUCT_GENERATION_MODE } from './constants';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import { GeneratedProductVariantCard } from './GeneratedProductVariantCard';
import { useIncrementalProductVariants } from './hooks/useIncrementalProductVariants';
import type {
  GeneratedProductVariantListProps,
  GeneratedProductVariantsProps,
} from './types';

const GeneratedProductVariantList = ({
  attributes,
  form,
  onEditAttributes,
  productVariants,
  requireAttributeValueIds,
}: GeneratedProductVariantListProps) => {
  const { hasMoreVariants, loadMoreRef, visibleProductVariants } =
    useIncrementalProductVariants(productVariants);

  return (
    <div className="mt-1 mb-2 flex flex-col gap-[var(--space-1)]">
      {visibleProductVariants.map((productVariant, variantIndex) => (
        <GeneratedProductVariantCard
          attributes={attributes}
          form={form}
          // biome-ignore lint/suspicious/noArrayIndexKey: Generated variants are replaced as a full collection.
          key={variantIndex}
          onEditAttributes={() => onEditAttributes(variantIndex)}
          productVariant={productVariant}
          requireAttributeValueIds={requireAttributeValueIds}
          variantIndex={variantIndex}
        />
      ))}
      {hasMoreVariants ? (
        <div aria-hidden="true" className="h-px" ref={loadMoreRef} />
      ) : null}
    </div>
  );
};

export const GeneratedProductVariants = ({
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
        [
          state.values.attributes,
          state.values.productVariants,
          state.values.productVariantsGenerationMode,
        ] as const
      }
    >
      {([attributes, productVariants, productVariantsGenerationMode]) => {
        const allowMultipleValuesPerAttribute =
          productVariantsGenerationMode === PRODUCT_GENERATION_MODE.one;
        const requireAttributeValueIds =
          productVariantsGenerationMode === PRODUCT_GENERATION_MODE.many;
        const editingProductVariant =
          editingVariantIndex === null
            ? undefined
            : productVariants[editingVariantIndex];

        return productVariants.length > 0 ? (
          <div className="mt-3">
            <Typography variant="h5">Generated product variants</Typography>
            <GeneratedProductVariantList
              attributes={attributes}
              form={form}
              onEditAttributes={setEditingVariantIndex}
              productVariants={productVariants}
              requireAttributeValueIds={requireAttributeValueIds}
            />

            {editingVariantIndex !== null && editingProductVariant ? (
              <form.Field
                name={
                  `productVariants[${editingVariantIndex}].attributeValueIds` as const
                }
              >
                {(field) => (
                  <EditProductVariantAttributesDialog
                    allowMultipleValuesPerAttribute={
                      allowMultipleValuesPerAttribute
                    }
                    attributes={attributes}
                    attributeValueIds={field.state.value}
                    onOpenChange={handleAttributesDialogOpenChange}
                    onUpdate={field.handleChange}
                    open
                    productVariantName={editingProductVariant.name}
                  />
                )}
              </form.Field>
            ) : null}
          </div>
        ) : null;
      }}
    </form.Subscribe>
  );
};
