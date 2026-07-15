import { Card, Chip, Textarea, TextField, Typography } from '@ordero/ui';
import { ProductImageDropzone } from './ProductImageDropzone';
import type { GeneratedProductVariantCardProps } from './types';
import { getProductVariantAttributeValues } from './utils/generation';

export const GeneratedProductVariantCard = ({
  attributes,
  form,
  productVariant,
  variantIndex,
}: GeneratedProductVariantCardProps) => (
  <Card.Root variant="outlined">
    <Card.Content>
      <div className="flex flex-col mb-2 gap-[var(--space-3)]">
        <div className="flex items-center justify-between gap-[var(--space-2)]">
          <Typography variant="subtitle1">{productVariant.name}</Typography>
        </div>

        <div className="grid gap-[var(--space-2)] lg:grid-cols-[1fr_1fr_0.9fr]">
          <div className="flex flex-col gap-[var(--space-2)]">
            <form.Field name={`productVariants[${variantIndex}].name` as const}>
              {(field) => (
                <TextField
                  label="Product variant name"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  size="s"
                  value={field.state.value}
                />
              )}
            </form.Field>
            <form.Field
              name={`productVariants[${variantIndex}].barcode` as const}
            >
              {(field) => (
                <TextField
                  label="Barcode"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder="Barcode"
                  size="s"
                  value={field.state.value}
                />
              )}
            </form.Field>
            <form.Field name={`productVariants[${variantIndex}].sku` as const}>
              {(field) => (
                <TextField
                  label="SKU"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder="SKU"
                  size="s"
                  value={field.state.value}
                />
              )}
            </form.Field>
          </div>

          <div className="flex flex-col gap-[var(--space-2)]">
            <form.Field
              name={`productVariants[${variantIndex}].description` as const}
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

        <div className="flex flex-wrap items-center gap-[var(--space-1)]">
          <span className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-text-secondary">
            Attributes
          </span>
          {getProductVariantAttributeValues(
            attributes,
            productVariant.attributeValueIds
          ).map((attributeValue) => (
            <Chip key={attributeValue.id} size="s" variant="outlined">
              {attributeValue.name}
            </Chip>
          ))}
        </div>
      </div>
    </Card.Content>
  </Card.Root>
);
