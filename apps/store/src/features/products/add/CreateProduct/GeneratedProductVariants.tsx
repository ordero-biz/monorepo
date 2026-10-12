import { Typography } from '@ordero/ui';
import { useState } from 'react';
import { PRODUCT_GENERATION_MODE } from './constants';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import { GeneratedProductVariantList } from './GeneratedProductVariantList';
import type {
  EditGeneratedProductVariantAttributesProps,
  GeneratedProductVariantsProps,
} from './types';
import { getInvalidProductVariantIndexes } from './utils/productVariantErrors';

const EditGeneratedProductVariantAttributes = ({
  allowMultipleValuesPerAttribute,
  attributes,
  productVariantsCreationForm,
  onOpenChange,
  variantIndex,
}: EditGeneratedProductVariantAttributesProps) => (
  <productVariantsCreationForm.Field
    name={`productVariants[${variantIndex}].attributeValueIds` as const}
  >
    {(attributeValueIdsField) => (
      <productVariantsCreationForm.Field
        name={`productVariants[${variantIndex}].name` as const}
      >
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
      </productVariantsCreationForm.Field>
    )}
  </productVariantsCreationForm.Field>
);

export const GeneratedProductVariants = ({
  productVariantsCreationForm,
  generatedAttributes,
  generationMode,
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
    <productVariantsCreationForm.Subscribe
      selector={(state) =>
        [
          state.isSubmitting,
          state.submissionAttempts,
          state.values.productVariants.length,
        ] as const
      }
    >
      {([, , productVariantCount]) => {
        const invalidVariantIndexes = getInvalidProductVariantIndexes(
          productVariantsCreationForm.state.fieldMeta
        );

        return productVariantCount > 0 ? (
          <div className="mt-3">
            <Typography variant="h5">Generated product variants</Typography>
            <GeneratedProductVariantList
              attributes={generatedAttributes}
              productVariantsCreationForm={productVariantsCreationForm}
              invalidVariantIndexes={invalidVariantIndexes}
              onEditAttributes={setEditingVariantIndex}
              productVariantCount={productVariantCount}
              requireAttributeValueIds={
                generationMode === PRODUCT_GENERATION_MODE.many
              }
            />

            {editingVariantIndex !== null ? (
              <EditGeneratedProductVariantAttributes
                allowMultipleValuesPerAttribute={
                  generationMode === PRODUCT_GENERATION_MODE.one
                }
                attributes={generatedAttributes}
                productVariantsCreationForm={productVariantsCreationForm}
                onOpenChange={handleAttributesDialogOpenChange}
                variantIndex={editingVariantIndex}
              />
            ) : null}
          </div>
        ) : null;
      }}
    </productVariantsCreationForm.Subscribe>
  );
};
