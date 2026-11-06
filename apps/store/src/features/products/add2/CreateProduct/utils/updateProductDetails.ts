import type {
  ProductCommonValues,
  ProductVariantsCreationFormApi,
} from '../../../add/CreateProduct';

type UpdateProductDetailsArgs = {
  form: ProductVariantsCreationFormApi;
  values: ProductCommonValues;
};

export const updateProductDetails = ({
  form,
  values,
}: UpdateProductDetailsArgs) => {
  form.setFieldValue('name', values.name);
  form.setFieldValue('category', values.category);
  form.setFieldValue('description', values.description);
  form.setFieldValue('status', values.status);

  // Only clear errors for the applied fields; preserve rejected variant fields.
  (['name', 'category', 'description', 'status'] as const).forEach((name) => {
    form.setFieldMeta(name, (meta) => ({
      ...meta,
      errorMap: { ...meta.errorMap, onSubmit: undefined },
    }));
  });
};
