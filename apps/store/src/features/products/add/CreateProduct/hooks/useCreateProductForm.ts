import { useToastManager } from '@ordero/ui';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { createProductVariantsCreationDefaultValues } from '../constants';
import type { ProductVariantsCreationValues } from '../types';
import { submitCreateProduct } from '../utils/submitAction';
import type { validateProductConfiguration } from '../utils/validations';

type UseCreateProductFormArgs = {
  onCreated: () => Promise<void> | void;
  validateConfiguration: (
    value: ProductVariantsCreationValues
  ) => ReturnType<typeof validateProductConfiguration>;
};

export const useCreateProductForm = ({
  onCreated,
  validateConfiguration,
}: UseCreateProductFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createProductVariantsCreationDefaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => validateConfiguration(value),
    },
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateProduct(value);

      if (!result.ok) {
        const fieldErrors = result.error.fieldErrors ?? {};

        formApi.setErrorMap({
          onSubmit: {
            fields: fieldErrors,
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
