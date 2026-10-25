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
  hasSubmitted?: boolean
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

  if (!meta.isBlurred && !(hasSubmitted ?? meta.isTouched)) {
    return undefined;
  }

  const clientError =
    dynamicError ?? (meta.isDirty ? changeError : (blurError ?? changeError));

  return clientError ? getErrorMessage(clientError) : undefined;
};
