import { Accordion, Typography } from '@ordero/ui';
import { useEffect, useRef, useState } from 'react';
import { PRODUCT_GENERATION_MODE } from './constants';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import { GeneratedProductVariantCard } from './GeneratedProductVariantCard';
import { useIncrementalProductVariants } from './hooks/useIncrementalProductVariants';
import type {
  EditGeneratedProductVariantAttributesProps,
  GeneratedProductVariantListProps,
  GeneratedProductVariantsProps,
} from './types';

const getInvalidProductVariantIndexes = (fieldMeta: object) => {
  const invalidVariantIndexes = new Set<number>();

  Object.entries(fieldMeta).forEach(([fieldName, meta]) => {
    const match = /^productVariants\[(\d+)\]\./.exec(fieldName);

    if (
      !match ||
      !meta ||
      typeof meta !== 'object' ||
      !('errors' in meta) ||
      !Array.isArray(meta.errors) ||
      meta.errors.length === 0
    ) {
      return;
    }

    invalidVariantIndexes.add(Number(match[1]));
  });

  return Array.from(invalidVariantIndexes);
};

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

const GeneratedProductVariantList = ({
  attributes,
  productVariantsCreationForm,
  invalidVariantIndexes,
  onEditAttributes,
  productVariantCount,
  requireAttributeValueIds,
}: GeneratedProductVariantListProps) => {
  const { hasMoreVariants, loadMoreRef, visibleVariantIndexes } =
    useIncrementalProductVariants({
      productVariantCount,
    });
  const [expandedVariantIds, setExpandedVariantIds] = useState(() =>
    visibleVariantIndexes.map(String)
  );
  const previousVisibleVariantIndexesRef = useRef(
    new Set(visibleVariantIndexes)
  );

  useEffect(() => {
    const previousVisibleVariantIndexes =
      previousVisibleVariantIndexesRef.current;
    const newlyVisibleVariantIndexes = visibleVariantIndexes.filter(
      (variantIndex) => !previousVisibleVariantIndexes.has(variantIndex)
    );

    previousVisibleVariantIndexesRef.current = new Set(visibleVariantIndexes);

    if (newlyVisibleVariantIndexes.length === 0) {
      return;
    }

    setExpandedVariantIds((currentIds) => {
      const nextIds = new Set(currentIds);

      newlyVisibleVariantIndexes.forEach((variantIndex) => {
        nextIds.add(String(variantIndex));
      });

      return nextIds.size === currentIds.length
        ? currentIds
        : Array.from(nextIds);
    });
  }, [visibleVariantIndexes]);

  useEffect(() => {
    if (invalidVariantIndexes.length === 0) {
      return;
    }

    const visibleVariantIndexesSet = new Set(visibleVariantIndexes);
    const visibleInvalidVariantIndexes = invalidVariantIndexes.filter(
      (variantIndex) => visibleVariantIndexesSet.has(variantIndex)
    );

    if (visibleInvalidVariantIndexes.length === 0) {
      return;
    }

    setExpandedVariantIds((currentIds) => {
      const nextIds = new Set(currentIds);

      visibleInvalidVariantIndexes.forEach((variantIndex) => {
        nextIds.add(String(variantIndex));
      });

      return nextIds.size === currentIds.length
        ? currentIds
        : Array.from(nextIds);
    });
  }, [invalidVariantIndexes, visibleVariantIndexes]);

  return (
    <Accordion.Root
      aria-label="Generated product variants"
      multiple
      onValueChange={setExpandedVariantIds}
      value={expandedVariantIds}
    >
      {visibleVariantIndexes.map((variantIndex) => (
        <GeneratedProductVariantCard
          attributes={attributes}
          productVariantsCreationForm={productVariantsCreationForm}
          key={variantIndex}
          onEditAttributes={onEditAttributes}
          requireAttributeValueIds={requireAttributeValueIds}
          variantIndex={variantIndex}
        />
      ))}
      {hasMoreVariants ? (
        <div aria-hidden="true" className="h-px" ref={loadMoreRef} />
      ) : null}
    </Accordion.Root>
  );
};

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
