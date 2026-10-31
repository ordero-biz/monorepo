import { useToastManager } from '@ordero/ui';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { getFieldErrorMessages } from '@/lib/utils/form/error/getFieldErrorMessages';
import { createProductVariantsCreationDefaultValues } from '../constants';
import type { ProductVariantsCreationValues } from '../types';
import { submitCreateProduct } from '../utils/submitAction';
import type { validateProductConfiguration } from '../utils/validations';

type UseCreateProductFormArgs = {
  onFieldErrors?: (errors: Record<string, string>) => void;
  onCreated: () => Promise<void> | void;
  validateConfiguration: (
    value: ProductVariantsCreationValues
  ) => ReturnType<typeof validateProductConfiguration>;
};

export const useCreateProductForm = ({
  onCreated,
  onFieldErrors,
  validateConfiguration,
}: UseCreateProductFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createProductVariantsCreationDefaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => validateConfiguration(value),
    },
    onSubmitInvalid: ({ formApi }) => {
      if (!onFieldErrors) return;
      onFieldErrors(getFieldErrorMessages(formApi.getAllErrors().fields));
    },
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateProduct(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors ?? {},
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
