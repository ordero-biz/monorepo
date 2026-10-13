import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  getSupplyFormDefaults,
  useSupplyEditorForm,
} from '../../../shared/SupplyEditorForm';
import { submitCreateSupplyAction } from '../utils/submitCreateSupplyAction';

type UseCreateSupplyFormArgs = {
  onCreated: (supply: SupplyDetails) => Promise<void> | void;
};

export const useCreateSupplyForm = ({ onCreated }: UseCreateSupplyFormArgs) =>
  useSupplyEditorForm({
    defaultValues: getSupplyFormDefaults(),
    draftSuccessMessage: 'Supply draft created.',
    submitAction: submitCreateSupplyAction,
    onSaved: onCreated,
  });
