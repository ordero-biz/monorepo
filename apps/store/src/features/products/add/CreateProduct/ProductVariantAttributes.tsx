import { Chip, FieldHelperText, FieldLabel, IconButton } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { Pencil, Plus } from 'lucide-react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import type { ProductVariantAttributesProps } from './types';
import { getProductVariantAttributeValues } from './utils/productGeneration';

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

  return (
    <productVariantsCreationForm.Field
      name={`productVariants[${variantIndex}].attributeValueIds` as const}
    >
      {(attributeValueIdsField) => {
        const validationErrorText = getFieldSubmitChangeErrorText(
          attributeValueIdsField.state.meta,
          submissionAttempts
        );
        const hasNoAttributeValues =
          attributeValueIdsField.state.value.length === 0;
        const errorText =
          validationErrorText ??
          (requireAttributeValueIds && hasNoAttributeValues
            ? 'Select at least one attribute value'
            : undefined);
        const selectedAttributeValues = getProductVariantAttributeValues(
          attributes,
          attributeValueIdsField.state.value
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
                    attributeValueIdsField.handleChange(
                      attributeValueIdsField.state.value.filter(
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
      }}
    </productVariantsCreationForm.Field>
  );
};
