import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { createWarehouseDefaultValues } from '../constants';
import { submitCreateWarehouse } from '../utils/submitAction';

type UseCreateWarehouseFormArgs = {
  onCreated: () => Promise<void> | void;
};

export const useCreateWarehouseForm = ({
  onCreated,
}: UseCreateWarehouseFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createWarehouseDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateWarehouse(value);

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
        description: `Warehouse ${result.data.name} was created`,
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
