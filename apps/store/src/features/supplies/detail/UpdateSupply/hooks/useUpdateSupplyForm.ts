import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  getSupplyFormDefaults,
  useSubmitSupplyForm,
} from '../../../shared/SupplyEditorForm';
import { getSupplyUpdateChanges } from '../utils/getUpdateChanges';
import { submitUpdateSupply } from '../utils/submitAction';

type UseUpdateSupplyFormArgs = {
  supply: SupplyDetails;
  onUpdated: (supply: SupplyDetails) => Promise<void> | void;
};

export const useUpdateSupplyForm = ({
  supply,
  onUpdated,
}: UseUpdateSupplyFormArgs) =>
  useSubmitSupplyForm({
    defaultValues: getSupplyFormDefaults(supply),
    draftSuccessMessage: 'Supply draft saved.',
    submitAction: async ({ value, status }) => {
      const changes = getSupplyUpdateChanges({
        supply,
        formValue: value,
        status,
      });

      if (!changes) {
        return null;
      }

      return submitUpdateSupply({
        supplyId: supply.id,
        expectedVersion: supply.version,
        submitData: changes,
      });
    },
    onSaved: onUpdated,
  });
