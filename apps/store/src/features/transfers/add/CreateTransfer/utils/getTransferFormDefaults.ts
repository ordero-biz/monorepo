import type { TransferFormValues } from '../types';
import { createEmptyTransferEntry } from './entries';

export const getTransferFormDefaults = (
  sourceWarehouse: TransferFormValues['sourceWarehouse'] = null
): TransferFormValues => ({
  transferNumber: '',
  sourceWarehouse,
  destinationWarehouse: null,
  comment: '',
  transferEntries: [createEmptyTransferEntry('initial-placeholder')],
});
