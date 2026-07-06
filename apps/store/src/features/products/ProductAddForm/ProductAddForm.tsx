'use client';

import {
  Button,
  Card,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  TextField,
  Typography,
} from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { useProductsCategoriesSelectQuery } from '@/lib/hooks/products/useProductsCategoriesSelectQuery';
import { productsQueryKeys } from '@/lib/query/products/productsQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useCreateProductForm } from './hooks/useCreateProductForm';

export const ProductAddForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const categoriesQuery = useProductsCategoriesSelectQuery();
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
            <Typography variant="h4">Add product</Typography>

            <div className="grid gap-[var(--space-3)] lg:grid-cols-3 lg:items-start">
              <div className="grid gap-[var(--space-3)] lg:col-span-2 lg:grid-cols-2 lg:items-stretch">
                <div className="flex flex-col gap-[var(--space-2)]">
                  <form.Field name="productName">
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <TextField
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Product name"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          placeholder="Product name"
                          size="s"
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>

                  <RadioGroup
                    defaultValue="generate-one"
                    label="Product generating mode"
                    name="productGeneratingMode"
                  >
                    <Radio value="generate-one">Generate one product</Radio>
                    <Radio value="generate-many">Generate many products</Radio>
                  </RadioGroup>

                  <form.Field name="category">
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );
                      const categoryErrorText = categoriesQuery.isError
                        ? "We couldn't load categories right now."
                        : errorText;

                      return (
                        <Select
                          disabled={categoriesQuery.isPending}
                          errorText={categoryErrorText}
                          helperText={
                            categoriesQuery.isPending
                              ? 'Loading categories...'
                              : undefined
                          }
                          invalid={
                            categoriesQuery.isError || Boolean(errorText)
                          }
                          label="Category"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          options={categoriesQuery.categoryOptions}
                          placeholder="Select category"
                          size="s"
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>

                  <Select
                    label="Attributes"
                    options={[]}
                    placeholder="Select attributes"
                    size="s"
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
                  <form.Field name="description">
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );
                      const errorId = 'product-add-description-error';

                      return (
                        <div>
                          <label
                            className={
                              errorText
                                ? 'mb-[6px] block text-[length:var(--input-label-size-desktop)] leading-[var(--input-label-line-height-desktop)] font-[var(--input-label-weight)] text-destructive'
                                : 'mb-[6px] block text-[length:var(--input-label-size-desktop)] leading-[var(--input-label-line-height-desktop)] font-[var(--input-label-weight)] text-[var(--text-secondary)]'
                            }
                            htmlFor="product-add-description"
                          >
                            Description
                          </label>
                          <Textarea
                            aria-describedby={errorText ? errorId : undefined}
                            id="product-add-description"
                            invalid={Boolean(errorText)}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onValueChange={field.handleChange}
                            value={field.state.value}
                          />
                          {errorText ? (
                            <p
                              className="flex items-start gap-[var(--form-helper-text-spacing)] pl-[var(--form-helper-text-pl)] pt-[var(--form-helper-text-pt)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-destructive"
                              id={errorId}
                            >
                              {errorText}
                            </p>
                          ) : null}
                        </div>
                      );
                    }}
                  </form.Field>
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
                    state.values.category,
                    state.isSubmitting,
                  ] as const
                }
              >
                {([productName, category, isSubmitting]) => {
                  const isSubmitDisabled =
                    isSubmitting || !productName.trim() || !category;

                  return (
                    <Button
                      color="primary"
                      disabled={isSubmitDisabled}
                      size="l"
                      type="submit"
                    >
                      {isSubmitting ? 'Adding product...' : 'Add product'}
                    </Button>
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
