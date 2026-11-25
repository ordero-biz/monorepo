import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { createUnitOfMeasurementDefaultValues } from '../constants';
import { submitCreateUnitOfMeasurement } from '../utils/submitAction';

type UseCreateUnitOfMeasurementFormArgs = {
  onCreated: () => Promise<void> | void;
};

export const useCreateUnitOfMeasurementForm = ({
  onCreated,
}: UseCreateUnitOfMeasurementFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: createUnitOfMeasurementDefaultValues,
    onSubmit: async ({ formApi, value }) => {
      const result = await submitCreateUnitOfMeasurement(value);

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
        description: `Unit of measurement ${result.data.name} was created`,
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
