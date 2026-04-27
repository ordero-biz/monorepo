type ErrorWithMessage = {
  message?: unknown;
};

export const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    typeof (error as ErrorWithMessage).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return 'This field needs attention.';
};
