import { useToastManager } from '@ordero/ui';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { createProductDefaultValues } from '../constants';
import type { CreateProductValues } from '../types';
import { submitCreateProduct } from '../utils/submitAction';
import {
  type validateCreateProduct,
  validateProductVariants,
} from '../utils/validations';

type UseCreateProductFormArgs = {
  onCreated: () => Promise<void> | void;
  validateProduct: (
    value: CreateProductValues
  ) => ReturnType<typeof validateCreateProduct>;
};

export const useCreateProductForm = ({
  onCreated,
  validateProduct,
}: UseCreateProductFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createProductDefaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) =>
        validateProductVariants({
          requireAttributeValueIds: false,
          value,
        }),
      onSubmit: ({ value }) => validateProduct(value),
    },
    onSubmitInvalid: ({ formApi }) => {
      void formApi.validate('submit');
    },
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateProduct(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors,
          },
        });

        if (result.error.formError) {
          addToast({
            description: result.error.formError,
            type: 'error',
          });
        }

        return;
      }

      addToast({
        description: `Product ${result.data.name} was created`,
        type: 'success',
      });

      formApi.reset();
      await onCreated();
    },
  });

  return {
    form,
  };
};
