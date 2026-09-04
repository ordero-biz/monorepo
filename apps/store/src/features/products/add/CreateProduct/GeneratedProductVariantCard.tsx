import {
  Card,
  Chip,
  FieldHelperText,
  FieldLabel,
  IconButton,
  Textarea,
  TextField,
  Typography,
} from '@ordero/ui';
import { Pencil, Plus } from 'lucide-react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { ProductImageDropzone } from './ProductImageDropzone';
import type { GeneratedProductVariantCardProps } from './types';
import { getProductVariantAttributeValues } from './utils/productGeneration';

export const GeneratedProductVariantCard = ({
  attributes,
  form,
  onEditAttributes,
  requireAttributeValueIds,
  variantIndex,
}: GeneratedProductVariantCardProps) => (
  <form.Field name={`productVariants[${variantIndex}].name` as const}>
    {(nameField) => {
      const nameErrorText = getFieldSubmitChangeErrorText(nameField.state.meta);
      const productVariantName = nameField.state.value;

      return (
        <Card.Root variant="outlined">
          <Card.Content>
            <div className="flex flex-col mb-2 gap-[var(--space-3)]">
              <div className="flex items-center justify-between gap-[var(--space-2)]">
                <Typography variant="subtitle1">
                  {productVariantName}
                </Typography>
              </div>

              <div className="grid gap-[var(--space-2)] lg:grid-cols-[1fr_1fr_0.9fr]">
                <div className="flex flex-col gap-[var(--space-2)]">
                  <TextField
                    errorText={nameErrorText}
                    invalid={Boolean(nameErrorText)}
                    label="Product variant name"
                    name={nameField.name}
                    onBlur={nameField.handleBlur}
                    onValueChange={nameField.handleChange}
                    required
                    size="s"
                    value={productVariantName}
                  />
                  <form.Field
                    name={`productVariants[${variantIndex}].barcode` as const}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <TextField
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Barcode"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          placeholder="Barcode"
                          required
                          size="s"
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>
                  <form.Field
                    name={`productVariants[${variantIndex}].sku` as const}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <TextField
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="SKU"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          placeholder="SKU"
                          required
                          size="s"
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>
                </div>

                <div className="flex flex-col gap-[var(--space-2)]">
                  <form.Field
                    name={
                      `productVariants[${variantIndex}].description` as const
                    }
                  >
                    {(field) => (
                      <Textarea
                        label="Description"
                        name={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                        placeholder="Description"
                        resize="none"
                        rows={3}
                        value={field.state.value}
                      />
                    )}
                  </form.Field>
                </div>

                <div className="flex flex-col gap-[var(--space-1)]">
                  <ProductImageDropzone
                    titleId={`product-variant-${variantIndex}-add-image-title`}
                  />
                </div>
              </div>

              <form.Field
                name={
                  `productVariants[${variantIndex}].attributeValueIds` as const
                }
              >
                {(attributeValueIdsField) => {
                  const validationErrorText = getFieldSubmitChangeErrorText(
                    attributeValueIdsField.state.meta
                  );
                  const hasNoAttributeValues =
                    attributeValueIdsField.state.value.length === 0;
                  const errorText =
                    validationErrorText ??
                    (requireAttributeValueIds && hasNoAttributeValues
                      ? 'Select at least one attribute value'
                      : undefined);
                  const selectedAttributeValues =
                    getProductVariantAttributeValues(
                      attributes,
                      attributeValueIdsField.state.value
                    );

                  return attributes.length > 0 ? (
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
                                    selectedAttributeValueId !==
                                    attributeValue.id
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
                  ) : null;
                }}
              </form.Field>
            </div>
          </Card.Content>
        </Card.Root>
      );
    }}
  </form.Field>
);
