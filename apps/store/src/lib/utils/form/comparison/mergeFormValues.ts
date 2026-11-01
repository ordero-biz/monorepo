import { areFormValuesEqual } from './areFormValuesEqual';

export type FormMergeChoice = 'local' | 'server';
export type FormMergeChoices<TField extends string> = Partial<
  Record<TField, FormMergeChoice>
>;
export type FormMergeConflict<TField extends string> = {
  field: TField;
  label: string;
  localValue: string;
  serverValue: string;
  helperText?: string;
};

export type FormMergeUpdate<TField extends string> = {
  field: TField;
  label: string;
  currentValue: string;
  mergedValue: string;
};

export type FormMergeValues<TValue> = {
  baseline: TValue;
  current: TValue;
  latest: TValue;
};

type FormMergeField<TValue> = {
  label: string;
  describe: (value: TValue) => string;
  normalize?: (value: TValue) => unknown;
  helperText?: string;
  // Return a value only when the feature can safely merge this field.
  // Undefined delegates to the standard three-way comparison.
  merge?: (values: FormMergeValues<TValue>) => { value: TValue } | undefined;
};

type FormFieldName<TValues> = Extract<keyof TValues, string>;

export type FormMergeFields<TValues extends object> = {
  [TField in FormFieldName<TValues>]: FormMergeField<TValues[TField]>;
};

type MergeFormValuesArgs<TValues extends object> = FormMergeValues<TValues> & {
  fields: FormMergeFields<TValues>;
  choices?: FormMergeChoices<FormFieldName<TValues>>;
};

export type FormMergeResult<TValues extends object> = {
  values: TValues;
  conflicts: FormMergeConflict<FormFieldName<TValues>>[];
  updates: FormMergeUpdate<FormFieldName<TValues>>[];
  changedFields: FormFieldName<TValues>[];
  hasUnresolvedConflicts: boolean;
};

/**
 * Merge edits against the values originally loaded and the latest saved values.
 * Arrays are atomic unless the feature supplies a safe field merge rule.
 * Conflicts default to local values until explicitly resolved by the caller.
 */
export const mergeFormValues = <TValues extends object>({
  baseline,
  current,
  latest,
  fields,
  choices = {},
}: MergeFormValuesArgs<TValues>): FormMergeResult<TValues> => {
  const conflicts: FormMergeConflict<FormFieldName<TValues>>[] = [];
  const values = { ...latest };
  const fieldNames = Object.keys(fields) as FormFieldName<TValues>[];

  const mergeField = <TField extends FormFieldName<TValues>>(
    field: TField
  ): TValues[TField] => {
    const config = fields[field];
    const merged = config.merge?.({
      baseline: baseline[field],
      current: current[field],
      latest: latest[field],
    });
    if (merged) {
      return merged.value;
    }

    const normalize = config.normalize ?? ((value: TValues[TField]) => value);
    const initialValue = normalize(baseline[field]);
    const localValue = normalize(current[field]);
    const serverValue = normalize(latest[field]);

    if (
      areFormValuesEqual(localValue, initialValue) ||
      areFormValuesEqual(localValue, serverValue)
    ) {
      return latest[field];
    }
    if (!areFormValuesEqual(serverValue, initialValue)) {
      conflicts.push({
        field,
        label: config.label,
        localValue: config.describe(current[field]),
        serverValue: config.describe(latest[field]),
        ...(config.helperText ? { helperText: config.helperText } : {}),
      });
      if (choices[field] === 'server') {
        return latest[field];
      }
    }
    return current[field];
  };

  for (const field of fieldNames) {
    values[field] = mergeField(field);
  }

  const conflictFields = new Set(conflicts.map(({ field }) => field));
  const updates: FormMergeUpdate<FormFieldName<TValues>>[] = [];
  for (const field of fieldNames) {
    const config = fields[field];
    const normalize = config.normalize ?? ((value: unknown) => value);
    if (
      !conflictFields.has(field) &&
      !areFormValuesEqual(normalize(current[field]), normalize(values[field]))
    ) {
      updates.push({
        field,
        label: config.label,
        currentValue: config.describe(current[field]),
        mergedValue: config.describe(values[field]),
      });
    }
  }

  return {
    values,
    conflicts,
    updates,
    // Raw differences are needed to restore dirty state against saved defaults,
    // including unfinished rows which may normalize to an empty API payload.
    changedFields: fieldNames.filter(
      (field) => !areFormValuesEqual(values[field], latest[field])
    ),
    hasUnresolvedConflicts: conflicts.some(({ field }) => !choices[field]),
  };
};
