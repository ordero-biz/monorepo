import { Textarea, TextField } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { ProductCategoryCombobox } from '../../shared/ProductCategoryCombobox';
import { ProductImageDropzone } from './ProductImageDropzone';
import { ProductStatusSelector } from './ProductStatusSelector';
import type { CommonProductFieldInputsProps } from './types';
import {
  validateProductCategory,
  validateProductName,
  validateProductStatus,
} from './utils/validations';

export const CommonProductFieldInputs = ({
  productVariantsCreationForm,
}: CommonProductFieldInputsProps) => {
  const submissionAttempts = useStore(
    productVariantsCreationForm.store,
    (state) => state.submissionAttempts
  );

  return (
    <div className="grid gap-[var(--space-3)] lg:grid-cols-[1fr_1fr_0.5fr] lg:items-start">
      <div className="grid gap-[var(--space-3)] lg:col-span-2 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col gap-[var(--space-2)]">
          <productVariantsCreationForm.Field
            name="name"
            validators={{
              onBlur: validateProductName,
              onChange: validateProductName,
              onSubmit: validateProductName,
            }}
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
              onSubmit: validateProductCategory,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

              return (
                <ProductCategoryCombobox
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

          <productVariantsCreationForm.Field
            name="status"
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
                  label="Product status"
                  name={field.name}
                  onValueChange={field.handleChange}
                  value={field.state.value}
                />
              );
            }}
          </productVariantsCreationForm.Field>
        </div>

        <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
          <productVariantsCreationForm.Field name="description">
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

              return (
                <Textarea
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Description"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder="Description"
                  resize="none"
                  rows={2}
                  value={field.state.value}
                />
              );
            }}
          </productVariantsCreationForm.Field>
        </div>
      </div>

      <ProductImageDropzone
        className="aspect-square w-full"
        titleId="common-product-add-image-title"
      />
    </div>
  );
};
