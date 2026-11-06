import { Button, Textarea, TextField, Typography } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { useInitialFocus } from '@/lib/hooks/accessibility/useInitialFocus';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  ProductStatusSelector,
  validateProductCategory,
  validateProductName,
  validateProductStatus,
} from '../../add/CreateProduct';
import { useProductDetailsForm } from './hooks/useProductDetailsForm';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import type { ProductDetailsEditorProps } from './types';

export const ProductDetailsEditor = ({
  initialValues,
  initialErrors,
  onApply,
  onCancel,
}: ProductDetailsEditorProps) => {
  const { form } = useProductDetailsForm({
    initialValues,
    initialErrors,
    onApply,
  });

  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts
  );

  const initialFocusRef = useInitialFocus({ preferInvalid: true });

  return (
    <div ref={initialFocusRef} className="flex flex-col gap-[var(--space-2)]">
      <div className="flex flex-wrap items-start gap-[var(--space-2)]">
        <ProductImagePlaceholder />
        <div className="grid min-w-0 flex-1 items-start gap-[var(--space-3)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
            <form.Field
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
            </form.Field>

            <form.Field
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
            </form.Field>

            <form.Field
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
                    label="Status after creation"
                    name={field.name}
                    onValueChange={field.handleChange}
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
                    rows={4}
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)]">
        <Typography color="text-secondary" variant="caption">
          Variant details stay unchanged.
        </Typography>
        <div className="flex gap-[var(--space-1)]">
          <Button onClick={onCancel} size="s" type="button" variant="outlined">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => form.handleSubmit()}
            size="s"
            type="button"
          >
            Apply changes
          </Button>
        </div>
      </div>
    </div>
  );
};
