import { Textarea, TextField } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  ProductImageDropzone,
  ProductStatusSelector,
  validateProductCategory,
  validateProductName,
  validateProductStatus,
} from '../../add/CreateProduct';
import { productStatusDescriptions } from '../../add/CreateProduct/constants';
import { ProductCategoryCombobox } from '../../shared/ProductCategoryCombobox';
import type { ProductTemplateFieldsProps } from './types';

export const ProductTemplateFields = ({
  productVariantsGenerationForm,
}: ProductTemplateFieldsProps) => {
  const submissionAttempts = useStore(
    productVariantsGenerationForm.store,
    (state) => state.submissionAttempts
  );

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <div className="grid gap-[var(--space-2)] md:grid-cols-[minmax(0,1fr)_minmax(var(--space-18),0.27fr)] md:items-start">
        <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
          <div className="grid items-start gap-[var(--space-2)] md:grid-cols-2">
            <productVariantsGenerationForm.Field
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
                    label="Product name"
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    required
                    size="s"
                    value={field.state.value}
                  />
                );
              }}
            </productVariantsGenerationForm.Field>
            <productVariantsGenerationForm.Field
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
                    label="Category"
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    required
                    size="s"
                    value={field.state.value}
                  />
                );
              }}
            </productVariantsGenerationForm.Field>
          </div>
          <div className="grid items-start gap-[var(--space-2)] md:grid-cols-2">
            <productVariantsGenerationForm.Field name="description">
              {(field) => {
                const errorText = getFieldSubmitChangeErrorText(
                  field.state.meta,
                  submissionAttempts
                );
                return (
                  <Textarea
                    label="Description"
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    resize="none"
                    rows={5}
                    value={field.state.value}
                  />
                );
              }}
            </productVariantsGenerationForm.Field>
            <productVariantsGenerationForm.Field
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
                    {...productStatusDescriptions}
                    activeDescription="Allow active variants to be supplied and sold. Choose individual variant statuses in the next step."
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    label="Status after creation"
                    name={field.name}
                    onValueChange={field.handleChange}
                    value={field.state.value}
                  />
                );
              }}
            </productVariantsGenerationForm.Field>
          </div>
        </div>
        <ProductImageDropzone
          className="aspect-square w-full min-w-0 text-center"
          titleId="product-add2-image-title"
        />
      </div>
    </div>
  );
};
