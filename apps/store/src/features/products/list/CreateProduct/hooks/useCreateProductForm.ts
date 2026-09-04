import { useToastManager } from '@ordero/ui';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { createProductDefaultValues } from '../constants';
import { submitCreateProduct } from '../utils/submitAction';
import { validateCreateProduct } from '../utils/validations';

type UseCreateProductFormArgs = {
  onCreated: () => Promise<void> | void;
};

export const useCreateProductForm = ({
  onCreated,
}: UseCreateProductFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createProductDefaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: validateCreateProduct,
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
