import { DataTable, Typography } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { useEffect, useMemo, useState } from 'react';
import {
  EditGeneratedProductVariantAttributes,
  PRODUCT_GENERATION_MODE,
  useIncrementalProductVariants,
} from '../../add/CreateProduct';
import { getInvalidProductVariantIndexes } from '../../add/CreateProduct/utils/productVariantErrors';
import { getColumns } from './columns';
import { ProductVariantDetails } from './ProductVariantDetails';
import type { ProductVariantsTableProps } from './types';

// Generated variants have a fixed order and no removal/reordering in this step.
const getRowId = (variantIndex: number) => String(variantIndex);
const productVariantDetailFields = [
  'description',
  'attributeValueIds',
] as const;

export const ProductVariantsTable = ({
  productVariantsCreationForm: form,
  generatedAttributes,
  generationMode,
}: ProductVariantsTableProps) => {
  const variantNames = useStore(
    form.store,
    (state) => state.values.productVariants.map((variant) => variant.name),
    (previous, next) =>
      previous.length === next.length &&
      previous.every((name, index) => name === next[index])
  );

  const invalidDetailIndexes = useStore(form.store, (state) =>
    getInvalidProductVariantIndexes(
      state.fieldMeta,
      productVariantDetailFields
    ).join(',')
  );

  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts
  );

  const { visibleVariantIndexes, hasMoreVariants, loadMoreRef } =
    useIncrementalProductVariants({ productVariantCount: variantNames.length });

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!invalidDetailIndexes || submissionAttempts === 0) return;
    setExpandedRows((current) => ({
      ...current,
      ...Object.fromEntries(
        invalidDetailIndexes.split(',').map((index) => [index, true])
      ),
    }));
  }, [invalidDetailIndexes, submissionAttempts]);

  const columns = useMemo(() => getColumns({ form }), [form]);

  if (variantNames.length === 0) return null;

  return (
    <section
      aria-label="Product variants"
      className="mt-[var(--space-3)] flex flex-col gap-[var(--space-2)]"
    >
      <DataTable
        ariaLabel="Product variants"
        header={
          <div>
            <Typography variant="h5">
              Product variants ({variantNames.length})
            </Typography>
            <Typography variant="body2" color="text-secondary">
              Edit names, SKUs, barcodes, and statuses below. Open details to
              edit attributes, description, and image.
            </Typography>
          </div>
        }
        columns={columns}
        data={visibleVariantIndexes}
        getRowId={getRowId}
        rowDetails={{
          expandedRows,
          onExpandedRowsChange: setExpandedRows,
          getLabel: (index) => variantNames[index] || `Variant ${index + 1}`,
          render: (index) => (
            <ProductVariantDetails
              attributes={generatedAttributes}
              productVariantsCreationForm={form}
              variantIndex={index}
              productVariantName={variantNames[index]}
              requireAttributeValueIds={
                generationMode === PRODUCT_GENERATION_MODE.many
              }
              onEditAttributes={setEditingVariantIndex}
            />
          ),
        }}
      />
      {hasMoreVariants ? (
        <div aria-hidden="true" className="h-px" ref={loadMoreRef} />
      ) : null}
      {editingVariantIndex !== null ? (
        <EditGeneratedProductVariantAttributes
          allowMultipleValuesPerAttribute={
            generationMode === PRODUCT_GENERATION_MODE.one
          }
          attributes={generatedAttributes}
          productVariantsCreationForm={form}
          onOpenChange={(open) => {
            if (!open) setEditingVariantIndex(null);
          }}
          variantIndex={editingVariantIndex}
        />
      ) : null}
    </section>
  );
};
