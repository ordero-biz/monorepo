import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  getSupplyFormDefaults,
  useSupplyEditorForm,
} from '../../../shared/SupplyEditorForm';
import { submitUpdateSupplyAction } from '../utils/submitUpdateSupplyAction';

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
      submitUpdateSupplyAction({ value, status, initialSupply: supply }),
    onSaved: onUpdated,
  });
