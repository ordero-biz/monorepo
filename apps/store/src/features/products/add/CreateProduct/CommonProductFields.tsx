import { Card, Textarea, TextField, Typography } from '@ordero/ui';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { ProductImageDropzone } from './ProductImageDropzone';
import type { CommonProductFieldsProps } from './types';
import {
  validateProductCategory,
  validateProductName,
} from './utils/validations';

export const CommonProductFields = ({
  productVariantsCreationForm,
}: CommonProductFieldsProps) => (
  <Card.Root variant="filled">
    <Card.Content>
      <section aria-labelledby="common-product-heading">
        <Typography id="common-product-heading" variant="h5">
          Common product
        </Typography>
        <div className="mt-1 grid gap-[var(--space-3)] lg:grid-cols-[1fr_1fr_0.5fr] lg:items-start">
          <div className="grid gap-[var(--space-3)] lg:col-span-2 lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col gap-[var(--space-2)]">
              <productVariantsCreationForm.Field
                name="name"
                validators={{
                  onBlur: validateProductName,
                  onChange: validateProductName,
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
              </productVariantsCreationForm.Field>

              <productVariantsCreationForm.Field
                name="category"
                validators={{
                  onBlur: validateProductCategory,
                  onChange: validateProductCategory,
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
                      required
                      size="s"
                      value={field.state.value}
                    />
                  );
                }}
              </productVariantsCreationForm.Field>
            </div>

            <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
              <productVariantsCreationForm.Field name="description">
                {(field) => (
                  <Textarea
                    label="Description"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    placeholder="Description"
                    resize="none"
                    rows={2}
                    value={field.state.value}
                  />
                )}
              </productVariantsCreationForm.Field>
            </div>
          </div>

          <ProductImageDropzone
            className="aspect-square w-full"
            titleId="common-product-add-image-title"
          />
        </div>
      </section>
    </Card.Content>
  </Card.Root>
);
