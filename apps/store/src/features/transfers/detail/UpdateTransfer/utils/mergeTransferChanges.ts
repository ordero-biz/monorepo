import {
  getAddedFormEntries,
  mergeAddedFormEntries,
} from '@/lib/components/FormConflictResolver';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { areFormValuesEqual } from '@/lib/utils/form/comparison/areFormValuesEqual';
import {
  type FormMergeChoices,
  type FormMergeFields,
  type FormMergeValues,
  mergeFormValues,
} from '@/lib/utils/form/comparison/mergeFormValues';
import {
  getTransferFormDefaults,
  type TransferFormValues,
} from '../../../shared/TransferEditorForm';
import { isBlankTransferEntry } from '../../../shared/TransferEditorForm/utils/entries';
import { normalizeTransferEntry } from './normalizeTransferEntry';

export type TransferMergeChoices = FormMergeChoices<keyof TransferFormValues>;

type MergeTransferChangesArgs = {
  baseline: TransferDetails;
  current: TransferFormValues;
  latest: TransferDetails;
  choices?: TransferMergeChoices;
};

// Compare product lists without UI ids, stock snapshots, or option display metadata.
// Keep blank rows in this comparison so unfinished rows are preserved during refresh.
const normalizeEntries = (entries: TransferFormValues['transferEntries']) =>
  entries.map(normalizeTransferEntry);

const describeValue = (value: TransferFormValues[keyof TransferFormValues]) => {
  if (Array.isArray(value)) {
    return value.length
      ? value
          .map(
            (entry, index) =>
              `${index + 1}. ${entry.stockItem?.productVariant.name || 'No product selected'}; ` +
              `quantity: ${entry.quantity ?? '(empty)'}; ` +
              `unit: ${entry.stockItem?.unitOfMeasurement.name || '(none)'}; ` +
              `comment: ${entry.comment || '(empty)'}`
          )
          .join('\n')
      : 'No products';
  }

  if (typeof value === 'string') {
    return value || '(empty)';
  }

  return value?.name || '(none)';
};

export const getAddedTransferEntries = ({
  baseline,
  current,
}: Pick<
  FormMergeValues<TransferFormValues['transferEntries']>,
  'baseline' | 'current'
>) =>
  getAddedFormEntries({
    baseline,
    current,
    normalizeEntry: normalizeTransferEntry,
  });

const mergeAddedEntries = (
  values: FormMergeValues<TransferFormValues['transferEntries']>
) =>
  mergeAddedFormEntries({
    ...values,
    normalizeEntry: normalizeTransferEntry,
  });

const fields: FormMergeFields<TransferFormValues> = {
  transferNumber: {
    label: 'Name',
    normalize: (value) => value.trim(),
    describe: describeValue,
  },
  sourceWarehouse: {
    label: 'From warehouse',
    normalize: (value) => value?.id ?? null,
    describe: describeValue,
  },
  destinationWarehouse: {
    label: 'To warehouse',
    normalize: (value) => value?.id ?? null,
    describe: describeValue,
  },
  comment: {
    label: 'Comment',
    normalize: (value) => value.trim(),
    describe: describeValue,
  },
  transferEntries: {
    label: 'Products to transfer',
    normalize: normalizeEntries,
    describe: describeValue,
    merge: mergeAddedEntries,
    helperText:
      'Choose one complete product list. Products from the other list will not be included.',
  },
};

export const mergeTransferChanges = ({
  baseline,
  current,
  latest,
  choices,
}: MergeTransferChangesArgs) => {
  const baselineValues = getTransferFormDefaults(baseline);
  const latestValues = getTransferFormDefaults(latest);
  const initialSourceId = baselineValues.sourceWarehouse?.id ?? null;
  const localSourceId = current.sourceWarehouse?.id ?? null;
  const serverSourceId = latestValues.sourceWarehouse?.id ?? null;
  const sameSourceWarehouse =
    localSourceId === initialSourceId && serverSourceId === initialSourceId;

  const result = mergeFormValues({
    baseline: baselineValues,
    current,
    latest: latestValues,
    fields: sameSourceWarehouse
      ? fields
      : {
          ...fields,
          transferEntries: {
            ...fields.transferEntries,
            merge: undefined,
          },
        },
    choices,
  });

  const localSourceChanged = localSourceId !== initialSourceId;
  const serverSourceChanged = serverSourceId !== initialSourceId;
  const localEntriesChanged = !areFormValuesEqual(
    normalizeEntries(current.transferEntries),
    normalizeEntries(baselineValues.transferEntries)
  );
  const serverEntriesChanged = !areFormValuesEqual(
    normalizeEntries(latestValues.transferEntries),
    normalizeEntries(baselineValues.transferEntries)
  );
  const hasProducts =
    !current.transferEntries.every(isBlankTransferEntry) ||
    !latestValues.transferEntries.every(isBlankTransferEntry);
  const hasCoupledSourceAndEntriesConflict =
    localSourceId !== serverSourceId &&
    hasProducts &&
    (localSourceChanged || localEntriesChanged) &&
    (serverSourceChanged || serverEntriesChanged);

  if (!hasCoupledSourceAndEntriesConflict) {
    return result;
  }

  const coupledChoice = choices?.transferEntries ?? choices?.sourceWarehouse;
  const useServerSourceAndEntries = coupledChoice === 'server';
  const values: TransferFormValues = {
    ...result.values,
    sourceWarehouse: useServerSourceAndEntries
      ? latestValues.sourceWarehouse
      : current.sourceWarehouse,
    transferEntries: useServerSourceAndEntries
      ? latestValues.transferEntries
      : current.transferEntries,
  };
  const coupledConflict = {
    field: 'transferEntries' as const,
    label: fields.transferEntries.label,
    localValue:
      `From warehouse: ${describeValue(current.sourceWarehouse)}\n` +
      describeValue(current.transferEntries),
    serverValue:
      `From warehouse: ${describeValue(latestValues.sourceWarehouse)}\n` +
      describeValue(latestValues.transferEntries),
    helperText:
      'Products belong to the source warehouse. Choose one source warehouse and its complete product list.',
  };
  const conflicts = [
    ...result.conflicts.filter(
      ({ field }) => field !== 'sourceWarehouse' && field !== 'transferEntries'
    ),
    coupledConflict,
  ];
  const updates = result.updates.filter(
    ({ field }) => field !== 'sourceWarehouse' && field !== 'transferEntries'
  );
  const fieldNames = Object.keys(fields) as (keyof TransferFormValues)[];
  const changedFields = fieldNames.filter(
    (field) => !areFormValuesEqual(values[field], latestValues[field])
  );
  const hasUnresolvedConflicts = conflicts.some(({ field }) =>
    field === 'transferEntries' ? !coupledChoice : !choices?.[field]
  );

  return {
    values,
    conflicts,
    updates,
    changedFields,
    hasUnresolvedConflicts,
  };
};
