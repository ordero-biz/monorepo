'use client';

import {
  Button,
  Card,
  IconButton,
  Select,
  TextField,
  Typography,
} from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { Plus } from 'lucide-react';
import { useProductsCategoriesQuery } from '@/lib/hooks/products/useProductsCategoriesQuery';
import { productAddDefaultValues } from './constants';

export const ProductAddForm = () => {
  const categoriesQuery = useProductsCategoriesQuery();
  const form = useForm({
    defaultValues: productAddDefaultValues,
    onSubmit: () => undefined,
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
              <div className="flex flex-col gap-[var(--space-2)]">
                <form.Field name="productName">
                  {(field) => (
                    <TextField
                      label="Product name"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                      placeholder="Product name"
                      size="s"
                      value={field.state.value}
                    />
                  )}
                </form.Field>

                <form.Field name="category">
                  {(field) => (
                    <Select
                      label="Category"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                      disabled={categoriesQuery.isPending}
                      errorText={
                        categoriesQuery.isError
                          ? "We couldn't load categories right now."
                          : undefined
                      }
                      helperText={
                        categoriesQuery.isPending
                          ? 'Loading categories...'
                          : undefined
                      }
                      invalid={categoriesQuery.isError}
                      options={categoriesQuery.categoryOptions}
                      placeholder="Select category"
                      size="s"
                      value={field.state.value}
                    />
                  )}
                </form.Field>
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

              <section
                aria-labelledby="product-add-tips-title"
                className="flex aspect-square min-h-[var(--space-20)] items-center justify-center rounded-[var(--radius)] border border-input bg-background p-[var(--space-3)]"
              >
                <Typography id="product-add-tips-title" variant="subtitle1">
                  Tips section
                </Typography>
              </section>
            </div>

            <div className="flex justify-end">
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    size="l"
                    type="submit"
                  >
                    Add product
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </form>
  );
};
