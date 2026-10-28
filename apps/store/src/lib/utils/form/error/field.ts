import { getErrorMessage } from './error';

type FieldSubmitChangeErrorMeta = {
  errorMap: {
    onBlur?: unknown;
    onChange?: unknown;
    onDynamic?: unknown;
    onSubmit?: unknown;
  };
  isBlurred: boolean;
  isDirty: boolean;
  isTouched: boolean;
};

export const getFieldSubmitChangeErrorText = (
  meta: FieldSubmitChangeErrorMeta,
  submissionAttempts: number
) => {
  const submitError = meta.errorMap.onSubmit;
  const blurError = meta.errorMap.onBlur;
  const changeError = meta.errorMap.onChange;
  const dynamicError = meta.errorMap.onDynamic;
  const submitErrorText = submitError
    ? getErrorMessage(submitError)
    : undefined;

  if (submitErrorText || dynamicError) {
    return submitErrorText ?? getErrorMessage(dynamicError);
  }

  // Editing also marks a field as touched, so it cannot indicate submission.
  if (!meta.isBlurred && submissionAttempts === 0) {
    return undefined;
  }

  const clientError =
    dynamicError ?? (meta.isDirty ? changeError : (blurError ?? changeError));

  return clientError ? getErrorMessage(clientError) : undefined;
};
