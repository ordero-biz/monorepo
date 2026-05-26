import { getErrorMessage } from './error';

type FieldSubmitChangeErrorMeta = {
  errorMap: {
    onChange?: unknown;
    onSubmit?: unknown;
  };
  isBlurred: boolean;
};

export const getFieldSubmitChangeErrorText = (
  meta: FieldSubmitChangeErrorMeta
) => {
  const submitError = meta.errorMap.onSubmit;
  const changeError = meta.errorMap.onChange;
  const submitErrorText = submitError
    ? getErrorMessage(submitError)
    : undefined;

  if (submitErrorText || !meta.isBlurred || !changeError) {
    return submitErrorText;
  }

  return getErrorMessage(changeError);
};
