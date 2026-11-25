import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { createSupplierDefaultValues } from '../constants';
import { submitCreateSupplier } from '../utils/submitAction';

type UseCreateSupplierFormArgs = {
  onCreated: () => Promise<void> | void;
};

export const useCreateSupplierForm = ({
  onCreated,
}: UseCreateSupplierFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createSupplierDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateSupplier(value);

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
        description: `Supplier ${result.data.name} was created`,
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
