import { getErrorMessage } from './error';

type FieldSubmitChangeErrorMeta = {
  errorMap: {
    onBlur?: unknown;
    onChange?: unknown;
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
  const submitErrorText = submitError
    ? getErrorMessage(submitError)
    : undefined;

  if (submitErrorText || !meta.isBlurred) {
    return submitErrorText;
  }

  const clientError = meta.isDirty ? changeError : (blurError ?? changeError);

  return clientError ? getErrorMessage(clientError) : undefined;
};
