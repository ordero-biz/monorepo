import { Typography } from '@ordero/ui';
import { useState } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_GENERATION_MODE } from './constants';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import { GeneratedProductVariantCard } from './GeneratedProductVariantCard';
import { useIncrementalProductVariants } from './hooks/useIncrementalProductVariants';
import type {
  CreateProductForm,
  GeneratedProductVariantListProps,
  GeneratedProductVariantsProps,
} from './types';

type EditGeneratedProductVariantAttributesProps = {
  allowMultipleValuesPerAttribute: boolean;
  attributes: AttributeDropdown[];
  form: CreateProductForm;
  onOpenChange: (open: boolean) => void;
  variantIndex: number;
};

const EditGeneratedProductVariantAttributes = ({
  allowMultipleValuesPerAttribute,
  attributes,
  form,
  onOpenChange,
  variantIndex,
}: EditGeneratedProductVariantAttributesProps) => (
  <form.Field
    name={`productVariants[${variantIndex}].attributeValueIds` as const}
  >
    {(attributeValueIdsField) => (
      <form.Field name={`productVariants[${variantIndex}].name` as const}>
        {(nameField) => (
          <EditProductVariantAttributesDialog
            allowMultipleValuesPerAttribute={allowMultipleValuesPerAttribute}
            attributes={attributes}
            attributeValueIds={attributeValueIdsField.state.value}
            onOpenChange={onOpenChange}
            onUpdate={attributeValueIdsField.handleChange}
            open
            productVariantName={nameField.state.value}
          />
        )}
      </form.Field>
    )}
  </form.Field>
);

const GeneratedProductVariantList = ({
  attributes,
  form,
  onEditAttributes,
  productVariantCount,
  requireAttributeValueIds,
}: GeneratedProductVariantListProps) => {
  const { hasMoreVariants, loadMoreRef, visibleVariantIndexes } =
    useIncrementalProductVariants({
      productVariantCount,
    });

  return (
    <div className="mt-1 mb-2 flex flex-col gap-[var(--space-1)]">
      {visibleVariantIndexes.map((variantIndex) => (
        <GeneratedProductVariantCard
          attributes={attributes}
          form={form}
          key={variantIndex}
          onEditAttributes={onEditAttributes}
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
  generatedAttributes,
  generationVersion,
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
    <form.Subscribe selector={(state) => state.values.productVariants.length}>
      {(productVariantCount) =>
        productVariantCount > 0 ? (
          <form.Subscribe
            selector={(state) => state.values.productVariantsGenerationMode}
          >
            {(productVariantsGenerationMode) => {
              const allowMultipleValuesPerAttribute =
                productVariantsGenerationMode === PRODUCT_GENERATION_MODE.one;
              const requireAttributeValueIds =
                productVariantsGenerationMode === PRODUCT_GENERATION_MODE.many;

              return (
                <div className="mt-3">
                  <Typography variant="h5">
                    Generated product variants
                  </Typography>
                  <GeneratedProductVariantList
                    attributes={generatedAttributes}
                    form={form}
                    key={generationVersion}
                    onEditAttributes={setEditingVariantIndex}
                    productVariantCount={productVariantCount}
                    requireAttributeValueIds={requireAttributeValueIds}
                  />

                  {editingVariantIndex !== null ? (
                    <EditGeneratedProductVariantAttributes
                      allowMultipleValuesPerAttribute={
                        allowMultipleValuesPerAttribute
                      }
                      attributes={generatedAttributes}
                      form={form}
                      onOpenChange={handleAttributesDialogOpenChange}
                      variantIndex={editingVariantIndex}
                    />
                  ) : null}
                </div>
              );
            }}
          </form.Subscribe>
        ) : null
      }
    </form.Subscribe>
  );
};
