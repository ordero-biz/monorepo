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
};

export const getFieldSubmitChangeErrorText = (
  meta: FieldSubmitChangeErrorMeta
) => {
  const submitError = meta.errorMap.onSubmit;
  const blurError = meta.errorMap.onBlur;
  const changeError = meta.errorMap.onChange;
  const dynamicError = meta.errorMap.onDynamic;
  const submitErrorText = submitError
    ? getErrorMessage(submitError)
    : undefined;

  if (submitErrorText || !meta.isBlurred) {
    return (
      submitErrorText ??
      (dynamicError ? getErrorMessage(dynamicError) : undefined)
    );
  }

  const clientError =
    dynamicError ?? (meta.isDirty ? changeError : (blurError ?? changeError));

  return clientError ? getErrorMessage(clientError) : undefined;
};
