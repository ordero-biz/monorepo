'use client';

import {
  Button,
  Card,
  FieldHelperText,
  IconButton,
  Textarea,
  TextField,
  ToggleButton,
  Typography,
} from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import type { AttributeDropdown } from '@/lib/domain/attributes';
import { productsQueryKeys } from '@/lib/query/products/productsQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { AttributesAsyncCombobox } from './AttributesAsyncCombobox';
import { CategoriesAsyncCombobox } from './CategoriesAsyncCombobox';
import { PRODUCT_GENERATION_MODE } from './constants';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import type { ProductGenerationMode } from './types';
import {
  validateProductCategory,
  validateProductName,
} from './utils/validations';

const getAttributeValueSelections = (
  currentValue: Record<string, string[]>,
  attributes: AttributeDropdown[]
) =>
  Object.fromEntries(
    attributes.map((attribute) => {
      const attributeId = String(attribute.id);
      const availableValueIds = new Set(
        attribute.attributeValues.map((attributeValue) =>
          String(attributeValue.id)
        )
      );

      return [
        attributeId,
        (currentValue[attributeId] ?? []).filter((attributeValueId) =>
          availableValueIds.has(attributeValueId)
        ),
      ];
    })
  );

export const CreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [generationMode, setGenerationMode] = useState<ProductGenerationMode>(
    PRODUCT_GENERATION_MODE.one
  );
  const isMultipleProducts = generationMode === PRODUCT_GENERATION_MODE.many;

  const { form } = useCreateProductForm({
    onCreated: async () => {
      await queryClient.invalidateQueries({
        queryKey: productsQueryKeys.list,
      });
      router.push(clientRoutes.products);
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <Card.Root>
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-4)]">
            <Typography variant="h4">Create product template</Typography>

            <div className="grid gap-[var(--space-3)] lg:grid-cols-[1fr_1fr_0.5fr] lg:items-start">
              <div className="grid gap-[var(--space-3)] lg:col-span-2 lg:grid-cols-2 lg:items-stretch">
                <div className="flex flex-col gap-[var(--space-2)]">
                  <form.Field
                    name="productName"
                    validators={{
                      onChange: validateProductName,
                      onSubmit: validateProductName,
                    }}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <TextField
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Base product name"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          required
                          size="s"
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>

                  <form.Field
                    name="category"
                    validators={{
                      onChange: validateProductCategory,
                      onSubmit: validateProductCategory,
                    }}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <CategoriesAsyncCombobox
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Category"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          placeholder="Select category"
                          size="s"
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>

                  <form.Field
                    name="attributes"
                    validators={{
                      onChange: ({ value }) =>
                        isMultipleProducts && value.length === 0
                          ? 'Select at least one attribute.'
                          : undefined,
                      onSubmit: ({ value }) =>
                        isMultipleProducts && value.length === 0
                          ? 'Select at least one attribute.'
                          : undefined,
                    }}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <AttributesAsyncCombobox
                          errorText={errorText}
                          helperText={
                            isMultipleProducts
                              ? 'You must select attributes to generate multiple products'
                              : 'Optional: Add attributes for a single product'
                          }
                          invalid={Boolean(errorText)}
                          label="Attributes"
                          multiple
                          name={field.name}
                          onBlur={field.handleBlur}
                          onSelectedAttributesChange={(attributes) => {
                            field.handleChange(attributes);
                            form.setFieldValue(
                              'attributeValues',
                              (currentValue) =>
                                getAttributeValueSelections(
                                  currentValue,
                                  attributes
                                )
                            );
                          }}
                          placeholder="Select attributes"
                          required={isMultipleProducts}
                          selectedAttributes={field.state.value}
                          size="s"
                          value={field.state.value.map((attribute) =>
                            String(attribute.id)
                          )}
                        />
                      );
                    }}
                  </form.Field>
                </div>

                <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
                  <form.Field name="description">
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <Textarea
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Description"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          resize="none"
                          rows={2}
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>

                  <ToggleButton.Group
                    defaultValue={[PRODUCT_GENERATION_MODE.one]}
                    label="Creation mode"
                    onValueChange={(value) =>
                      setGenerationMode(
                        (value[0] as ProductGenerationMode) ??
                          PRODUCT_GENERATION_MODE.one
                      )
                    }
                    orientation="horizontal"
                    size="s"
                  >
                    <ToggleButton.Item value={PRODUCT_GENERATION_MODE.one}>
                      Single product
                    </ToggleButton.Item>
                    <ToggleButton.Item value={PRODUCT_GENERATION_MODE.many}>
                      Multiple products
                    </ToggleButton.Item>
                  </ToggleButton.Group>
                </div>
              </div>

              <section
                aria-labelledby="product-add-image-title"
                className="flex aspect-square min-h-[var(--space-20)] w-full flex-col items-center justify-center gap-[var(--space-1)] rounded-[var(--radius)] border border-dashed border-input bg-muted p-[var(--space-3)] text-muted-foreground"
              >
                <IconButton
                  aria-label="Add product image"
                  color="primary"
                  size="l"
                  type="button"
                >
                  <Plus aria-hidden="true" />
                </IconButton>
                <Typography
                  color="text-secondary"
                  id="product-add-image-title"
                  variant="caption"
                >
                  Add product image
                </Typography>
              </section>
            </div>
            <form.Field name="attributeValues">
              {(field) => (
                <form.Subscribe selector={(state) => state.values.attributes}>
                  {(attributes) =>
                    attributes.length > 0 ? (
                      <fieldset
                        aria-label="Attribute values"
                        className="m-0 flex flex-col gap-[var(--space-2)] border-0 p-0"
                      >
                        {attributes.map((attribute) => {
                          const attributeId = String(attribute.id);
                          const selectedAttributeValueIds =
                            field.state.value[attributeId] ?? [];

                          return (
                            <div
                              className="flex flex-wrap items-center gap-[var(--space-1)]"
                              key={attribute.id}
                            >
                              <span className="font-medium text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)]">
                                {attribute.name}:
                              </span>
                              {attribute.attributeValues.map(
                                (attributeValue) => {
                                  const attributeValueId = String(
                                    attributeValue.id
                                  );

                                  return (
                                    <ToggleButton.Item
                                      key={attributeValue.id}
                                      onPressedChange={(pressed) => {
                                        field.handleChange({
                                          ...field.state.value,
                                          [attributeId]: pressed
                                            ? [
                                                ...selectedAttributeValueIds,
                                                attributeValueId,
                                              ]
                                            : selectedAttributeValueIds.filter(
                                                (selectedAttributeValueId) =>
                                                  selectedAttributeValueId !==
                                                  attributeValueId
                                              ),
                                        });
                                      }}
                                      pressed={selectedAttributeValueIds.includes(
                                        attributeValueId
                                      )}
                                      size="s"
                                      type="button"
                                    >
                                      {attributeValue.name}
                                    </ToggleButton.Item>
                                  );
                                }
                              )}
                            </div>
                          );
                        })}
                      </fieldset>
                    ) : null
                  }
                </form.Subscribe>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) =>
                [
                  state.values.productName,
                  state.values.attributes,
                  state.values.category,
                  state.isSubmitting,
                ] as const
              }
            >
              {([productName, attributes, category, isSubmitting]) => {
                const isSubmitDisabled =
                  isSubmitting ||
                  !productName.trim() ||
                  !category ||
                  (isMultipleProducts && attributes.length === 0);
                const helperText = isMultipleProducts
                  ? 'You will proceed to configure products based on selected attributes'
                  : 'You will proceed to configure 1 product';

                return (
                  <div className="flex flex-col items-end gap-[var(--space-1)]">
                    <Button
                      color="primary"
                      disabled={isSubmitDisabled}
                      size="l"
                      type="submit"
                    >
                      {isSubmitting
                        ? 'Generating products...'
                        : isMultipleProducts
                          ? 'Next: Configure products'
                          : 'Next: Configure product'}
                    </Button>
                    <FieldHelperText align="end">{helperText}</FieldHelperText>
                  </div>
                );
              }}
            </form.Subscribe>
          </div>
        </Card.Content>
      </Card.Root>
    </form>
  );
};
