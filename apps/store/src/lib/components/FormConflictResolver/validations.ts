import { z } from 'zod';
import type { FormMergeChoice } from '@/lib/utils/form/comparison/mergeFormValues';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

const conflictChoiceSchema = z.enum(['local', 'server'], {
  error: 'Choose which value to keep.',
});

export const validateConflictChoice = ({
  value,
}: ValidationArgs<FormMergeChoice | undefined>) => {
  const result = conflictChoiceSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
