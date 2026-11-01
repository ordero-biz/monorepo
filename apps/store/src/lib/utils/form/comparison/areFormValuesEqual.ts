import { getChangedValues } from './getChangedValues';

export const areFormValuesEqual = (left: unknown, right: unknown) =>
  !getChangedValues({
    initialData: { value: left },
    submitData: { value: right },
  });
