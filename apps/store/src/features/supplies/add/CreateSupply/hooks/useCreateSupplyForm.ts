import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  getSupplyFormDefaults,
  useSubmitSupplyForm,
} from '../../../shared/SupplyEditorForm';
import { getCreateSupplyData } from '../utils/getCreateData';
import { submitCreateSupply } from '../utils/submitAction';

type UseCreateSupplyFormArgs = {
  onCreated: (supply: SupplyDetails) => Promise<void> | void;
};

export const useCreateSupplyForm = ({ onCreated }: UseCreateSupplyFormArgs) =>
  useSubmitSupplyForm({
    defaultValues: getSupplyFormDefaults(),
    draftSuccessMessage: 'Supply draft created.',
    submitAction: ({ value, status }) =>
      submitCreateSupply(getCreateSupplyData(value, status)),
    onSaved: onCreated,
  });
