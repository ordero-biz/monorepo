import { Textarea, TextField } from '@ordero/ui';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  AttributesAsyncCombobox,
  getAttributeValueSelections,
  ProductImageDropzone,
  type ProductTemplateFieldsProps,
  validateProductAttributes,
  validateProductCategory,
  validateProductName,
} from '../CreateProduct';

export const CreateMultipleProductsTemplateFields = ({
  form,
}: ProductTemplateFieldsProps) => {
  return (
    <div className="grid gap-[var(--space-3)] lg:grid-cols-[1fr_1fr_0.5fr] lg:items-start">
      <div className="grid gap-[var(--space-3)] lg:col-span-2 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col gap-[var(--space-2)]">
          <form.Field
            name="productName"
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
                  size="s"
                  value={field.state.value}
                />
              );
            }}
          </form.Field>

          <form.Field
            name="attributes"
            validators={{
              onBlur: validateProductAttributes,
              onChange: validateProductAttributes,
              onSubmit: validateProductAttributes,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

              return (
                <AttributesAsyncCombobox
                  errorText={errorText}
                  helperText="You must select attributes and their values to generate multiple products"
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
                  required
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
                  resize="none"
                  rows={2}
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
        </div>
      </div>

      <ProductImageDropzone
        className="aspect-square w-full"
        titleId="product-add-image-title"
      />
    </div>
  );
};
