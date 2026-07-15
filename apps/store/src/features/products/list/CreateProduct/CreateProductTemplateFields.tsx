import { Textarea, TextField, ToggleButton } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { AttributesAsyncCombobox } from './AttributesAsyncCombobox';
import { CategoriesAsyncCombobox } from './CategoriesAsyncCombobox';
import { PRODUCT_GENERATION_MODE } from './constants';
import { ProductImageDropzone } from './ProductImageDropzone';
import type {
  CreateProductTemplateFieldsProps,
  ProductGenerationMode,
} from './types';
import { getAttributeValueSelections } from './utils/generation';
import {
  validateProductCategory,
  validateProductName,
} from './utils/validations';

export const CreateProductTemplateFields = ({
  form,
  generationMode,
  onGenerationModeChange,
}: CreateProductTemplateFieldsProps) => {
  const isMultipleProducts = generationMode === PRODUCT_GENERATION_MODE.many;

  return (
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
                    form.setFieldValue('attributeValues', (currentValue) =>
                      getAttributeValueSelections(currentValue, attributes)
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
                  placeholder="Description"
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
            onValueChange={(value) => {
              const nextGenerationMode =
                (value[0] as ProductGenerationMode | undefined) ??
                PRODUCT_GENERATION_MODE.one;

              onGenerationModeChange(nextGenerationMode);
              form.setFieldValue('productVariants', []);
            }}
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

      <ProductImageDropzone
        className="aspect-square w-full"
        titleId="product-add-image-title"
      />
    </div>
  );
};
