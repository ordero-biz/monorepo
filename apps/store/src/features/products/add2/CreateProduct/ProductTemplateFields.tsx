import { Textarea, TextField } from '@ordero/ui';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  ProductImageDropzone,
  validateProductCategory,
  validateProductName,
} from '../../add/CreateProduct';
import type { ProductTemplateFieldsProps } from './types';

export const ProductTemplateFields = ({
  productVariantsGenerationForm,
}: ProductTemplateFieldsProps) => (
  <div className="flex flex-col gap-[var(--space-2)]">
    <div className="grid gap-[var(--space-2)] md:grid-cols-[minmax(0,1fr)_minmax(var(--space-18),0.27fr)] md:items-start">
      <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
        <productVariantsGenerationForm.Field
          name="name"
          validators={{
            onBlur: validateProductName,
            onChange: validateProductName,
            onSubmit: validateProductName,
          }}
        >
          {(field) => {
            const errorText = getFieldSubmitChangeErrorText(field.state.meta);
            return (
              <TextField
                errorText={errorText}
                invalid={Boolean(errorText)}
                label="Product name"
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
            const errorText = getFieldSubmitChangeErrorText(field.state.meta);
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
        </productVariantsGenerationForm.Field>
      </div>
      <ProductImageDropzone
        className="aspect-square w-full min-w-0 text-center"
        titleId="product-add2-image-title"
      />
    </div>
    <productVariantsGenerationForm.Field name="description">
      {(field) => {
        const errorText = getFieldSubmitChangeErrorText(field.state.meta);
        return (
          <Textarea
            errorText={errorText}
            invalid={Boolean(errorText)}
            label="Description"
            name={field.name}
            onBlur={field.handleBlur}
            onValueChange={field.handleChange}
            placeholder="Description"
            rows={3}
            value={field.state.value}
          />
        );
      }}
    </productVariantsGenerationForm.Field>
  </div>
);
