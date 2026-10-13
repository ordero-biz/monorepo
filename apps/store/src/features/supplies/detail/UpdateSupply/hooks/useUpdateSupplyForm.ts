import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  getSupplyFormDefaults,
  useSupplyEditorForm,
} from '../../../shared/SupplyEditorForm';
import { submitUpdateSupply } from '../utils/submitAction';

type UseUpdateSupplyFormArgs = {
  supply: SupplyDetails;
  onUpdated: (supply: SupplyDetails) => Promise<void> | void;
};

export const useUpdateSupplyForm = ({
  supply,
  onUpdated,
}: UseUpdateSupplyFormArgs) =>
  useSupplyEditorForm({
    defaultValues: getSupplyFormDefaults(supply),
    draftSuccessMessage: 'Supply draft saved.',
    submitAction: ({ value, status }) =>
      submitUpdateSupply({ value, status, initialSupply: supply }),
    onSaved: onUpdated,
  });
