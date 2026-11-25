import type { FormConflictPolicy } from '@/lib/components/FormConflictResolver';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import {
  getTransferFormDefaults,
  type TransferFormValues,
} from '../../shared/TransferEditorForm';
import { transferProductsRenderer } from './TransferProductsComparison';
import { mergeTransferChanges } from './utils/mergeTransferChanges';

export const transferConflictPolicy: FormConflictPolicy<
  TransferDetails,
  TransferFormValues
> = {
  getVersion: (transfer) => transfer.version,
  getDefaultValues: getTransferFormDefaults,
  merge: mergeTransferChanges,
  fieldRenderers: { transferEntries: transferProductsRenderer },
  saveNotice: 'This action does not save or start this transfer.',
  notice: {
    title: 'Transfer changed',
    description:
      'A newer version of this transfer is available. Your unsaved edits are preserved. Review the updates before applying them to this form.',
  },
  readOnly: {
    isReadOnly: (transfer) => transfer.status !== TRANSFER_STATUS.DRAFT,
    notice: {
      title: 'Transfer started',
      description:
        'This transfer was started elsewhere. Your unsaved edits remain on this page, but can no longer be saved.',
    },
  },
};
