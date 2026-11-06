import { Chip, FieldHelperText, FieldLabel, IconButton } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { Pencil, Plus } from 'lucide-react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { getProductVariantAttributeValues } from '../../add/CreateProduct/utils/productGeneration';
import type { ProductVariantAttributesProps } from './types';

export const ProductVariantAttributes = ({
  attributes,
  productVariantsCreationForm,
  onEditAttributes,
  requireAttributeValueIds,
  variantIndex,
  productVariantName,
}: ProductVariantAttributesProps) => {
  const submissionAttempts = useStore(
    productVariantsCreationForm.store,
    (state) => state.submissionAttempts
  );

  // Collapsing details must not unregister the field and clear its form errors.
  const fieldName =
    `productVariants[${variantIndex}].attributeValueIds` as const;
  const attributeValueIds =
    useStore(
      productVariantsCreationForm.store,
      (state) => state.values.productVariants[variantIndex]?.attributeValueIds
    ) ?? [];
  const meta = useStore(
    productVariantsCreationForm.store,
    (state) => state.fieldMeta[fieldName]
  );
  const validationErrorText = meta
    ? getFieldSubmitChangeErrorText(meta, submissionAttempts)
    : undefined;
  const errorText =
    validationErrorText ??
    (requireAttributeValueIds && attributeValueIds.length === 0
      ? 'Select at least one attribute value'
      : undefined);
  const selectedAttributeValues = getProductVariantAttributeValues(
    attributes,
    attributeValueIds
  );

  return (
    <div className="flex flex-col gap-[var(--space-0-5)]">
      <FieldLabel
        as="span"
        invalid={Boolean(errorText)}
        required={requireAttributeValueIds}
      >
        Attributes
      </FieldLabel>
      <div
        aria-label={`Attributes for ${productVariantName}`}
        className="flex flex-wrap items-center gap-[var(--space-1)]"
        role="treegrid"
      >
        {selectedAttributeValues.map((attributeValue) => (
          <Chip
            aria-label={attributeValue.name}
            key={attributeValue.id}
            onDelete={() => {
              productVariantsCreationForm.setFieldValue(
                fieldName,
                attributeValueIds.filter(
                  (selectedAttributeValueId) =>
                    selectedAttributeValueId !== attributeValue.id
                )
              );
            }}
            size="s"
            variant="soft"
          >
            {attributeValue.name}
          </Chip>
        ))}
        {selectedAttributeValues.length === 0 ? (
          <IconButton
            aria-label={`Add attributes for ${productVariantName}`}
            onClick={() => onEditAttributes(variantIndex)}
            size="xs"
            title={`Add attributes for ${productVariantName}`}
            type="button"
          >
            <Plus aria-hidden="true" />
          </IconButton>
        ) : null}
        {selectedAttributeValues.length > 0 ? (
          <IconButton
            aria-label={`Edit attributes for ${productVariantName}`}
            onClick={() => onEditAttributes(variantIndex)}
            size="xs"
            title={`Edit attributes for ${productVariantName}`}
            type="button"
          >
            <Pencil aria-hidden="true" />
          </IconButton>
        ) : null}
      </div>
      {errorText ? (
        <FieldHelperText invalid>{errorText}</FieldHelperText>
      ) : null}
    </div>
  );
};
