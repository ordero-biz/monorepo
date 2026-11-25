import { useFormConflictResolver } from './context';
import { FormConflictResolverProvider } from './FormConflictResolverProvider';
import {
  createFormEntriesRenderer,
  FormEntriesComparison,
  FormEntriesTable,
} from './FormEntriesComparison';
import { ReviewButton } from './ReviewButton';

export const FormConflictResolver = {
  Provider: FormConflictResolverProvider,
  ReviewButton,
  useContext: useFormConflictResolver,
};

export {
  createFormEntriesRenderer,
  FormEntriesComparison,
  FormEntriesTable,
};

export type {
  CreateFormEntriesRendererArgs,
  FormConflictPolicy,
  FormConflictResolverProviderProps,
  FormEntriesComparisonProps,
  FormEntriesTableProps,
  FormEntryPreviewRow,
  FormFieldRenderer,
  FormRefreshAdapter,
} from './types';
export { getDifferentRows } from './utils/getDifferentRows';
export {
  getAddedFormEntries,
  type IdentifiableFormEntry,
  mergeAddedFormEntries,
} from './utils/mergeAddedEntries';
