import type { ReactNode } from 'react';
import type {
  FormMergeChoice,
  FormMergeChoices,
  FormMergeConflict,
  FormMergeResult,
  FormMergeUpdate,
  FormMergeValues,
} from '@/lib/utils/form/comparison/mergeFormValues';

export type FormRefreshAdapter<TValues extends object> = {
  isPristine: boolean;
  isSubmitting: boolean;
  getValues: () => TValues;
  reset: (defaults: TValues) => void;
  // Restore an edit without running change listeners or validation.
  setFieldValue: (
    field: Extract<keyof TValues, string>,
    value: TValues[Extract<keyof TValues, string>]
  ) => void;
};

export type SavedChangesNotice = {
  title: string;
  description: string;
};

export type FormConflictOption = {
  label: string;
  content: ReactNode;
};

export type FormFieldPresentation = {
  update?: ReactNode;
  options?: Record<FormMergeChoice, FormConflictOption>;
};

export type FormFieldRenderer<TValue> = {
  renderUpdate?: (
    values: FormMergeValues<TValue> & { merged: TValue }
  ) => ReactNode;
  renderChoice?: (args: {
    value: TValue;
    otherValue: TValue;
    choice: FormMergeChoice;
  }) => FormConflictOption;
};

export type FormConflictPolicy<TRecord, TValues extends object> = {
  getVersion: (record: TRecord) => number;
  getDefaultValues: (record: TRecord) => TValues;
  merge: (args: {
    baseline: TRecord;
    current: TValues;
    latest: TRecord;
    choices?: FormMergeChoices<Extract<keyof TValues, string>>;
  }) => FormMergeResult<TValues>;
  notice: SavedChangesNotice;
  // Explain what accepting a review does not persist in this workflow.
  saveNotice?: string;
  // Features render typed values; the resolver keeps selection and validation.
  fieldRenderers?: {
    [TField in Extract<keyof TValues, string>]?: FormFieldRenderer<
      TValues[TField]
    >;
  };
  readOnly?: {
    isReadOnly: (record: TRecord) => boolean;
    notice: SavedChangesNotice;
  };
};

export type FormConflictResolverProviderProps<
  TRecord,
  TValues extends object,
> = {
  baseline: TRecord;
  latest: TRecord;
  onBaselineChange: (record: TRecord) => void;
  form: FormRefreshAdapter<TValues>;
  policy: FormConflictPolicy<TRecord, TValues>;
  children: ReactNode;
};

export type FormConflictResolverContextValue = {
  hasPendingChanges: boolean;
  isReadOnly: boolean;
  openReview: () => void;
};

export type FormConflictDialogProps<TField extends string> = {
  // Change this whenever the saved snapshot changes to clear prior choices.
  revision: string | number;
  conflicts: readonly FormMergeConflict<TField>[];
  updates: readonly FormMergeUpdate<TField>[];
  saveNotice?: string;
  presentations?: Partial<Record<TField, FormFieldPresentation>>;
  onApply: (choices: FormMergeChoices<TField>) => void;
  onClose: () => void;
};

export type SavedChangesDialogProps = SavedChangesNotice & {
  open: boolean;
  onClose: () => void;
  reviewAction?: {
    label: string;
    onClick: () => void;
  };
};

export type FormConflictFormProps<TField extends string> = Pick<
  FormConflictDialogProps<TField>,
  'conflicts' | 'updates' | 'saveNotice' | 'presentations' | 'onApply'
>;

export type FormConflictFormValues = {
  choices: (FormMergeChoice | undefined)[];
};
