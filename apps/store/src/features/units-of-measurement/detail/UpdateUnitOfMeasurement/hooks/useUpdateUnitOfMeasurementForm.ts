import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import { getUnitOfMeasurementDefaultValues } from '../utils/fields';
import { getUnitOfMeasurementUpdateChanges } from '../utils/getUpdateChanges';
import { submitUpdateUnitOfMeasurement } from '../utils/submitAction';

type UseUpdateUnitOfMeasurementFormArgs = {
  onNoChanges: () => void;
  onUpdated: (unitOfMeasurement: UnitOfMeasurement) => Promise<void> | void;
  unitOfMeasurement: UnitOfMeasurement;
};

export const useUpdateUnitOfMeasurementForm = ({
  onNoChanges,
  onUpdated,
  unitOfMeasurement,
}: UseUpdateUnitOfMeasurementFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: getUnitOfMeasurementDefaultValues(unitOfMeasurement),
    onSubmit: async ({ formApi, value }) => {
      const updateChanges = getUnitOfMeasurementUpdateChanges({
        formValue: value,
        unitOfMeasurement,
      });

      if (!updateChanges) {
        onNoChanges();
        return;
      }

      const result = await submitUpdateUnitOfMeasurement({
        submitData: updateChanges,
        unitOfMeasurementId: unitOfMeasurement.id,
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
