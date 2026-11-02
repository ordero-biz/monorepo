import { Accordion, Textarea, TextField } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { memo, useState } from 'react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { ProductImageDropzone } from './ProductImageDropzone';
import { ProductStatusSelector } from './ProductStatusSelector';
import { ProductVariantAttributes } from './ProductVariantAttributes';
import type { GeneratedProductVariantCardProps } from './types';
import { validateProductStatus } from './utils/validations';

export const GeneratedProductVariantCard = memo(
  ({
    attributes,
    hasErrors,
    productVariantsCreationForm,
    onEditAttributes,
    requireAttributeValueIds,
    variantIndex,
  }: GeneratedProductVariantCardProps) => {
    const submissionAttempts = useStore(
      productVariantsCreationForm.store,
      (state) => state.submissionAttempts
    );

    // Base UI re-applies `data-starting-style` (opacity: 0) to an open panel when
    // `keepMounted` flips from true to false and never removes it, so a card
    // whose errors were fixed would turn invisible. Only ever turn it on.
    const [keepPanelMounted, setKeepPanelMounted] = useState(hasErrors);

    if (hasErrors && !keepPanelMounted) {
      setKeepPanelMounted(true);
    }

    return (
      <productVariantsCreationForm.Field
        name={`productVariants[${variantIndex}].name` as const}
      >
        {(nameField) => {
          const nameErrorText = getFieldSubmitChangeErrorText(
            nameField.state.meta,
            submissionAttempts
          );
          const productVariantName = nameField.state.value;

          return (
            <Accordion.Item value={String(variantIndex)}>
              <Accordion.Header>
                <Accordion.Trigger>{productVariantName}</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel keepMounted={keepPanelMounted}>
                <div className="flex flex-col gap-[var(--space-3)]">
                  <div className="grid gap-[var(--space-2)] lg:grid-cols-[1fr_1fr_0.5fr]">
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
                      <productVariantsCreationForm.Field
                        name={
                          `productVariants[${variantIndex}].barcode` as const
                        }
                      >
                        {(field) => {
                          const errorText = getFieldSubmitChangeErrorText(
                            field.state.meta,
                            submissionAttempts
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
                      </productVariantsCreationForm.Field>
                      <productVariantsCreationForm.Field
                        name={`productVariants[${variantIndex}].sku` as const}
                      >
                        {(field) => {
                          const errorText = getFieldSubmitChangeErrorText(
                            field.state.meta,
                            submissionAttempts
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
                      </productVariantsCreationForm.Field>
                      <productVariantsCreationForm.Field
                        name={
                          `productVariants[${variantIndex}].status` as const
                        }
                        validators={{
                          onChange: validateProductStatus,
                          onSubmit: validateProductStatus,
                        }}
                      >
                        {(field) => {
                          const errorText = getFieldSubmitChangeErrorText(
                            field.state.meta,
                            submissionAttempts
                          );

                          return (
                            <ProductStatusSelector
                              errorText={errorText}
                              invalid={Boolean(errorText)}
                              label="Product variant status"
                              name={field.name}
                              onValueChange={field.handleChange}
                              value={field.state.value}
                            />
                          );
                        }}
                      </productVariantsCreationForm.Field>
                    </div>

                    <div className="flex flex-col gap-[var(--space-2)]">
                      <productVariantsCreationForm.Field
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
                      </productVariantsCreationForm.Field>
                    </div>

                    <div className="flex flex-col gap-[var(--space-1)]">
                      <ProductImageDropzone
                        titleId={`product-variant-${variantIndex}-add-image-title`}
                      />
                    </div>
                  </div>

                  <ProductVariantAttributes
                    attributes={attributes}
                    productVariantsCreationForm={productVariantsCreationForm}
                    onEditAttributes={onEditAttributes}
                    requireAttributeValueIds={requireAttributeValueIds}
                    variantIndex={variantIndex}
                    productVariantName={productVariantName}
                  />
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          );
        }}
      </productVariantsCreationForm.Field>
    );
  }
);

GeneratedProductVariantCard.displayName = 'GeneratedProductVariantCard';
