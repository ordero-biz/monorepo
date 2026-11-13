import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
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
  const appliedFields: (
    | keyof ProductCommonValues
    | `productVariants[${number}].status`
  )[] = ['name', 'category', 'description', 'status'];

  if (values.status === PRODUCT_STATUS.DRAFT) {
    // The editor explicitly confirms this change before applying its snapshot.
    // Update variants first so validation never sees Draft with Active variants.
    const variants = form.getFieldValue('productVariants');
    if (variants.some((variant) => variant.status === PRODUCT_STATUS.ACTIVE)) {
      form.setFieldValue(
        'productVariants',
        variants.map((variant) =>
          variant.status === PRODUCT_STATUS.ACTIVE
            ? { ...variant, status: PRODUCT_STATUS.DRAFT }
            : variant
        ),
        { dontValidate: true }
      );
      variants.forEach((variant, index) => {
        if (variant.status === PRODUCT_STATUS.ACTIVE) {
          appliedFields.push(`productVariants[${index}].status`);
        }
      });
    }
  }
  form.setFieldValue('name', values.name);
  form.setFieldValue('category', values.category);
  form.setFieldValue('description', values.description);
  form.setFieldValue('status', values.status);

  // Preserve errors for variant fields whose values were not applied.
  appliedFields.forEach((name) => {
    form.setFieldMeta(name, (meta) => ({
      ...meta,
      errorMap: { ...meta.errorMap, onSubmit: undefined },
    }));
  });
};
