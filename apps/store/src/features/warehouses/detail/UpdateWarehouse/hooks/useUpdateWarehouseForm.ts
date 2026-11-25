import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Warehouse } from '@/lib/domain/warehouses/types';
import { getWarehouseDefaultValues } from '../utils/fields';
import { getWarehouseUpdateChanges } from '../utils/getUpdateChanges';
import { submitUpdateWarehouse } from '../utils/submitAction';

type UseUpdateWarehouseFormArgs = {
  onNoChanges: () => void;
  onUpdated: (warehouse: Warehouse) => Promise<void> | void;
  warehouse: Warehouse;
};

export const useUpdateWarehouseForm = ({
  onNoChanges,
  onUpdated,
  warehouse,
}: UseUpdateWarehouseFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: getWarehouseDefaultValues(warehouse),
    onSubmit: async ({ formApi, value }) => {
      const updateChanges = getWarehouseUpdateChanges({
        formValue: value,
        warehouse,
      });

      if (!updateChanges) {
        onNoChanges();
        return;
      }

      const result = await submitUpdateWarehouse({
        warehouseId: warehouse.id,
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
        description: `Warehouse ${result.data.name} was updated`,
        type: 'success',
      });

      await onUpdated(result.data);
    },
  });

  return { form };
};
