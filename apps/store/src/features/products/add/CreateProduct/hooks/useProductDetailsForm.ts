import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import type { ProductDetailsEditorProps } from '../types';

type UseProductDetailsFormArgs = Pick<
  ProductDetailsEditorProps,
  'initialValues' | 'initialErrors' | 'onApply'
>;

export const useProductDetailsForm = ({
  initialValues,
  initialErrors,
  onApply,
}: UseProductDetailsFormArgs) => {
  const [snapshot] = useState(() => ({
    values: initialValues,
    errors: initialErrors,
  }));

  const form = useForm({
    defaultValues: snapshot.values,
    onSubmit: ({ value }) => onApply(value),
  });

  useEffect(() => {
    form.setErrorMap({ onSubmit: { fields: snapshot.errors } });
  }, [form, snapshot]);

  return { form };
};
