import type { FormConflictPolicy } from '@/lib/components/FormConflictResolver';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  getSupplyFormDefaults,
  type SupplyFormValues,
} from '../../shared/SupplyEditorForm';
import { supplyProductsRenderer } from './SupplyProductsComparison';
import { mergeSupplyChanges } from './utils/mergeSupplyChanges';

export const supplyConflictPolicy: FormConflictPolicy<
  SupplyDetails,
  SupplyFormValues
> = {
  getVersion: (supply) => supply.version,
  getDefaultValues: getSupplyFormDefaults,
  merge: mergeSupplyChanges,
  fieldRenderers: { supplyEntries: supplyProductsRenderer },
  saveNotice: 'This action does not save or finalize this supply.',
  notice: {
    title: 'Supply changed',
    description:
      'A newer version of this supply is available. Your unsaved edits are preserved. Review the updates before applying them to this form.',
  },
  readOnly: {
    isReadOnly: (supply) => supply.status === SUPPLY_STATUS.COMPLETED,
    notice: {
      title: 'Supply finalized',
      description:
        'This supply was finalized elsewhere. Your unsaved edits remain on this page, but can no longer be saved.',
    },
  },
};
