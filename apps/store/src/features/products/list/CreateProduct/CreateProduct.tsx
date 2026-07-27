'use client';

import {
  Button,
  Card,
  FieldHelperText,
  IconButton,
  Select,
  Textarea,
  TextField,
  ToggleButton,
  Typography,
} from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import { useAttributesQuery } from '@/lib/hooks/attributes/useAttributesQuery';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { CategoriesAsyncCombobox } from './CategoriesAsyncCombobox';
import { PRODUCT_GENERATION_MODE } from './constants';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import type { ProductGenerationMode } from './types';
import {
  validateProductCategory,
  validateProductName,
} from './utils/validations';

export const CreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [generationMode, setGenerationMode] = useState<ProductGenerationMode>(
    PRODUCT_GENERATION_MODE.one
  );
  const isMultipleProducts = generationMode === PRODUCT_GENERATION_MODE.many;

  const attributesQuery = useAttributesQuery();
  const attributeOptions = useMemo(
    () =>
      attributesQuery.data?.content.map((attribute) => ({
        label: attribute.name,
        value: String(attribute.id),
      })) ?? [],
    [attributesQuery.data]
  );

  const { form } = useCreateProductForm({
    onCreated: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productGroupsQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: productVariantsQueryKeys.list,
        }),
      ]);
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
                        isMultipleProducts && !value
                          ? 'Select at least one attribute.'
                          : undefined,
                      onSubmit: ({ value }) =>
                        isMultipleProducts && !value
                          ? 'Select at least one attribute.'
                          : undefined,
                    }}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );
                      const attributesErrorText = attributesQuery.isError
                        ? "We couldn't load attributes right now."
                        : errorText;

                      return (
                        <Select
                          disabled={attributesQuery.isPending}
                          errorText={attributesErrorText}
                          helperText={
                            isMultipleProducts
                              ? 'You must select attributes to generate multiple products'
                              : 'Optional: Add attributes for a single product'
                          }
                          invalid={Boolean(attributesErrorText)}
                          label="Attributes"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          options={attributeOptions}
                          placeholder="Select attributes"
                          required={isMultipleProducts}
                          size="s"
                          value={field.state.value}
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

            <div className="flex justify-end">
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
                    (isMultipleProducts && !attributes);
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
                      <FieldHelperText align="end">
                        {helperText}
                      </FieldHelperText>
                    </div>
                  );
                }}
              </form.Subscribe>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </form>
  );
};
