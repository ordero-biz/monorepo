import { getErrorMessage } from './error';

type FieldErrors = Record<string, { errors: readonly unknown[] }>;

/** Normalize the first stored error per field without applying source precedence. */
export const getFieldErrorMessages = (
  fields: FieldErrors
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(fields).map(([name, field]) => [
      name,
      getErrorMessage(field.errors[0]),
    ])
  );
