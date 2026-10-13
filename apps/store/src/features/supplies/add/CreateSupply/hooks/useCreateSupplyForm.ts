import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  getSupplyFormDefaults,
  useSupplyEditorForm,
} from '../../../shared/SupplyEditorForm';
import { submitCreateSupply } from '../utils/submitAction';

type UseCreateSupplyFormArgs = {
  onCreated: (supply: SupplyDetails) => Promise<void> | void;
};

export const useCreateSupplyForm = ({ onCreated }: UseCreateSupplyFormArgs) =>
  useSupplyEditorForm({
    defaultValues: getSupplyFormDefaults(),
    draftSuccessMessage: 'Supply draft created.',
    submitAction: submitCreateSupply,
    onSaved: onCreated,
  });
