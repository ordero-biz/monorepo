import { createStore } from '@/lib/client/api/stores';
import { type AddStoreFormValues, addStoreSchema } from './validations';

export const submitAddStore = async (value: AddStoreFormValues) => {
  const validatedValue = addStoreSchema.parse(value);
  const result = await createStore(validatedValue);

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: result.error.fieldErrors,
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
