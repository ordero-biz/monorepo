export type ChangedValues<TData> = {
  [TKey in keyof TData]?: ChangedValue<TData[TKey]>;
};

type ChangedValue<TValue> = TValue extends readonly unknown[]
  ? TValue
  : TValue extends object
    ? ChangedValues<TValue> | TValue
    : TValue;

type GetChangedValuesArgs<TData extends object> = {
  initialData: TData;
  submitData: TData;
};

type ChangeResult =
  | {
      hasChanged: false;
    }
  | {
      hasChanged: true;
      value: unknown;
    };

const noChange: ChangeResult = { hasChanged: false };

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
};

const areEqual = (initialValue: unknown, submitValue: unknown): boolean => {
  if (Object.is(initialValue, submitValue)) {
    return true;
  }

  if (Array.isArray(initialValue) && Array.isArray(submitValue)) {
    return (
      initialValue.length === submitValue.length &&
      initialValue.every((value, index) => areEqual(value, submitValue[index]))
    );
  }

  if (isPlainObject(initialValue) && isPlainObject(submitValue)) {
    const initialKeys = Object.keys(initialValue);
    const submitKeys = Object.keys(submitValue);

    return (
      initialKeys.length === submitKeys.length &&
      initialKeys.every(
        (key) =>
          Object.hasOwn(submitValue, key) &&
          areEqual(initialValue[key], submitValue[key])
      )
    );
  }

  return false;
};

const getChangedValue = (
  initialValue: unknown,
  submitValue: unknown
): ChangeResult => {
  if (areEqual(initialValue, submitValue)) {
    return noChange;
  }

  if (isPlainObject(submitValue)) {
    const initialObject = isPlainObject(initialValue) ? initialValue : {};
    const keys = new Set([
      ...Object.keys(initialObject),
      ...Object.keys(submitValue),
    ]);
    const changedEntries = [...keys].flatMap((key) => {
      const changedValue = getChangedValue(
        initialObject[key],
        submitValue[key]
      );

      return changedValue.hasChanged ? [[key, changedValue.value]] : [];
    });

    return changedEntries.length > 0
      ? { hasChanged: true, value: Object.fromEntries(changedEntries) }
      : noChange;
  }

  return { hasChanged: true, value: submitValue };
};

/**
 * Returns the values that differ from the initial data.
 *
 * Plain objects are compared recursively. Arrays and non-plain objects are
 * returned as complete values. Missing object properties are represented by
 * `undefined` in the result.
 */
export const getChangedValues = <TData extends object>({
  initialData,
  submitData,
}: GetChangedValuesArgs<TData>): ChangedValues<TData> | undefined => {
  const changedValue = getChangedValue(initialData, submitData);

  return changedValue.hasChanged
    ? (changedValue.value as ChangedValues<TData>)
    : undefined;
};
