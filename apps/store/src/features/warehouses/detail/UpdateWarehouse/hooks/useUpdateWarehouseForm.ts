import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Warehouse } from '@/lib/domain/warehouses';
import { getWarehouseDefaultValues } from '../utils/fields';
import { submitUpdateWarehouse } from '../utils/submitAction';

type UseUpdateWarehouseFormArgs = {
  onUpdated: () => Promise<void> | void;
  warehouse: Warehouse;
};

export const useUpdateWarehouseForm = ({
  onUpdated,
  warehouse,
}: UseUpdateWarehouseFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: getWarehouseDefaultValues(warehouse),
    onSubmit: async ({ formApi, value }) => {
      const result = await submitUpdateWarehouse({
        warehouseId: warehouse.id,
        value,
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

      await onUpdated();
    },
  });

  return { form };
};
