import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';
import {
  getUnitOfMeasurementUpdateChanges,
  submitUpdateUnitOfMeasurement,
} from '../utils/submitAction';
import type { UpdateUnitOfMeasurementFormValues } from '../utils/validations';

type UseUpdateUnitOfMeasurementFormArgs = {
  initialValues: UpdateUnitOfMeasurementFormValues;
  onNoChanges: () => void;
  onUpdated: (unitOfMeasurement: UnitOfMeasurement) => Promise<void> | void;
  unitOfMeasurementId: string | number;
};

export const useUpdateUnitOfMeasurementForm = ({
  initialValues,
  onNoChanges,
  onUpdated,
  unitOfMeasurementId,
}: UseUpdateUnitOfMeasurementFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ formApi, value }) => {
      const updateChanges = getUnitOfMeasurementUpdateChanges({
        initialValues,
        formValue: value,
      });

      if (!updateChanges) {
        onNoChanges();
        return;
      }

      const result = await submitUpdateUnitOfMeasurement({
        unitOfMeasurementId,
        submitData: updateChanges,
      });

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
        description: `Unit of measurement ${result.data.name} was updated`,
        type: 'success',
      });

      await onUpdated(result.data);
    },
  });

  return {
    form,
  };
};
