export type PatchPayload<TData> = {
  [TKey in keyof TData]?: TData[TKey] extends readonly unknown[]
    ? TData[TKey]
    : TData[TKey] extends object
      ? PatchPayload<TData[TKey]>
      : TData[TKey];
};

type CreatePatchPayloadArgs<TData extends object> = {
  initialData: TData;
  submitData: TData;
};

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
    const initialKeys = Object.keys(initialValue).filter(
      (key) => initialValue[key] !== undefined
    );
    const submitKeys = Object.keys(submitValue).filter(
      (key) => submitValue[key] !== undefined
    );

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

const createPatchValue = (
  initialValue: unknown,
  submitValue: unknown
): unknown => {
  if (submitValue === undefined || areEqual(initialValue, submitValue)) {
    return undefined;
  }

  if (isPlainObject(submitValue)) {
    const initialObject = isPlainObject(initialValue) ? initialValue : {};
    const patchEntries = Object.entries(submitValue).flatMap(([key, value]) => {
      const patchValue = createPatchValue(initialObject[key], value);

      return patchValue === undefined ? [] : [[key, patchValue]];
    });

    return patchEntries.length > 0
      ? Object.fromEntries(patchEntries)
      : undefined;
  }

  return submitValue;
};

export const createPatchPayload = <TData extends object>({
  initialData,
  submitData,
}: CreatePatchPayloadArgs<TData>): PatchPayload<TData> | undefined =>
  createPatchValue(initialData, submitData) as PatchPayload<TData> | undefined;
