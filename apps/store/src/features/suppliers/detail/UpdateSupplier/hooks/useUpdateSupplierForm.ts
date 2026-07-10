import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import type { Supplier } from '@/lib/domain/suppliers';
import { getSupplierDefaultValues } from '../../../shared/SupplierFormDialogContent';
import { submitUpdateSupplier } from '../utils/submitAction';

type UseUpdateSupplierFormArgs = {
  onUpdated: () => Promise<void> | void;
  supplier: Supplier;
};

export const useUpdateSupplierForm = ({
  onUpdated,
  supplier,
}: UseUpdateSupplierFormArgs) => {
  const { add: addToast } = useToastManager();
  const form = useForm({
    defaultValues: getSupplierDefaultValues(supplier),
    onSubmit: async ({ formApi, value }) => {
      const result = await submitUpdateSupplier({
        supplierId: supplier.id,
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
        description: `Supplier ${result.data.name} was updated`,
        type: 'success',
      });

      await onUpdated();
    },
  });

  return {
    form,
  };
};
