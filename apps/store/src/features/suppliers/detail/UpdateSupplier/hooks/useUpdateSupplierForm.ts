import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Supplier } from '@/lib/domain/suppliers/types';
import { getSupplierDefaultValues } from '../utils/fields';
import { getSupplierUpdateChanges } from '../utils/getUpdateChanges';
import { submitUpdateSupplier } from '../utils/submitAction';

type UseUpdateSupplierFormArgs = {
  onNoChanges: () => void;
  onUpdated: (supplier: Supplier) => Promise<void> | void;
  supplier: Supplier;
};

export const useUpdateSupplierForm = ({
  onNoChanges,
  onUpdated,
  supplier,
}: UseUpdateSupplierFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: getSupplierDefaultValues(supplier),
    onSubmit: async ({ formApi, value }) => {
      const updateChanges = getSupplierUpdateChanges({
        formValue: value,
        supplier,
      });

      if (!updateChanges) {
        onNoChanges();
        return;
      }

      const result = await submitUpdateSupplier({
        supplierId: supplier.id,
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
        description: `Supplier ${result.data.name} was updated`,
        type: 'success',
      });

      await onUpdated(result.data);
    },
  });

  return {
    form,
  };
};
