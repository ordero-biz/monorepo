import { useState } from 'react';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import { GeneratedProductVariantCard } from './GeneratedProductVariantCard';
import { PRODUCT_GENERATION_MODE } from './constants';
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
}: GeneratedProductVariantListProps) => {
  const { hasMoreVariants, loadMoreRef, visibleProductVariants } =
    useIncrementalProductVariants(productVariants);

  return (
    <div className="mt-3 mb-2 flex flex-col gap-[var(--space-1)]">
      {visibleProductVariants.map((productVariant, variantIndex) => (
        <GeneratedProductVariantCard
          attributes={attributes}
          form={form}
          // biome-ignore lint/suspicious/noArrayIndexKey: Generated variants are replaced as a full collection.
          key={variantIndex}
          onEditAttributes={() => onEditAttributes(variantIndex)}
          productVariant={productVariant}
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
  generationMode,
}: GeneratedProductVariantsProps) => {
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null
  );
  const allowMultipleValuesPerAttribute =
    generationMode === PRODUCT_GENERATION_MODE.one;

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
        const editingProductVariant =
          editingVariantIndex === null
            ? undefined
            : productVariants[editingVariantIndex];

        return productVariants.length > 0 ? (
          <>
            <GeneratedProductVariantList
              attributes={attributes}
              form={form}
              onEditAttributes={setEditingVariantIndex}
              productVariants={productVariants}
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
          </>
        ) : null;
      }}
    </form.Subscribe>
  );
};
